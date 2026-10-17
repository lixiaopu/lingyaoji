// 灵爻集 · 本地示例数据
// 全部文案为简体中文，不依赖外部 API

export const lingqianData = [
  {
    title: "云开见月",
    level: "ji",
    meaning: "迷雾渐散，心境清明。此前的犹豫将在今日松动，适合把一直想做的事先迈出第一步。",
    keywords: ["明朗", "决断", "转机"],
    luckyColor: "墨青",
    colorHex: "#2f4f4f",
    advice: "早晨整理一份待办清单，把最难的一项拆成三步，先做最小的一步。"
  },
  {
    title: "松鹤延年",
    level: "ji",
    meaning: "稳中求进，贵在和气。今日与人相处多一分耐心，会有意外的支持与好消息。",
    keywords: ["稳健", "人际", "长寿"],
    luckyColor: "米白",
    colorHex: "#f5f0e6",
    advice: "给一位许久未联系的长辈或朋友发一句问候，简单的话语最能暖人心。"
  },
  {
    title: "流水行云",
    level: "zhong",
    meaning: "顺其自然，不必强求。今日的变化像云像水，顺势而为反而能减少阻力。",
    keywords: ["柔韧", "随缘", "放松"],
    luckyColor: "烟灰",
    colorHex: "#7a7a7a",
    advice: "遇到计划外的事情，先深呼吸三次，再决定是否需要立刻处理。"
  },
  {
    title: "枯木逢春",
    level: "ji",
    meaning: "旧物新芽，失而复得。某个你以为已经无望的念头或关系，今天可能出现转机。",
    keywords: ["复苏", "希望", "新生"],
    luckyColor: "芽绿",
    colorHex: "#7a9e7a",
    advice: "整理旧物时或许会找到遗忘的灵感，随手记下来。"
  },
  {
    title: "小舟渡江",
    level: "zhong",
    meaning: "行事需量力，切忌冒进。今天适合小步试探，不宜把所有筹码押在一次决定上。",
    keywords: ["谨慎", "分步", "观察"],
    luckyColor: "浅褐",
    colorHex: "#9e8b7a",
    advice: "重要决定留到明天再确认，今天只收集信息。"
  },
  {
    title: "青山隐隐",
    level: "xiong",
    meaning: "远山可望，脚下需稳。今日容易高估自己的能力，凡事宜低调、守成。",
    keywords: ["守成", "低调", "自省"],
    luckyColor: "墨黑",
    colorHex: "#1c1c1c",
    advice: "少做承诺，多倾听。把力气花在修正已有计划，而非开新局。"
  },
  {
    title: "竹林听风",
    level: "zhong",
    meaning: "独处亦清欢，喧嚣不必追。今天适合留一点时间给自己，读书、喝茶、静坐皆宜。",
    keywords: ["独处", "静心", "内观"],
    luckyColor: "竹青",
    colorHex: "#4a7c6f",
    advice: "关掉一个通知来源，给自己留出半小时不被打扰的时间。"
  },
  {
    title: "明月入怀",
    level: "ji",
    meaning: "心怀坦荡，诸事顺遂。今日适宜表达善意与真情，关系会在坦诚中升温。",
    keywords: ["真诚", "包容", "光明"],
    luckyColor: "月白",
    colorHex: "#e8e8e8",
    advice: "对身边人说一句你平时不好意思说的感谢或赞美。"
  },
  {
    title: "雁过留声",
    level: "zhong",
    meaning: "凡事留痕，言行有度。今日沟通要注重方式，话到嘴边停三秒，可避免误会。",
    keywords: ["表达", "分寸", "记录"],
    luckyColor: "鸦青",
    colorHex: "#4a5560",
    advice: "重要事项用文字确认，口头约定容易在忙乱中被遗忘。"
  },
  {
    title: "寒梅著花",
    level: "xiong",
    meaning: "凌寒独放，需守初心。今日可能会感到压力，但坚持下去会看到旁人看不见的风景。",
    keywords: ["坚韧", "等待", "积累"],
    luckyColor: "梅红",
    colorHex: "#a6404e",
    advice: "不要与他人比较进度，专注自己的小目标。"
  }
];

