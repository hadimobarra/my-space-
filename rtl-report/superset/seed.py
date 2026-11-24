"""Creates a small Persian dataset. Runs inside the Superset container."""
import sqlite3

c = sqlite3.connect("/app/superset_home/fa_test.db")
c.execute("DROP TABLE IF EXISTS sales")
c.execute("CREATE TABLE sales (day DATE, province TEXT, product TEXT, file_path TEXT, amount INTEGER, amount_fa TEXT)")
provinces = ["تهران", "اصفهان", "آذربایجان شرقی", "فارس", "خراسان رضوی"]
products = ["گوشی", "لپ‌تاپ (جدید)", "کتاب C++", "هدفون ۲۰۲۶"]
fa = str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹")
rows = []
for m in range(1, 13):
    for i, p in enumerate(provinces):
        n = 100 * (i + 1) + 17 * m
        rows.append((f"2026-{m:02d}-01", p, products[(m + i) % 4], f"/data/2026/{m:02d}/report (final).csv", n, str(n).translate(fa)))
c.executemany("INSERT INTO sales VALUES (?,?,?,?,?,?)", rows)
c.commit()
print(len(rows), "rows")
