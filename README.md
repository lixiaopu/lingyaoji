# 玄缘阁

一幅可以互动的水墨画卷。

玄缘阁是一个面向普通用户的东方神秘学互动体验网站，以中国传统水墨画与宣纸质感为核心视觉风格，提供今日灵签、五行能量测试、守护生肖，以及每日运势、爱情、事业、财富、十二生肖、十二星座等栏目。所有数据均为本地示例，不依赖付费 API，无需登录、支付或数据库。

## 技术栈

- 纯前端实现：`HTML5` + `CSS3` + `原生 JavaScript（ES Modules）`
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
├── css/style.css       # 水墨宣纸主题、动效、响应式样式
├── js/
│   ├── data.js         # 本地示例数据：灵签、五行、生肖、星座、运势文案
│   └── app.js          # 交互逻辑与页面渲染
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

- **今日灵签**：摇签动画、签文展示、关键词、幸运色、今日建议、重新抽取、复制分享
- **五行能量测试**：三个问题生成金/木/水/火/土性格结果，含性格关键词与建议
- **我的守护生肖**：按出生年份或点击属相生成生肖卡片
- **运势栏目**：每日运势、爱情运势、事业运势、财富运势，均支持刷新
- **生肖与星座**：卡片网格，支持翻转查看解读

## 定制与维护

- 修改文案或新增签文：编辑 `js/data.js` 中的 `lingqianData` 数组。
- 调整配色：编辑 `css/style.css` 顶部的 `:root` 变量。
- 新增栏目：在 `index.html` 添加 `section`，在 `js/app.js` 中添加对应渲染逻辑。

## 声明

本站所有运势内容均为本地随机生成的示例数据，仅供娱乐与互动体验，不构成任何专业命理或投资建议。
