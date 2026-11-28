// 七个栏目的渲染与路由。每个栏目都是真实内容，控件全部真的起作用。
var VIEWS = [
  { id: "overview", hash: "#/", name: "总览" },
  { id: "economy", hash: "#/economy", name: "经济" },
  { id: "population", hash: "#/population", name: "人口" },
  { id: "income", hash: "#/income", name: "就业与收入" },
  { id: "prices", hash: "#/prices", name: "物价" },
  { id: "trade", hash: "#/trade", name: "贸易" },
  { id: "regions", hash: "#/regions", name: "地区对比" }
];

function srcNote(text) {
  return '<p class="src-note">数据来源：' + escText(text) + '</p>';
}

function kpiCard(label, value, sub, note) {
  return '<div class="kpi"><div class="kpi-label">' + escText(label) + '</div>' +
    '<div class="kpi-value">' + escText(value) + '</div>' +
    '<div class="kpi-sub">' + escText(sub) + '</div>' +
    '<div class="kpi-note">' + escText(note) + '</div></div>';
}

function viewOverview() {
  var g = STATS.gdp, p = STATS.population, t = STATS.trade, inc = STATS.income;
  var line = lineChart(g.series.map(function (d) { return { x: String(d.y), v: d.v }; }), { w: 1080, h: 240, unit: "万亿元", color: "#c8402a" });
  var donut = donutChart(g.industries.map(function (d) { return { name: d.name, share: d.share }; }), { size: 165, thick: 30, centerTop: "134.91", centerBottom: "万亿元 GDP" });
  var regionBars = barChart(STATS.regions.areas.map(function (d) { return { x: d.name.replace("地区", ""), v: d.value }; }), { w: 560, h: 210, unit: "万亿元", colors: ["#1f4e79", "#2a7f6f", "#c9a227", "#7a5c9e"] });
  return '' +
  '<section class="card hero-chart"><div class="hero-chart-top"><div>' +
  '<div class="hero-kicker">2024 年 · 国家统计局统计公报</div>' +
  '<div class="hero-big">134.91<span class="hero-unit"> 万亿元</span></div>' +
  '<div class="hero-sub">国内生产总值 · 同比 +5.0% · 人均 GDP 95,749 元</div></div>' +
  '<div class="hero-side"><b>十年增长约 96%</b><span>2015 年 68.89 万亿元 → 2024 年 134.91 万亿元</span></div></div>' +
  '<h2>国内生产总值十年走势</h2>' + line +
  '<p class="card-note">2015–2024 年，单位万亿元。2024 年 GDP 比上年增长 5.0%，人均 GDP 95,749 元。</p><a class="more" href="#/economy">看经济详情 →</a></section>' +
  '<div class="kpi-grid">' +
    kpiCard("国内生产总值", "134.91 万亿元", "同比增长 +5.0%", "2024 年 · 国家统计局") +
    kpiCard("年末总人口", "14.08 亿", "城镇化率 67.0%", "2024 年末 · 国家统计局") +
    kpiCard("居民人均可支配收入", "41,314 元", "实际增长 +5.1%", "2024 年 · 国家统计局") +
    kpiCard("货物进出口总额", "43.85 万亿元", "同比增长 +5.0%", "2024 年 · 国家统计局") +
  '</div>' +
  '<div class="grid-2">' +
    '<div class="card"><h2>三次产业结构 · 2024 年</h2><div class="donut-wrap">' + donut + '<div class="legend">' + legendRow(g.industries.map(function (d) { return { name: d.name, share: d.share }; }), ["#c8402a", "#1f4e79", "#2a7f6f"]) + '</div></div>' +
    '<table class="mini-table"><tr><th>产业</th><th>增加值</th><th>占比</th><th>增速</th></tr>' +
    g.industries.map(function (d) { return "<tr><td>" + d.name + "</td><td>" + d.value + " 万亿元</td><td>" + d.share + "%</td><td>+" + d.growth + "%</td></tr>"; }).join("") + '</table></div>' +
    '<div class="card"><h2>四大地区生产总值 · 2024 年</h2>' + regionBars + '<p class="card-note">东部 70.24、中部 28.72、西部 28.74、东北 6.35 万亿元。</p><a class="more" href="#/regions">看地区对比 →</a></div>' +
  '</div>' +
  '<div class="card"><h2>物价与民生速览</h2><ul class="fact-list fact-cols">' +
    '<li><b>居民消费价格 CPI</b><span>2024 年上涨 0.2%，核心 CPI 上涨 0.5%</span></li>' +
    '<li><b>工业生产者出厂价 PPI</b><span>2024 年下降 2.2%</span></li>' +
    '<li><b>城镇新增就业</b><span>1,256 万人，城镇调查失业率平均 5.1%</span></li>' +
    '<li><b>人均消费支出</b><span>28,227 元，恩格尔系数 29.8%</span></li>' +
    '<li><b>出生人口</b><span>954 万人，自然增长率 -0.99‰</span></li></ul>' +
    '<div class="link-row"><a href="#/prices">物价 →</a><a href="#/income">就业与收入 →</a><a href="#/population">人口 →</a><a href="#/trade">贸易 →</a></div></div>' +
  srcNote(STATS.meta.source + "；金额为当年价格，增速为不变价格同比。本站为独立制作的数据展示站，与国家统计局官网无关。");
}

