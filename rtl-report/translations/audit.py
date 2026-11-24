"""Audits the Persian translations of Apache Superset and OpenMetadata.

    python3 -I rtl-report/translations/audit.py SUPERSET.po OM_FA.json OM_EN.json OUT_DIR

Writes summary.json and one review list per project. Standard library only.
"""
import csv
import json
import re
import sys
from pathlib import Path

PERSIAN = re.compile(r"[؀-ۿ]")
LATIN_WORD = re.compile(r"[A-Za-zÀ-ÿĀ-ž]{2,}")
# Letters that exist in Turkish or German but never in Persian or English interface text
FOREIGN = re.compile(r"[çğıöşüßÇĞİÖŞÜäÄ]|\b(?:ve|için|bir|ile|olarak|veya|değil|und|oder|nicht|der|die|das)\b")
# Arabic forms that look like Persian letters but are different characters and break search
ARABIC_FORMS = re.compile(r"[يكة]")  # ي ك ة
ARABIC_DIGITS = re.compile(r"[٠-٩]")
PO_PLACEHOLDER = re.compile(r"%\([A-Za-z_]\w*\)[sdrf]|%[sd]|\{\{?\s*[\w.]+\s*\}?\}")
I18N_PLACEHOLDER = re.compile(r"\{\{\s*[\w.\-]+\s*\}\}")
TAGS = re.compile(r"</?[A-Za-z0-9]+\s*/?>")


def unquote(line):
    return json.loads(line.strip()) if line.strip().startswith('"') else ""


def parse_po(path):
    entries, cur, field = [], None, None
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        line = raw.rstrip("\n")
        if not line.strip():
            if cur and cur.get("seen"):
                entries.append(cur)
            cur, field = None, None
            continue
        if cur is None:
            cur = {"id": "", "str": {}, "flags": "", "machine": False, "obsolete": False, "seen": False}
        if line.startswith("#~"):
            cur["obsolete"] = True
        elif line.startswith("#,"):
            cur["flags"] += line
        elif line.startswith("#"):
            if "Machine-translated" in line:
                cur["machine"] = True
        elif line.startswith("msgid_plural"):
            field = "plural"
        elif line.startswith("msgid"):
            cur["seen"], field = True, "id"
            cur["id"] += unquote(line[5:])
        elif line.startswith("msgstr"):
            m = re.match(r"msgstr(?:\[(\d+)\])?\s*(.*)", line)
            field = int(m.group(1) or 0)
            cur["str"][field] = unquote(m.group(2))
        elif line.startswith('"') and field is not None:
            if field == "id":
                cur["id"] += unquote(line)
            elif isinstance(field, int):
                cur["str"][field] += unquote(line)
    if cur and cur.get("seen"):
        entries.append(cur)
    return [e for e in entries if e["id"] and not e["obsolete"]]


def problems(source, text, placeholder):
    found = []
    if not text.strip():
        return ["untranslated"]
    words = LATIN_WORD.findall(source)
    if text.strip() == source.strip() and any(w.islower() or w.istitle() for w in words) and len(source) > 3:
        found.append("same as English")
    elif not PERSIAN.search(text) and LATIN_WORD.search(placeholder.sub("", TAGS.sub("", text))) and text.strip() != source.strip():
        found.append("not Persian")
    if FOREIGN.search(placeholder.sub("", text)) and not FOREIGN.search(source):
        found.append("other language")
    if sorted(p.replace(" ", "") for p in placeholder.findall(source)) != sorted(p.replace(" ", "") for p in placeholder.findall(text)):
        found.append("placeholder mismatch")
    if ARABIC_FORMS.search(text):
        found.append("Arabic letter forms")
    if ARABIC_DIGITS.search(text):
        found.append("Arabic digits")
    return found


def mark_reused(rows):
    """One Persian text for three or more clearly different English texts usually means a wrong guess."""
    groups = {}
    for r in rows:
        if len(r["text"]) > 8:
            groups.setdefault(r["text"].strip(), []).append(r)
    for group in groups.values():
        sources = {re.sub(r"[^a-z]", "", r["source"].lower()).rstrip("s") for r in group}
        if len(sources) >= 3:
            for r in group:
                r["problems"].append("reused text")


def count(rows, key):
    return sum(1 for r in rows if key in r["problems"])


KEYS = ["untranslated", "same as English", "not Persian", "other language", "placeholder mismatch", "Arabic letter forms", "Arabic digits", "reused text"]


def write(out, name, rows, fields):
    with open(Path(out) / f"{name}.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(fields)
        for r in rows:
            if r["problems"] or r.get("status") in ("machine, unreviewed", "fuzzy"):
                w.writerow([r["key"], r["source"], r["text"], r.get("status", ""), "; ".join(r["problems"])])


def flatten(obj, prefix=""):
    for k, v in obj.items():
        if isinstance(v, dict):
            yield from flatten(v, f"{prefix}{k}.")
        else:
            yield prefix + k, v


def main(po, om_fa, om_en, out):
    Path(out).mkdir(parents=True, exist_ok=True)
    superset = []
    for e in parse_po(po):
        text = e["str"].get(0, "")
        fuzzy = "fuzzy" in e["flags"]
        status = "machine, unreviewed" if fuzzy and e["machine"] else "fuzzy" if fuzzy else "translated" if text else "untranslated"
        superset.append({"key": "", "source": e["id"], "text": text, "status": status, "problems": problems(e["id"], text, PO_PLACEHOLDER)})
    mark_reused(superset)
    superset.sort(key=lambda r: (-len(r["problems"]), r["status"] == "translated", len(r["source"])))
    write(out, "superset-fa-review", superset, ["", "English", "Persian", "Status", "Automatic findings"])

    en = dict(flatten(json.loads(Path(om_en).read_text(encoding="utf-8"))))
    fa = dict(flatten(json.loads(Path(om_fa).read_text(encoding="utf-8"))))
    om = [{"key": k, "source": v, "text": fa.get(k, ""), "problems": problems(v, fa.get(k, ""), I18N_PLACEHOLDER)} for k, v in en.items()]
    mark_reused(om)
    om.sort(key=lambda r: (-len(r["problems"]), len(r["source"])))
    write(out, "openmetadata-fa-review", om, ["Key", "English", "Persian", "", "Automatic findings"])

    summary = {
        "superset": {"entries": len(superset), **{s: sum(1 for r in superset if r["status"] == s) for s in ["translated", "machine, unreviewed", "fuzzy", "untranslated"]}, "findings": {k: count(superset, k) for k in KEYS}},
        "openmetadata": {"entries": len(om), "findings": {k: count(om, k) for k in KEYS}},
    }
    (Path(out) / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=1))
    for name, rows in (("superset", superset), ("openmetadata", om)):
        for k in KEYS[1:]:
            sample = [(r["source"][:60], r["text"][:60]) for r in rows if k in r["problems"]][:5]
            print(name, k, sample)


if __name__ == "__main__":
    main(*sys.argv[1:])
