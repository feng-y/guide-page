# AI Engineering 能力建设网站

站点：<https://feng-y.github.io/guide-page/ai-engineering/>

这是学习项目的持续维护入口，不是运行监控或自动评分系统。当前以评估与测量、Agent 运行及信息状态、模型与数据机制为三条基础主线。模型适配是应用任务；迁移是验收方式；不使用固定四阶段。

## 内容与权威

- `project.json`：项目目标、优先级依据、能力版图、当前单元、证据目录、资料与更新记录的唯一维护源。
- `lesson-01.md`：可选的 L01 参考材料，不管理项目进度。
- `index.html` / `styles.css` / `app.js`：页面、样式与交互。静态站点，不使用构建框架或外部运行依赖。
- 页面导出的 Taskbook、JSON 与 Library 文件均为版本快照；不单独修改它们来维护进度。

本项目内容不覆盖其他代码仓库的 AGENTS.md、源码和实验事实。历史报告不能作为当前环境状态。

## 持续更新

1. 修改 `project.json` 中受影响的目标、领域、`current` 或 `evidence`；不要只添加一个脱离目标的待办。
2. 对实质变化更新 `version`、`updated`，并在 `changes` 开头记录变更及理由。
3. 用 `python3 -m json.tool project.json` 检查 JSON；在浏览器核对受影响页面。
4. 提交到 `main`。仓库现有 `.github/workflows/pages.yml` 发布整个静态目录，无需新增构建流程。
5. 核对最新 Pages 工作流与线上内容版本。Git 提交历史用于追踪、比较和回退。

日常只改内容，不需要重新制作页面。资料链接和版本敏感机制在实际使用时核实，不凭站点更新时间宣称全部资料已复验。

## 本地预览

```sh
cd ai-engineering
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000/
```

直接使用 file:// 打开 index.html 可能被浏览器阻止读取 JSON；请通过 HTTP 预览。

## 交互与数据边界

支持导航、能力详情、分类筛选、站内搜索、当前问题的判断草稿、导出 JSON / Markdown 及续接说明。

草稿通过 localStorage 仅保存在当前浏览器，不会上传到 GitHub，不会跨设备自动同步，也不会自动标记能力完成。浏览器不允许存储时，页面提示使用导出。正式进展只通过核对后的 `project.json` 更新。

不收集分析数据，不包含模型 API key，不自动调用付费模型。没有后台学习任务或定时提醒。

## 完成判断

分别记录材料准备、实际系统结果、个人预测与迁移表现。没有证据时保持“尚未校准 / 尚未运行”。不生成能力雷达分数，也不把 PR、文件或阅读数量当作掌握证明。
