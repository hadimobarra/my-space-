"""Compiles fa messages.po into the JSON the Superset front end loads. Runs inside the container.
Fuzzy (unreviewed) entries are left out unless FUZZY=1."""
import json
import os
from babel.messages.pofile import read_po

d = "/app/superset/translations/fa/LC_MESSAGES"
catalog = read_po(open(f"{d}/messages.po", "rb"), locale="fa")
data = {"": {"domain": "superset", "plural_forms": "nplurals=2; plural=(n > 1);", "lang": "fa"}}
n = 0
for m in catalog:
    if not m.id or (m.fuzzy and os.environ.get("FUZZY") != "1"):
        continue
    key, strings = (m.id[0], list(m.string)) if isinstance(m.id, tuple) else (m.id, [m.string])
    if any(strings):
        data[key] = strings
        n += 1
json.dump({"domain": "superset", "locale_data": {"superset": data}}, open(f"{d}/messages.json", "w"), ensure_ascii=False)
print(n, "entries")
