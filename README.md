# 数观中国 · 中国国家统计数据站

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/kornztt/national-stats-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/kornztt/national-stats-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

中国国家统计数据站：国内生产总值、人口、就业与收入、物价、贸易、地区对比。全部数字出自国家统计局《中华人民共和国 2024 年国民经济和社会发展统计公报》（2025 年 2 月 28 日），每个数字都标来源与年份。

- 纯静态站：`app/` 下 index.html + 自写 CSS/JS，零网络请求，不用任何框架
- 图表全部手写 SVG：GDP 十年折线、三次产业环形、省份柱状、CPI 横向条形、人口结构环形
- 控件全部真的起作用：栏目路由、年份切换、图表类型切换、省份搜索/排序/地区筛选
- 本地打开：`python3 -m http.server` 在 `app/` 下起服务，访问 index.html

参赛作品：make.fun 比赛 best-national-statistics-site-20261126-0539。