function gdpChartHTML(range, type) {
  var data = STATS.gdp.series;
  if (range === "5y") data = data.slice(-5);
  var pts = data.map(function (d) { return { x: String(d.y), v: d.v }; });
  if (type === "bar") return barChart(pts, { w: 560, h: 260, unit: "万亿元", colors: ["#c8402a"] });
  return lineChart(pts, { w: 560, h: 260, unit: "万亿元", color: "#c8402a" });
}

function viewEconomy() {
  var g = STATS.gdp;
  var qbars = barChart(g.quarters2024.map(function (d) { return { x: d.q, v: d.v }; }), { w: 560, h: 220, unit: "%", colors: ["#1f4e79"] });
  var donut = donutChart(g.industries.map(function (d) { return { name: d.name, share: d.share }; }), { size: 200, thick: 32, centerTop: "56.7%", centerBottom: "第三产业占比" });
  return '' +
  '<section class="page-head"><h1>经济 · 国内生产总值</h1><p>2024 年 GDP 134.91 万亿元，比上年增长 5.0%；人均 GDP 95,749 元，增长 5.1%。</p></section>' +
  '<div class="card"><h2>国内生产总值走势</h2>' +
  '<div class="controls"><div class="seg" id="gdp-range"><button data-range="10y" class="on">十年</button><button data-range="5y">近五年</button></div>' +
  '<div class="seg" id="gdp-type"><button data-type="line" class="on">折线</button><button data-type="bar">柱状</button></div></div>' +
  '<div id="gdp-chart">' + gdpChartHTML("10y", "line") + '</div>' +
  '<p class="card-note">单位：万亿元，当年价格。数据来源：国家统计局历年统计公报。</p></div>' +
  '<div class="grid-2">' +
  '<div class="card"><h2>三次产业 · 2024 年</h2><div class="donut-wrap">' + donut + '<div class="legend">' + legendRow(g.industries.map(function (d) { return { name: d.name, share: d.share }; }), ["#c8402a", "#1f4e79", "#2a7f6f"]) + '</div></div>' +
  '<table class="mini-table"><tr><th>产业</th><th>增加值（亿元）</th><th>占比</th><th>增速</th></tr>' +
  g.industries.map(function (d) { return "<tr><td>" + d.name + "</td><td>" + (d.value * 10000).toLocaleString("en-US") + "</td><td>" + d.share + "%</td><td>+" + d.growth + "%</td></tr>"; }).join("") + '</table></div>' +
  '<div class="card"><h2>分季度增速 · 2024 年</h2>' + qbars +
  '<p class="card-note">一季度 +5.3%，二季度 +4.7%，三季度 +4.6%，四季度 +5.4%。四季度环比增长 1.6%。</p>' +
  '<ul class="fact-list"><li><b>最终消费支出</b><span>拉动 GDP 增长 2.2 个百分点</span></li>' +
  '<li><b>资本形成总额</b><span>拉动 GDP 增长 1.3 个百分点</span></li>' +
  '<li><b>货物和服务净出口</b><span>拉动 GDP 增长 1.5 个百分点</span></li></ul></div>' +
  '</div>' +
  srcNote(STATS.meta.source + "。");
}

