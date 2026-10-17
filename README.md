# 灵爻集

一幅可以互动的东方水墨画卷。

灵爻集是一个面向普通用户的东方神秘学互动体验网站，以极简清透的水墨与宣纸质感为核心视觉风格，提供今日灵签、五行能量测试、守护生肖，以及每日运势、爱情、事业、财富、十二生肖、十二星座等栏目。背景点缀水彩双锦鲤与淡蓝水色，页面点击处伴有水墨晕开动效。所有数据均为本地示例，不依赖付费 API，无需登录、支付或数据库。

## 技术栈

- 纯前端实现：`HTML5` + `CSS3` + `原生 JavaScript（ES Modules）`
- 字体：`LXGW WenKai`（霞鹜文楷）+ `Songti SC` 回退
- 无构建工具，无打包步骤，方便初学者维护
- 本地数据驱动，所有文案均来自 `js/data.js`

## 本地启动

因为项目使用了 ES Modules，请通过本地静态服务器打开，而不是直接双击 `index.html`。

### 方法一：使用 Node.js（推荐）

1. 确保已安装 [Node.js](https://nodejs.org/)。
2. 在项目根目录执行：

```bash
npm install
npm run start
```

3. 浏览器访问 `http://localhost:8080`。

### 方法二：使用任意静态服务器

如果你已经安装了 `serve`：

```bash
npx serve -s . -l 8080
```

或者使用 Python：

```bash
python -m http.server 8080
```

或者使用 VS Code 的「Live Server」插件直接右键 `index.html` → Open with Live Server。

## 项目结构

```
.
├── index.html          # 页面结构与单页路由入口
├── css/style.css       # 极简水墨主题、锦鲤背景、响应式样式
├── js/
│   ├── config.js       # 外部 API 默认值 + 本地覆盖文件探测
│   ├── config.local.example.js  # 本地 Key 覆盖文件模板（真实文件不入库）
│   ├── api.js          # API 接入层：老黄历、星座运势、一言、今日诗词
│   ├── data.js         # 本地示例数据 + API 降级备份数据
│   ├── app.js          # 交互逻辑与页面渲染
│   ├── ink-cursor.js   # 点击水墨晕开特效
│   └── muyu.js         # 电子木鱼小彩蛋
├── package.json        # 可选的 Node 启动配置
└── README.md
```

## 部署说明

本项目是纯静态站点，可直接部署到任何静态托管平台：

- [Vercel](https://vercel.com/) / [Netlify](https://www.netlify.com/) / [Cloudflare Pages](https://pages.cloudflare.com/)
- GitHub Pages
- 阿里云 / 腾讯云 / 七牛云对象存储静态网站

部署时只需把项目根目录下的 `index.html`、`css/`、`js/`、`package.json` 等文件上传即可。不需要运行构建命令。

## 主要功能

- **今日灵签**：弹性摇签动画、签文展示、关键词、幸运色、今日建议、重新抽取、复制分享
- **五行能量测试**：三个问题生成金/木/水/火/土性格结果，含性格关键词与建议
- **我的守护生肖**：按出生年份或点击属相生成生肖解读
- **运势栏目**：每日运势、爱情运势、事业运势、财富运势，均支持刷新
- **生肖与星座**：圆形翻转牌，点击查看解读
- **水墨晕开**：点击页面任意位置触发 Canvas 墨滴晕染特效
- **电子木鱼**：页面右下角的解压小彩蛋，敲一敲浮现「功德+1 / 烦恼-1 / 心静+1」淡墨文字
- **今日诗词**：首页画卷中央展示一句时令古诗词（今日诗词 API，失败时用本地诗库）
- **老黄历**：每日运势页展示干支、宜忌、吉神方位（天行数据，未配置 Key 时用本地推算）
- **星座实时指数**：十二星座卡片翻开时拉取当日综合指数与评语（天行数据，失败时本地生成）
- **一言寄语**：摇签与运势刷新时动态获取古风禅意短句（一言 API，失败时用本地句库）

## 外部 API 配置（可选）

本站采用「API 实时获取 + 本地双保险」策略：所有外部请求均有 3 秒超时与异常兜底，
失败时无缝降级为 `js/data.js` 中的本地备份数据，页面在任何网络环境下都能正常渲染。

- **天行数据**（可选）：在 [tianapi.com](https://www.tianapi.com/) 申请免费 Key 后，
  复制 `js/config.local.example.js` 为 `js/config.local.js` 并填入 `TIANAPI_KEY`，
  即可启用老黄历与星座运势的实时数据。`config.local.js` 已被 `.gitignore` 忽略，
  Key 不会进入 git 历史，也不会随代码提交到公开仓库。
- **一言 / 今日诗词**：无需 Key，联网时自动使用实时数据。

## 定制与维护

- 修改文案或新增签文：编辑 `js/data.js` 中的 `lingqianData` 数组。
- 调整配色：编辑 `css/style.css` 顶部的 `:root` 变量。
- 新增栏目：在 `index.html` 添加 `section`，在 `js/app.js` 中添加对应渲染逻辑。

## 声明

本站所有运势内容均为本地随机生成的示例数据，仅供娱乐与互动体验，不构成任何专业命理或投资建议。
