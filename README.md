# 车牌在线估值H5应用

基于 Vue 3 + Vite 技术开发的车牌估值H5 Web应用，支持现代浏览器。

## 功能特性

- 🚗 车牌号输入和验证
- 💰 智能估值算法
- 📊 详细的估值分析
- ⭐ 星级评价系统
- 🎨 美观的用户界面
- 📱 支持新能源车牌（F/D）

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **HTML/CSS** - 前端技术

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm run dev
```

## 构建生产版本

```bash
npm run build
```

构建后的文件会生成在 `dist` 目录下。

## 预览生产构建

```bash
npm run preview
```

## 项目结构

```
plate-valuation-h5/
├── index.html           # 主页面
├── src/
│   ├── main.ts          # 应用入口
│   ├── App.vue          # 根组件
│   ├── components/      # 组件目录
│   ├── utils/           # 工具函数
│   └── types/           # 类型定义
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
├── utils/
│   ├── valuation.js     # 估值算法
│   └── provinces.js     # 省份数据
├── assets/              # 资源文件（图标等）
├── package.json         # 项目配置
└── README.md           # 说明文档
```

## 使用说明

1. 启动应用后，点击车牌输入框
2. 按照提示依次输入：
   - 第1位：选择省份代码
   - 第2位：输入字母（A-Z，不含I、O）
   - 第3-7位：输入数字或字母
   - 第8位：可选，输入F（非插电）或D（纯电动）
3. 输入完成后点击"确认"按钮
4. 查看估值结果和分析

## 注意事项

- 车牌估值结果仅供娱乐，切勿当真
- 需要安装 Node.js 环境（推荐 v16+）
- 支持现代浏览器（Chrome、Firefox、Safari、Edge 等）

## 许可证

ISC