function viewPopulation() {
  var p = STATS.population;
  var ageDonut = donutChart(p.age.map(function (d) { return { name: d.name, share: d.share }; }), { size: 210, thick: 34, centerTop: "14.08亿", centerBottom: "2024 年末总人口" });
  var urbLine = lineChart(p.urbanRateSeries.map(function (d) { return { x: String(d.y), v: d.v }; }), { w: 560, h: 240, unit: "%", color: "#1f4e79", ymin: 60 });
  return '' +
  '<section class="page-head"><h1>人口 · 总量与结构</h1><p>2024 年末全国人口 140,828 万人，比上年末减少 139 万人；常住人口城镇化率 67.00%，提高 0.84 个百分点。</p></section>' +
  '<div class="grid-2">' +
  '<div class="card"><h2>年龄结构 · 2024 年末</h2><div class="donut-wrap">' + ageDonut + '<div class="legend">' + legendRow(p.age.map(function (d) { return { name: d.name, share: d.share }; }), ["#c8402a", "#1f4e79", "#2a7f6f"]) + '</div></div>' +
  '<table class="mini-table"><tr><th>年龄段</th><th>人口（万人）</th><th>占比</th></tr>' +
  p.age.map(function (d) { return "<tr><td>" + d.name + "</td><td>" + d.value.toLocaleString("en-US") + "</td><td>" + d.share + "%</td></tr>"; }).join("") +
  '<tr><td>其中 65 岁及以上</td><td>22,023</td><td>15.6%</td></tr></table></div>' +
  '<div class="card"><h2>城镇化率走势</h2>' + urbLine + '<p class="card-note">2020–2024 年常住人口城镇化率：63.89%、64.72%、65.22%、66.16%、67.00%。</p>' +
  '<ul class="fact-list"><li><b>城镇常住人口</b><span>94,350 万人，比上年末增加 1,083 万人</span></li>' +
  '<li><b>乡村常住人口</b><span>46,478 万人，减少 1,222 万人</span></li></ul></div>' +
  '</div>' +
  '<div class="grid-2">' +
  '<div class="card"><h2>出生与死亡 · 2024 年</h2><ul class="fact-list">' +
  '<li><b>出生人口</b><span>954 万人，出生率 6.77‰，比 2023 年增加 52 万人</span></li>' +
  '<li><b>死亡人口</b><span>1,093 万人，死亡率 7.76‰</span></li>' +
  '<li><b>自然增长率</b><span>-0.99‰，降幅比上年收窄</span></li></ul></div>' +
  '<div class="card"><h2>性别构成 · 2024 年末</h2><ul class="fact-list">' +
  '<li><b>男性人口</b><span>71,909 万人</span></li>' +
  '<li><b>女性人口</b><span>68,919 万人</span></li>' +
  '<li><b>总人口性别比</b><span>104.34（以女性为 100）</span></li>' +
  '<li><b>劳动年龄人口</b><span>16–59 岁 85,798 万人，占 60.9%</span></li></ul></div>' +
  '</div>' +
  srcNote(STATS.meta.source + "；人口数包括 31 个省、自治区、直辖市和现役军人的人口。");
}

