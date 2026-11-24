// Creates the test database, dataset, charts and dashboard through Superset's REST API.
const BASE = process.env.SUPERSET_URL ?? "http://127.0.0.1:8088";
const json = { "Content-Type": "application/json" };
const post = async (path, body, headers = {}) => {
  const r = await fetch(BASE + path, { method: "POST", headers: { ...json, ...headers }, body: JSON.stringify(body) });
  const text = await r.text();
  if (!r.ok) throw new Error(`${path} ${r.status} ${text.slice(0, 400)}`);
  return JSON.parse(text);
};
const { access_token } = await post("/api/v1/security/login", { username: "admin", password: "admin", provider: "db", refresh: false });
const auth = { Authorization: `Bearer ${access_token}` };

const db = await post("/api/v1/database/", { database_name: "آزمون فارسی", sqlalchemy_uri: "sqlite:////app/superset_home/fa_test.db", expose_in_sqllab: true }, auth);
const ds = await post("/api/v1/dataset/", { database: db.id, schema: "main", table_name: "sales" }, auth);
const metric = { expressionType: "SQL", sqlExpression: "SUM(amount)", label: "جمع فروش" };
const chart = async (name, viz, params) => (await post("/api/v1/chart/", {
  slice_name: name, viz_type: viz, datasource_id: ds.id, datasource_type: "table",
  params: JSON.stringify({ viz_type: viz, datasource: `${ds.id}__table`, time_range: "No filter", row_limit: 1000, ...params }),
}, auth)).id;
const charts = [
  await chart("فروش هر استان", "echarts_timeseries_bar", { x_axis: "province", metrics: [metric], groupby: [], show_legend: true, rich_tooltip: true }),
  await chart("روند فروش ۲۰۲۶ (Monthly)", "echarts_timeseries_line", { x_axis: "day", time_grain_sqla: "P1M", metrics: [metric], groupby: ["province"], show_legend: true }),
  await chart("جدول فروش", "table", { query_mode: "raw", all_columns: ["province", "product", "file_path", "amount", "amount_fa"], page_length: 10 }),
];
const row = (ids) => ({ type: "ROW", id: `ROW-${ids[0]}`, children: ids.map((i) => `CHART-${i}`), parents: ["ROOT_ID", "GRID_ID"], meta: { background: "BACKGROUND_TRANSPARENT" } });
const rows = [[charts[0], charts[1]], [charts[2]]];
const position = {
  DASHBOARD_VERSION_KEY: "v2",
  ROOT_ID: { type: "ROOT", id: "ROOT_ID", children: ["GRID_ID"] },
  GRID_ID: { type: "GRID", id: "GRID_ID", children: rows.map((r) => `ROW-${r[0]}`), parents: ["ROOT_ID"] },
  HEADER_ID: { type: "HEADER", id: "HEADER_ID", meta: { text: "داشبورد فروش" } },
  ...Object.fromEntries(rows.map((r) => [`ROW-${r[0]}`, row(r)])),
  ...Object.fromEntries(charts.map((id) => [`CHART-${id}`, { type: "CHART", id: `CHART-${id}`, children: [], parents: ["ROOT_ID", "GRID_ID"], meta: { chartId: id, width: id === charts[2] ? 12 : 6, height: 50 } }])),
};
const dash = await post("/api/v1/dashboard/", { dashboard_title: "داشبورد فروش", position_json: JSON.stringify(position), published: true }, auth);
for (const id of charts) await fetch(`${BASE}/api/v1/chart/${id}`, { method: "PUT", headers: { ...json, ...auth }, body: JSON.stringify({ dashboards: [dash.id] }) });
console.log(JSON.stringify({ dashboard: dash.id, charts }));