export const wuxingData = {
  questions: [
    {
      id: "q1",
      text: "此刻你最想进入哪一种自然场景？",
      options: [
        { value: "金", text: "深秋矿野，金属矿石在阳光下闪光" },
        { value: "木", text: "雨后竹林，新叶上还挂着水珠" },
        { value: "水", text: "月夜湖面，雾气在水面缓缓流动" },
        { value: "火", text: "篝火营地，火光映亮众人的脸庞" },
        { value: "土", text: "黄昏田野，麦穗低垂、土地厚重" }
      ]
    },
    {
      id: "q2",
      text: "面对一件棘手的事，你的第一反应更接近？",
      options: [
        { value: "金", text: "迅速拆解问题，找出核心矛盾" },
        { value: "木", text: "从全局出发，寻找成长和长远方案" },
        { value: "水", text: "先退一步观察，等情势明朗" },
        { value: "火", text: "凭直觉行动，边做边调整" },
        { value: "土", text: "稳住节奏，先确保基本盘不出错" }
      ]
    },
    {
      id: "q3",
      text: "你更欣赏哪种生活状态？",
      options: [
        { value: "金", text: "利落果断，活得有棱角有原则" },
        { value: "木", text: "持续生长，每天都有新可能" },
        { value: "水", text: "顺势而为，保持流动与弹性" },
        { value: "火", text: "热情鲜活，把能量洒向热爱的事" },
        { value: "土", text: "安稳踏实，身边的人和事都牢靠" }
      ]
    }
  ],
  results: {
    金: {
      name: "金",
      title: "金行 · 断玉之声",
      color: "#8a8a8a",
      keywords: ["果决", "原则", "锋利", "收敛"],
      desc: "你的能量像秋金一样清冽利落，擅长在复杂局势中快速抓住要点。你重视原则与效率，说话做事自带边界感。缺点是偶尔显得冷淡或过于苛求完美。",
      advice: "今日宜佩戴金属质感或白色单品，做决定前允许自己多留一秒柔软。"
    },
    木: {
      name: "木",
      title: "木行 · 新叶扶疏",
      color: "#5c8a5c",
      keywords: ["生长", "包容", "规划", "仁厚"],
      desc: "你的能量如春日之木，向上生长，也愿意为他人遮阴。你擅长长期规划，心中常怀希望。需要注意的是，过度承担会让根系疲惫。",
      advice: "今日宜接触绿植，把宏大的目标拆成今天能完成的一件小事。"
    },
    水: {
      name: "水",
      title: "水行 · 润物无声",
      color: "#4a6f8a",
      keywords: ["柔韧", "洞察", "流动", "沉静"],
      desc: "你的能量像流水，善于绕过障碍、适应环境。你直觉敏锐，能在沉默中看清局势。缺点是遇到压力时容易逃避或沉溺情绪。",
      advice: "今日宜多喝水、散步或听流水声，把情绪像水一样轻轻放过。"
    },
    火: {
      name: "火",
      title: "火行 · 烛照四方",
      color: "#b83a2b",
      keywords: ["热情", "直觉", "表达", "行动"],
      desc: "你的能量如明火，热烈而明亮，能带动气氛、点燃他人的热情。你行动力强，灵感丰富。缺点是冲动和三分钟热度。",
      advice: "今日宜穿红色或橙色点缀，做一件事前先把步骤写下来，避免虎头蛇尾。"
    },
    土: {
      name: "土",
      title: "土行 · 厚德载物",
      color: "#9e8b7a",
      keywords: ["稳重", "承载", "守信", "务实"],
      desc: "你的能量如大地，可靠、厚重，给人安全感。你做事有条理，重视承诺。缺点是容易固守舒适区，不善于改变。",
      advice: "今日宜整理居住环境，尝试一件小事走出惯常节奏。"
    }
  }
};