function viewIncome() {
  var inc = STATS.income;
  var quintileBars = barChart(inc.quintiles.map(function (d) { return { x: d.group.replace("收入组", ""), v: d.value }; }), { w: 560, h: 240, unit: "元", colors: ["#1f4e79"] });
  return '' +
  '<section class="page-head"><h1>就业与收入 · 居民生活</h1><p>2024 年全国居民人均可支配收入 41,314 元，比上年名义增长 5.3%，扣除价格因素实际增长 5.1%。</p></section>' +
  '<div class="kpi-grid">' +
    kpiCard("全国人均可支配收入", "41,314 元", "名义 +5.3% · 实际 +5.1%", "2024 年") +
    kpiCard("城镇居民", "54,188 元", "名义 +4.6% · 实际 +4.4%", "2024 年") +
    kpiCard("农村居民", "23,119 元", "名义 +6.6% · 实际 +6.3%", "2024 年") +
    kpiCard("收入中位数", "34,707 元", "名义增长 +5.1%", "2024 年") +
  '</div>' +
  '<div class="grid-2">' +
  '<div class="card"><h2>五等份收入分组 · 2024 年</h2>' + quintileBars +
  '<table class="mini-table"><tr><th>分组</th><th>人均可支配收入（元）</th></tr>' +
  inc.quintiles.map(function (d) { return "<tr><td>" + d.group + "</td><td>" + d.value.toLocaleString("en-US") + "</td></tr>"; }).join("") + '</table></div>' +
  '<div class="card"><h2>就业与消费 · 2024 年</h2><ul class="fact-list">' +
  '<li><b>城镇新增就业</b><span>1,256 万人，比上年多 12 万人</span></li>' +
  '<li><b>城镇调查失业率</b><span>全年平均 5.1%</span></li>' +
  '<li><b>人均消费支出</b><span>28,227 元，名义增长 5.3%</span></li>' +
  '<li><b>恩格尔系数</b><span>29.8%，与上年持平</span></li>' +
  '<li><b>服务性消费占比</b><span>46.1%，提高 0.9 个百分点</span></li>' +
  '<li><b>农村收入增速快于城镇</b><span>农村 +6.6%，城镇 +4.6%（名义）</span></li></ul></div>' +
  '</div>' +
  srcNote(STATS.meta.source + "。");
}

function viewPrices() {
  var pr = STATS.prices;
  var catBars = hbarChart(pr.categories, { w: 560, labelW: 120, centerZero: true });
  var foodBars = hbarChart(pr.foodDetail, { w: 560, labelW: 120, centerZero: true, posColor: "#c8402a", negColor: "#2a7f6f" });
  return '' +
  '<section class="page-head"><h1>物价 · CPI 与 PPI</h1><p>2024 年居民消费价格比上年上涨 0.2%，扣除食品和能源的核心 CPI 上涨 0.5%；工业生产者出厂价格下降 2.2%。</p></section>' +
  '<div class="kpi-grid">' +
    kpiCard("CPI · 居民消费价格", "+0.2%", "12 月同比 +0.1%，环比持平", "2024 年全年") +
    kpiCard("核心 CPI", "+0.5%", "扣除食品和能源价格", "2024 年全年") +
    kpiCard("PPI · 工业生产者出厂价", "-2.2%", "购进价格同样下降 2.2%", "2024 年全年") +
    kpiCard("食品烟酒", "-0.1%", "鲜菜 +5.0%，猪肉 +7.7%，鲜果 -3.5%", "2024 年全年") +
  '</div>' +
  '<div class="grid-2">' +
  '<div class="card"><h2>CPI 八大类涨跌 · 2024 年</h2>' + catBars + '<p class="card-note">同比涨跌幅，单位 %。交通通信下降 1.9%，其他用品及服务上涨 3.8%。</p></div>' +
  '<div class="card"><h2>食品价格细项 · 2024 年</h2>' + foodBars + '<p class="card-note">食品烟酒类中：鲜菜 +5.0%，猪肉 +7.7%，鲜果 -3.5%，粮食 -0.1%。</p></div>' +
  '</div>' +
  srcNote(STATS.meta.source + "。");
}

