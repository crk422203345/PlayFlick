# PlayFlick

PlayFlick 是一个面向中文用户的短剧与小游戏聚合前端。项目以 Vue 3、TypeScript、Vite 和 Tailwind CSS 构建，包含首页、短剧专区、小游戏专区、关于我们、双主题和站内分类搜索。

## 技术结构

- `src/App.vue`：Hash 路由、浏览器前进/后退、页面按需加载和全局搜索分发
- `src/pages/`：首页、短剧、小游戏和品牌页面
- `src/components/`：导航、内容卡片、图片容错、空状态和主题控件
- `src/api/`：短剧与小游戏接口封装
- `src/utils/content.ts`：接口数据适配、计数格式化、搜索匹配和内容兜底
- `src/data/playflick.ts`：接口不可用时的本地精选内容

页面使用远端数据优先、本地内容兜底的策略。远端封面因防盗链或网络问题加载失败时，`SmartImage` 会自动替换为稳定封面。

## 本地开发

```sh
npm install
npm run dev
```

类型检查与生产构建：

```sh
npm run type-check
npm run build
npm run test:e2e
npm run preview
```

完整回归检查可运行 `npm run check`，会依次执行类型检查、生产构建和浏览器测试。

## 环境变量

可在 `.env.local` 中覆盖以下配置：

```ini
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=15000
VITE_TV_API_BASE_URL=https://tv.bingo.vip/sqx_fast
VITE_GAME_API_BASE_URL=/game-api
VITE_GAME_API_TARGET=https://g.bingo.vip
VITE_GAME_API_KEY=XC9RdtCC
VITE_GAME_APP_ID=2
```

`VITE_GAME_API_BASE_URL` 默认使用同源 `/game-api`。Vite 开发与预览服务器已经配置代理；生产部署时也必须在网关配置同名反向代理，否则页面会自动退回本地精选游戏。

Nginx 示例：

```nginx
location /game-api/ {
  proxy_pass https://g.bingo.vip/;
  proxy_set_header Host g.bingo.vip;
  proxy_ssl_server_name on;
}
```

## 交互约定

内部页面使用 `#/dramas`、`#/games` 等 Hash 地址，静态托管不需要额外配置 SPA 回退。内容详情与会员、福利等业务链路会跳转至对应的短剧或游戏平台。
