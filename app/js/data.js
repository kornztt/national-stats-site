// 中国国家统计数据：全部数字出自国家统计局
// 《中华人民共和国2024年国民经济和社会发展统计公报》（2025年2月28日）
// 及国家统计局 2025 年 1 月 17 日发布的 2024 年经济运行情况。
// 金额为当年价格；增速为不变价格同比。
var STATS = {
  meta: {
    country: "中国",
    year: 2024,
    updated: "2025年2月28日",
    source: "国家统计局《中华人民共和国2024年国民经济和社会发展统计公报》"
  },
  gdp: {
    total: 134.91, unit: "万亿元", growth: 5.0,
    perCapita: 95749, perCapitaGrowth: 5.1,
    series: [
      { y: 2015, v: 68.89 }, { y: 2016, v: 74.64 }, { y: 2017, v: 83.20 },
      { y: 2018, v: 91.93 }, { y: 2019, v: 98.65 }, { y: 2020, v: 101.36 },
      { y: 2021, v: 114.92 }, { y: 2022, v: 120.47 }, { y: 2023, v: 126.06 },
      { y: 2024, v: 134.91 }
    ],
    quarters2024: [
      { q: "一季度", v: 5.3 }, { q: "二季度", v: 4.7 },
      { q: "三季度", v: 4.6 }, { q: "四季度", v: 5.4 }
    ],
    industries: [
      { name: "第一产业", value: 9.14, share: 6.8, growth: 3.5 },
      { name: "第二产业", value: 49.21, share: 36.5, growth: 5.3 },
      { name: "第三产业", value: 76.56, share: 56.7, growth: 5.0 }
    ]
  },
  population: {
    total: 140828, totalUnit: "万人", change: -139,
    urban: 94350, rural: 46478, urbanRate: 67.00, urbanRateUp: 0.84,
    births: 954, birthRate: 6.77, deaths: 1093, deathRate: 7.76, naturalRate: -0.99,
    age: [
      { name: "0–15岁", value: 23999, share: 17.1 },
      { name: "16–59岁", value: 85798, share: 60.9 },
      { name: "60岁及以上", value: 31031, share: 22.0 }
    ],
    sixtyFivePlus: { value: 22023, share: 15.6 },
    male: 71909, female: 68919, sexRatio: 104.34,
    urbanRateSeries: [
      { y: 2020, v: 63.89 }, { y: 2021, v: 64.72 }, { y: 2022, v: 65.22 },
      { y: 2023, v: 66.16 }, { y: 2024, v: 67.00 }
    ]
  },
  income: {
    national: 41314, nationalGrowth: 5.3, nationalReal: 5.1,
    urban: 54188, urbanGrowth: 4.6, rural: 23119, ruralGrowth: 6.6,
    median: 34707,
    quintiles: [
      { group: "低收入组", value: 9542 },
      { group: "中间偏下收入组", value: 21608 },
      { group: "中间收入组", value: 33925 },
      { group: "中间偏上收入组", value: 53359 },
      { group: "高收入组", value: 98809 }
    ],
    consumption: 28227, engel: 29.8, serviceShare: 46.1,
    newJobs: 1256, unemployment: 5.1
  },
  prices: {
    cpi: 0.2, coreCpi: 0.5, ppi: -2.2,
    categories: [
      { name: "食品烟酒", v: -0.1 }, { name: "衣着", v: 1.4 },
      { name: "居住", v: 0.1 }, { name: "生活用品及服务", v: 0.5 },
      { name: "交通通信", v: -1.9 }, { name: "教育文化娱乐", v: 1.5 },
      { name: "医疗保健", v: 1.3 }, { name: "其他用品及服务", v: 3.8 }
    ],
    foodDetail: [
      { name: "鲜菜", v: 5.0 }, { name: "猪肉", v: 7.7 },
      { name: "鲜果", v: -3.5 }, { name: "粮食", v: -0.1 }
    ]
  },
  trade: {
    total: 43.85, totalGrowth: 5.0,
    exports: 25.45, exportGrowth: 7.1,
    imports: 18.39, importGrowth: 2.3,
    surplus: 7.06, beltRoadShare: 50.3, beltRoadGrowth: 6.4,
    machineryShare: 59.4, machineryGrowth: 8.7
  },
  regions: {
    areas: [
      { name: "东部地区", value: 70.24, growth: 5.0 },
      { name: "中部地区", value: 28.72, growth: 5.0 },
      { name: "西部地区", value: 28.74, growth: 5.2 },
      { name: "东北地区", value: 6.35, growth: 4.4 }
    ],
    belts: [
      { name: "京津冀地区", value: 11.54, growth: 5.2 },
      { name: "长江经济带", value: 63.02, growth: 5.4 },
      { name: "长三角地区", value: 33.17, growth: 5.5 }
    ],
    provinces: [
      { rank: 1, name: "广东", value: 14.16, growth: 3.5, region: "东部" },
      { rank: 2, name: "江苏", value: 13.70, growth: 5.8, region: "东部" },
      { rank: 3, name: "山东", value: 9.86, growth: 5.7, region: "东部" },
      { rank: 4, name: "浙江", value: 9.01, growth: 5.5, region: "东部" },
      { rank: 5, name: "四川", value: 6.47, growth: 5.7, region: "西部" },
      { rank: 6, name: "河南", value: 6.36, growth: 5.1, region: "中部" },
      { rank: 7, name: "湖北", value: 6.00, growth: 5.8, region: "中部" },
      { rank: 8, name: "福建", value: 5.78, growth: 5.5, region: "东部" },
      { rank: 9, name: "上海", value: 5.39, growth: 5.0, region: "东部" },
      { rank: 10, name: "湖南", value: 5.32, growth: 4.8, region: "中部" }
    ]
  }
};