function viewTrade() {
  var t = STATS.trade;
  var flowBars = barChart([{ x: "出口", v: t.exports }, { x: "进口", v: t.imports }], { w: 560, h: 240, unit: "万亿元", colors: ["#c8402a", "#1f4e79"] });
  return '' +
  '<section class="page-head"><h1>贸易 · 货物进出口</h1><p>2024 年货物进出口总额 43.85 万亿元，比上年增长 5.0%；出口 25.45 万亿元，增长 7.1%；进口 18.39 万亿元，增长 2.3%。</p></section>' +
  '<div class="kpi-grid">' +
    kpiCard("进出口总额", "43.85 万亿元", "同比增长 +5.0%", "2024 年") +
    kpiCard("出口", "25.45 万亿元", "同比增长 +7.1%", "2024 年") +
    kpiCard("进口", "18.39 万亿元", "同比增长 +2.3%", "2024 年") +
    kpiCard("贸易顺差", "7.06 万亿元", "出口减进口", "2024 年") +
  '</div>' +
  '<div class="grid-2">' +
  '<div class="card"><h2>出口与进口 · 2024 年</h2>' + flowBars + '<p class="card-note">单位：万亿元。12 月单月进出口总额 4.07 万亿元，同比增长 6.8%。</p></div>' +
  '<div class="card"><h2>贸易结构 · 2024 年</h2><ul class="fact-list">' +
  '<li><b>对共建“一带一路”国家进出口</b><span>增长 6.4%，占进出口总额 50.3%</span></li>' +
  '<li><b>机电产品出口</b><span>增长 8.7%，占出口总额 59.4%</span></li>' +
  '<li><b>服务贸易</b><span>7.52 万亿元，增长 14.4%</span></li>' +
  '<li><b>货物贸易顺差</b><span>7.06 万亿元</span></li></ul>' +
  '<p class="card-note">服务贸易数据来源：国家统计局 2024 年统计公报相关表述。</p></div>' +
  '</div>' +
  srcNote(STATS.meta.source + "；海关总署口径以国家统计局公报为准。");
}

var provSort = { key: "value", dir: -1 };
var provRegion = "全部";
var provQuery = "";

