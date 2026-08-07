# PlayFlick

PlayFlick 是一个面向中文用户的短剧与小游戏聚合前端。项目以 Vue 3、TypeScript、Vue Router、Vite 和 Tailwind CSS 构建，包含内容发现、详情承接、综合榜单、本地片单、双主题和跨内容搜索。

## 技术结构

- `src/router/`：Hash 路由、动态详情地址、页面按需加载、滚动恢复和 404
- `src/App.vue`：应用框架、路由视图缓存、页面标题和全局搜索分发
- `src/pages/`：首页、发现、列表、详情、榜单、片单、品牌和平台规则页面
- `src/components/`：导航、内容卡片、图片容错、空状态和主题控件
- `src/composables/useLibrary.ts`：收藏、浏览历史和内容快照的本地持久化
- `src/api/`：短剧与小游戏接口封装
- `src/utils/content.ts`：接口数据适配、计数格式化、搜索匹配和内容兜底
- `src/data/playflick.ts`：接口不可用时的本地精选内容

页面使用远端数据优先、本地内容兜底的策略。远端封面因防盗链或网络问题加载失败时，`SmartImage` 会自动替换为稳定封面。收藏和浏览历史默认保存在当前浏览器中，不依赖登录即可使用。

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
VITE_TV_APP_URL=https://tv.bingo.vip
VITE_GAME_API_BASE_URL=/game-api
VITE_GAME_API_TARGET=https://g.bingo.vip
VITE_GAME_APP_URL=https://g.bingo.vip
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

内部页面使用 Hash 地址，静态托管不需要额外配置 SPA 回退：

- `#/discover`：跨短剧与游戏的发现和搜索
- `#/dramas`、`#/dramas/:id`：短剧列表与详情
- `#/games`、`#/games/:id`：游戏列表与详情
- `#/rankings`：短剧与游戏榜单
- `#/library`：收藏和最近浏览
- `#/about`、`#/business`、`#/legal/:document`：品牌、商务和平台规则

详情页中的“立即观看”和“开始游戏”会跳转至对应内容平台。

## 搜索接口

发现页会优先请求 `GET /search?q=<关键词>&scope=<all|drama|game>`，响应格式如下：

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "dramas": [],
    "games": []
  }
}
```

`dramas` 和 `games` 分别使用 `CourseApiItem` 与 `HotGameApiItem` 字段结构。搜索服务不可用时，页面会明确提示并降级为精选内容内匹配。