export const zodiacAnimals = [
  { symbol: "🐭", name: "鼠", years: "2020、2008、1996、1984、1972", trait: "机敏灵活，善于在细微处发现机会，适应力极强。", advice: "今日多留意身边的信息差，小步快跑胜过孤注一掷。", element: "水" },
  { symbol: "🐮", name: "牛", years: "2021、2009、1997、1985、1973", trait: "踏实勤恳，耐力惊人，是可信赖的执行者。", advice: "今日适合推进长期项目，不必急于证明自己。", element: "土" },
  { symbol: "🐯", name: "虎", years: "2022、2010、1998、1986、1974", trait: "果敢自信，富有领导力，敢于挑战未知。", advice: "今日做决定前先倾听反对意见，锋芒内收更显力量。", element: "木" },
  { symbol: "🐰", name: "兔", years: "2023、2011、1999、1987、1975", trait: "温和细腻，善解人意，重视和谐与美感。", advice: "今日适合处理人际关系，一句体贴的话胜过十句道理。", element: "木" },
  { symbol: "🐲", name: "龙", years: "2024、2012、2000、1988、1976", trait: "志向远大，气场充沛，天生具有号召力。", advice: "今日宜把目光放低一寸，先把手边的小事做到极致。", element: "土" },
  { symbol: "🐍", name: "蛇", years: "2025、2013、2001、1989、1977", trait: "冷静睿智，洞察人心，擅长谋定而后动。", advice: "今日适合独处思考，重大计划暂时放在心里。", element: "火" },
  { symbol: "🐴", name: "马", years: "2026、2014、2002、1990、1978", trait: "自由奔放，行动力强，热爱探索与变化。", advice: "今日奔波前确认方向，停下来系紧鞋带并不丢人。", element: "火" },
  { symbol: "🐑", name: "羊", years: "2027、2015、2003、1991、1979", trait: "温柔内敛，富有艺术气质，重视情感归属。", advice: "今日适合创作与整理情绪，别把他人的评价当成全部。", element: "土" },
  { symbol: "🐵", name: "猴", years: "2028、2016、2004、1992、1980", trait: "聪明机变，富有创造力，善于化解尴尬。", advice: "今日机智要配上耐心，少说两句俏皮话，多做一件实事。", element: "金" },
  { symbol: "🐔", name: "鸡", years: "2029、2017、2005、1993、1981", trait: "勤勉自律，注重细节，有强烈的责任心。", advice: "今日宜放下挑剔，先完成再完美。", element: "金" },
  { symbol: "🐶", name: "狗", years: "2030、2018、2006、1994、1982", trait: "忠诚正直，重情重义，愿意为重要的人挺身而出。", advice: "今日守护他人的同时也别忘了照顾自己。", element: "土" },
  { symbol: "🐷", name: "猪", years: "2031、2019、2007、1995、1983", trait: "宽厚豁达，知足常乐，是天生的乐天派。", advice: "今日该吃吃该睡睡，好心情是最好的风水。", element: "水" }
];

export const westernZodiac = [
  { symbol: "♈", name: "白羊座", dates: "3.21 - 4.19", trait: "冲动热情，敢为人先，行动力爆棚。", advice: "今日想做的事立刻开个头，但别承诺自己做不到的事。" },
  { symbol: "♉", name: "金牛座", dates: "4.20 - 5.20", trait: "稳重务实，重视质感与安全感。", advice: "今日适合整理财务或置办小物，犒劳自己也是蓄能。" },
  { symbol: "♊", name: "双子座", dates: "5.21 - 6.21", trait: "机敏好奇，善于沟通，信息达人。", advice: "今日信息太多容易分心，锁定一个主题深入进去。" },
  { symbol: "♋", name: "巨蟹座", dates: "6.22 - 7.22", trait: "温柔顾家，情感细腻，直觉敏锐。", advice: "今日情绪起伏时，给自己泡杯热饮，先照顾好胃再处理事。" },
  { symbol: "♌", name: "狮子座", dates: "7.23 - 8.22", trait: "自信慷慨，喜欢被看见，领导气质。", advice: "今日发光的同时，记得把舞台也让给别人。" },
  { symbol: "♍", name: "处女座", dates: "8.23 - 9.22", trait: "细致严谨，追求完美，服务精神强。", advice: "今日允许一件事做到八分，把余力留给自己。" },
  { symbol: "♎", name: "天秤座", dates: "9.23 - 10.23", trait: "优雅圆融，重视平衡与关系。", advice: "今日犹豫时，问问内心真正想要的是什么。" },
  { symbol: "♏", name: "天蝎座", dates: "10.24 - 11.22", trait: "深沉专注，洞察力强，爱恨分明。", advice: "今日信任自己的直觉，但别让猜疑消耗关系。" },
  { symbol: "♐", name: "射手座", dates: "11.23 - 12.21", trait: "自由乐观，热爱冒险与哲学。", advice: "今日把远大的梦想写在纸上，分解到最近一周的行动。" },
  { symbol: "♑", name: "摩羯座", dates: "12.22 - 1.19", trait: "自律坚韧，目标明确，重视成就。", advice: "今日工作再忙也要起身活动十分钟，身体是最大的本钱。" },
  { symbol: "♒", name: "水瓶座", dates: "1.20 - 2.18", trait: "独立创新，思想前卫，重视友谊。", advice: "今日奇思妙想先记录下来，别急着否定它的可行性。" },
  { symbol: "♓", name: "双鱼座", dates: "2.19 - 3.20", trait: "浪漫共情，想象力丰富，艺术感知强。", advice: "今日适合听一首老歌或看一部短片，让想象力漫游。" }
];