function provinceRows() {
  var rows = STATS.regions.provinces.slice();
  if (provRegion !== "全部") rows = rows.filter(function (r) { return r.region === provRegion; });
  if (provQuery) rows = rows.filter(function (r) { return r.name.indexOf(provQuery) !== -1; });
  rows.sort(function (a, b) {
    var k = provSort.key;
    var d = (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * provSort.dir;
    return d;
  });
  return rows;
}

function renderProvinceTable() {
  var rows = provinceRows();
  var body = rows.map(function (r) {
    return "<tr><td>" + r.rank + "</td><td>" + r.name + "</td><td>" + r.value.toFixed(2) + "</td><td>+" + r.growth.toFixed(1) + "%</td><td>" + r.region + "</td></tr>";
  }).join("");
  var el = document.getElementById("prov-body");
  if (el) el.innerHTML = body || '<tr><td colspan="5">没有符合条件的省份，换个关键词试试。</td></tr>';
  var count = document.getElementById("prov-count");
  if (count) count.textContent = "共 " + rows.length + " 个省（区、市），仅列 GDP 前十";
}

function viewRegions() {
  var r = STATS.regions;
  var areaBars = barChart(r.areas.map(function (d) { return { x: d.name.replace("地区", ""), v: d.value }; }), { w: 560, h: 195, unit: "万亿元", colors: ["#1f4e79", "#2a7f6f", "#c9a227", "#7a5c9e"] });
  return '' +
  '<section class="page-head"><h1>地区对比 · 省域经济</h1><p>2024 年东部地区生产总值 70.24 万亿元，中部 28.72 万亿元，西部 28.74 万亿元，东北 6.35 万亿元。</p></section>' +
  '<div class="card"><h2>四大地区生产总值 · 2024 年</h2>' + areaBars +
  '<p class="card-note">单位：万亿元。四大地区合计 134.03 万亿元，与全国 134.91 万亿元的差额来自地区与全国核算口径差异。</p></div>' +
  '<div class="card"><h2>GDP 前十省（区、市）· 2024 年</h2>' +
  '<div class="controls"><input id="prov-search" type="search" placeholder="搜省份，如：广东、江苏…" value="' + escText(provQuery) + '">' +
  '<div class="seg" id="prov-region">' + ["全部", "东部", "中部", "西部", "东北"].map(function (rg) {
    return '<button data-region="' + rg + '"' + (provRegion === rg ? ' class="on"' : "") + '>' + rg + '</button>';
  }).join("") + '</div></div>' +
  '<p class="card-note" id="prov-count"></p>' +
  '<table class="data-table"><thead><tr>' +
  '<th><button class="th-sort" data-key="rank">排名</button></th>' +
  '<th>省份</th>' +
  '<th><button class="th-sort" data-key="value">GDP（万亿元）</button></th>' +
  '<th><button class="th-sort" data-key="growth">增速</button></th>' +
  '<th>地区</th></tr></thead><tbody id="prov-body"></tbody></table>' +
  '<p class="card-note">广东连续 36 年居全国首位，占全国经济总量 10.5%。点击表头可按排名、GDP、增速排序。</p></div>' +
  '<div class="grid-2">' +
  '<div class="card"><h2>区域重大战略 · 2024 年</h2><ul class="fact-list">' +
  r.belts.map(function (b) { return '<li><b>' + b.name + '</b><span>' + b.value.toFixed(2) + ' 万亿元，增长 ' + b.growth.toFixed(1) + '%</span></li>'; }).join("") + '</ul></div>' +
  '<div class="card"><h2>省域看点</h2><ul class="fact-list">' +
  '<li><b>广东</b><span>14.16 万亿元，首破 14 万亿，连续 36 年第一</span></li>' +
  '<li><b>江苏</b><span>13.70 万亿元，增长 5.8%，增量 6,084 亿元居全国首位</span></li>' +
  '<li><b>四川 vs 河南</b><span>四川 6.47 万亿元，领先河南约 1,100 亿元，守住第五</span></li>' +
  '<li><b>增速最快</b><span>西藏 +6.3%、新疆 +6.1%，江苏、湖北、安徽、内蒙古、甘肃 +5.8%</span></li></ul></div>' +
  '</div>' +
  srcNote(STATS.meta.source + "；各省数据来自各省统计局发布的 2024 年经济数据。");
}

var RENDERERS = {
  overview: viewOverview,
  economy: viewEconomy,
  population: viewPopulation,
  income: viewIncome,
  prices: viewPrices,
  trade: viewTrade,
  regions: viewRegions
};

function currentViewId() {
  var h = location.hash || "#/";
  var id = h.replace(/^#\/?/, "").split("/")[0];
  return RENDERERS[id] ? id : "overview";
}

function renderView() {
  var id = currentViewId();
  var view = document.getElementById("view");
  view.innerHTML = RENDERERS[id]();
  document.querySelectorAll("#main-nav a").forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("href") === "#/" + (id === "overview" ? "" : id));
  });
  window.scrollTo(0, 0);
  if (id === "economy") wireEconomyControls();
  if (id === "regions") wireRegionControls();
}

function wireEconomyControls() {
  var range = "10y", type = "line";
  var rangeBox = document.getElementById("gdp-range");
  var typeBox = document.getElementById("gdp-type");
  function redraw() {
    var box = document.getElementById("gdp-chart");
    if (box) box.innerHTML = gdpChartHTML(range, type);
  }
  if (rangeBox) rangeBox.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    range = b.getAttribute("data-range");
    rangeBox.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
    redraw();
  });
  if (typeBox) typeBox.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    type = b.getAttribute("data-type");
    typeBox.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
    redraw();
  });
}

function wireRegionControls() {
  var search = document.getElementById("prov-search");
  var regionBox = document.getElementById("prov-region");
  renderProvinceTable();
  if (search) search.addEventListener("input", function () {
    provQuery = search.value.trim();
    renderProvinceTable();
  });
  if (regionBox) regionBox.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    provRegion = b.getAttribute("data-region");
    regionBox.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
    renderProvinceTable();
  });
  document.querySelectorAll(".th-sort").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-key");
      if (provSort.key === k) provSort.dir = -provSort.dir;
      else { provSort.key = k; provSort.dir = k === "value" || k === "growth" ? -1 : 1; }
      renderProvinceTable();
    });
  });
}