export const fortuneTexts = {
  overall: [
    "今日整体气场平顺，像宣纸被风轻轻吹过。适合整理思绪、完成琐事。",
    "运势小有起伏，遇到阻碍时换个角度看，往往能找到新出口。",
    "今日贵人运在线，一句真诚的求助可能换来意料之外的支持。",
    "整体基调安静内敛，宜守不宜攻，把精力留给真正重要的人。",
    "今日适合断舍离，放下一件拖了很久的小事，心情会豁然开朗。"
  ],
  love: [
    "单身者容易在熟悉场景里遇见新话题；有伴者适合共进一顿安静的晚餐。",
    "今日情绪波动较大，说话前先停顿三秒，可避免不必要的误会。",
    "爱情运势温和上升，主动表达关心会让关系更近一步。",
    "旧人旧事可能浮现，不急着回应，给自己留一点空间。",
    "今日适合制造小惊喜，一张手写便签胜过昂贵的礼物。"
  ],
  career: [
    "工作效率不错，适合处理数据、文书与需要耐心的任务。",
    "会议沟通增多，少说多听，关键处再发言更有分量。",
    "今日适合向上管理，适时汇报进度会为你加分。",
    "遇到突发任务先评估优先级，不要盲目接下所有事情。",
    "创意灵感在午后出现，给自己留一段不被打扰的时间。"
  ],
  wealth: [
    "今日财运平稳，适合记账与审视近期的消费习惯。",
    "有小额进账或意外优惠的可能，但也容易冲动下单。",
    "投资不宜冒进，保守策略胜过追逐热点。",
    "适合整理闲置物品，断舍离的同时也可能回血一笔。",
    "为知识或体验花的一笔钱，未来会以另一种方式回报你。"
  ]
};

export const iconSvgs = {
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  mountain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 20L12 4L3 20H21Z"/><path d="M9 14L12 9L15 14"/></svg>`,
  coin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 10h6M9 14h6"/></svg>`,
  zodiac: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  fortune: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
  tube: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4C24 4 18 10 18 18v12c0 6 4 11 9 13v13c0 2 2 4 5 4s5-2 5-4V43c5-2 9-7 9-13V18C46 10 40 4 32 4z" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 20h20M22 28h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
};

/* ===== API 降级备份数据 =====
 * 网络请求失败、超时、未配置 TIANAPI_KEY 时使用，
 * 保证页面在任何情况下都能完整渲染。
 */

// 今日诗词（首页顶部展示）本地备选
export const poetryData = [
  { content: "山重水复疑无路，柳暗花明又一村。", title: "游山西村", author: "陆游", dynasty: "宋" },
  { content: "行到水穷处，坐看云起时。", title: "终南别业", author: "王维", dynasty: "唐" },
  { content: "竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。", title: "定风波", author: "苏轼", dynasty: "宋" },
  { content: "人生如逆旅，我亦是行人。", title: "临江仙·送钱穆父", author: "苏轼", dynasty: "宋" },
  { content: "若无闲事挂心头，便是人间好时节。", title: "颂平常心是道", author: "无门慧开", dynasty: "宋" },
  { content: "采菊东篱下，悠然见南山。", title: "饮酒·其五", author: "陶渊明", dynasty: "东晋" },
  { content: "心安身自安，身安室自宽。", title: "心安吟", author: "邵雍", dynasty: "宋" },
  { content: "宠辱不惊，闲看庭前花开花落。", title: "菜根谭", author: "洪应明", dynasty: "明" }
];

// 一言（灵签寄语 / 栏目刷新寄语）本地备选
export const quoteData = [
  { text: "菩提本无树，明镜亦非台。", from: "惠能" },
  { text: "本来无一物，何处惹尘埃。", from: "惠能" },
  { text: "一念放下，万般自在。", from: "禅语" },
  { text: "心似白云常自在，意如流水任东西。", from: "封神演义" },
  { text: "落花人独立，微雨燕双飞。", from: "翁宏" },
  { text: "静水流深，沧笙踏歌。", from: "古风" },
  { text: "千江有水千江月，万里无云万里天。", from: "雷庵正受" },
  { text: "不是风动，不是幡动，仁者心动。", from: "坛经" }
];

// 老黄历宜忌 / 吉神方位本地备选（干支由程序按日期推算）
export const lhlData = {
  yiPool: ["祭祀", "祈福", "出行", "会友", "纳财", "安床", "修造", "订盟", "开市", "栽种", "读书", "扫舍"],
  jiPool: ["诉讼", "远行", "破土", "安葬", "开仓", "伐木", "作灶", "词讼", "借贷"],
  gods: ["喜神", "福神", "财神"],
  directions: ["正北", "东北", "正东", "东南", "正南", "西南", "正西", "西北"]
};

// 星座指数本地备选（运势评语复用 fortuneTexts.overall 按日播种）
export const starIndexColors = ["墨青", "月白", "朱砂", "藤黄", "黛蓝", "竹青", "藕粉", "鸦青"];
