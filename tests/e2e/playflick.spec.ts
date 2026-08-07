import { expect, test, type Page, type Route } from '@playwright/test'

const transparentPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2c+oAAAAASUVORK5CYII=',
  'base64',
)

const gameImage =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect width="4" height="3" fill="#00bfa5"/></svg>',
  )

const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  })

const mockApi = async (page: Page, fail = false) => {
  const thirdPartyAuthorizationHeaders: Array<string | undefined> = []

  await page.route('https://images.unsplash.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'image/png', body: transparentPng }),
  )

  await page.route('**/sqx_fast/banner/selectBannerList**', (route) => {
    thirdPartyAuthorizationHeaders.push(route.request().headers().authorization)
    if (fail) return json(route, { message: 'banner unavailable' }, 503)
    return json(route, {
      code: 0,
      msg: 'success',
      data: [
        {
          id: 1,
          name: '自动化测试短剧',
          imageUrl: 'https://playlet001.oss-accelerate.aliyuncs.com/test/banner.png',
          state: 1,
          languageName: '简体中文',
        },
      ],
    })
  })

  await page.route('**/sqx_fast/app/courseClassification/queryClassification**', (route) => {
    thirdPartyAuthorizationHeaders.push(route.request().headers().authorization)
    if (fail) return json(route, { message: 'category unavailable' }, 503)
    return json(route, {
      code: 0,
      msg: 'success',
      data: [
        { classificationId: 23, classificationName: '言情' },
        { classificationId: 25, classificationName: '都市' },
      ],
    })
  })

  await page.route('**/sqx_fast/app/course/selectCourse**', (route) => {
    thirdPartyAuthorizationHeaders.push(route.request().headers().authorization)
    if (fail) return json(route, { message: 'course unavailable' }, 503)

    const url = new URL(route.request().url())
    const limit = Number(url.searchParams.get('limit')) || 20
    const list = Array.from({ length: limit }, (_, index) => ({
      courseId: index + 1,
      courseDetailsId: index + 101,
      title: index === 0 ? '甜宠测试剧' : `测试短剧 ${index + 1}`,
      img: `https://playlet001.oss-accelerate.aliyuncs.com/test/${index + 1}.png`,
      titleImg: '',
      classificationName: index % 2 === 0 ? '言情' : '都市',
      goodNum: 20_000 + index,
      viewCounts: 100 + index,
      status: 1,
      isDelete: 0,
    }))

    return json(route, {
      code: 0,
      msg: 'success',
      data: {
        totalCount: list.length,
        pageSize: limit,
        totalPage: 1,
        currPage: 1,
        list,
      },
    })
  })

  await page.route('**/game-api/box/game/gamestypes', (route) => {
    thirdPartyAuthorizationHeaders.push(route.request().headers().authorization)
    if (fail) return json(route, { message: 'game types unavailable' }, 503)
    return json(route, {
      c: [
        { id: 0, name: '全部游戏' },
        { id: 1, name: '策略经营' },
      ],
    })
  })

  await page.route('**/game-api/box/Gameindex/alltypegame', (route) => {
    thirdPartyAuthorizationHeaders.push(route.request().headers().authorization)
    if (fail) return json(route, { message: 'games unavailable' }, 503)

    const list = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      pic1: gameImage,
      pic4: gameImage,
      downloadnum: String(500 - index),
      gamename: index === 0 ? '三国策略场' : `测试游戏 ${index + 1}`,
      typeword: index === 0 ? '策略经营' : '休闲益智',
      gametype: index === 0 ? '策略经营' : '休闲益智',
      gametypes: [index === 0 ? '策略经营' : '休闲益智'],
    }))

    return json(route, {
      lists: list,
      now_page: 1,
      total_number: list.length,
      total_page: 1,
    })
  })

  return thirdPartyAuthorizationHeaders
}

test('desktop navigation, search, and browser history stay in sync', async ({ page }) => {
  const authorizationHeaders = await mockApi(page)
  await page.addInitScript(() => localStorage.setItem('playflick_token', 'private-token'))

  await page.goto('/')
  await expect(page).toHaveURL(/#\/$/)
  await expect(page).toHaveTitle('首页 | PlayFlick')
  await expect(page.getByRole('heading', { name: '短剧推荐' })).toBeVisible()

  await page.getByText('短剧专区', { exact: true }).first().click()
  await expect(page).toHaveURL(/#\/dramas$/)
  await expect(page.getByRole('heading', { name: '短剧专区' })).toBeVisible()
  await expect(page.locator('main article[role="link"]')).toHaveCount(20)

  await page.goBack()
  await expect(page).toHaveURL(/#\/$/)
  await expect(page.getByRole('heading', { name: '短剧推荐' })).toBeVisible()

  await page.getByText('小游戏专区', { exact: true }).first().click()
  await expect(page).toHaveURL(/#\/games$/)
  await expect(page.getByText('当前展示 20 款')).toBeVisible()

  await page.getByLabel('搜索短剧或小游戏').first().fill('三国')
  await page.locator('.search-scope-button').nth(1).click()
  await expect(page).toHaveURL(/#\/discover\?q=%E4%B8%89%E5%9B%BD&scope=game$/)
  await expect(page.getByRole('heading', { name: '发现' })).toBeVisible()
  await expect(page.getByText(/“三国”/).first()).toBeVisible()
  await expect(page.locator('main article')).toHaveCount(1)

  await page.goBack()
  await expect(page).toHaveURL(/#\/games$/)
  await expect(page.getByLabel('搜索短剧或小游戏').first()).toHaveValue('')

  await page.goForward()
  await expect(page).toHaveURL(/#\/discover\?q=%E4%B8%89%E5%9B%BD&scope=game$/)
  await expect(page.getByLabel('搜索短剧或小游戏').first()).toHaveValue('三国')
  expect(authorizationHeaders.filter(Boolean)).toEqual([])
})

test('detail pages persist favorites and viewing history', async ({ page }) => {
  await mockApi(page)
  await page.goto('/#/dramas')

  await page.locator('main article[role="link"]').first().click()
  await expect(page).toHaveURL(/#\/dramas\/course-1$/)
  await expect(page.getByRole('heading', { name: '甜宠测试剧' })).toBeVisible()

  await page.getByRole('button', { name: '加入片单' }).click()
  await expect(page.getByRole('button', { name: '已收藏' })).toBeVisible()
  await page.getByRole('button', { name: '我的片单' }).click()

  await expect(page).toHaveURL(/#\/library$/)
  await expect(page.getByRole('heading', { name: '我的片单' })).toBeVisible()
  await expect(page.getByText('甜宠测试剧').first()).toBeVisible()

  await page.reload()
  await expect(page.getByText('甜宠测试剧').first()).toBeVisible()
  await page.getByRole('button', { name: /最近浏览/ }).click()
  await expect(page.getByText('甜宠测试剧').first()).toBeVisible()
})

test('unknown routes provide recovery navigation', async ({ page }) => {
  await mockApi(page)
  await page.goto('/#/missing-page')

  await expect(page.getByRole('heading', { name: '这个页面没有上映' })).toBeVisible()
  await page.getByText('返回首页', { exact: true }).click()
  await expect(page).toHaveURL(/#\/$/)
})

test('new pages remain within the mobile viewport', async ({ page }) => {
  await mockApi(page)
  await page.setViewportSize({ width: 390, height: 844 })

  for (const path of [
    '/#/discover',
    '/#/rankings',
    '/#/library',
    '/#/business',
    '/#/legal/privacy',
  ]) {
    await page.goto(path)
    await expect(page.locator('main')).toBeVisible()
    const layout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }))
    expect(layout.documentWidth, path).toBeLessThanOrEqual(layout.viewportWidth)
  }
})

test('mobile menu is opaque, searchable, and does not overflow', async ({ page }) => {
  await mockApi(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await page.getByRole('button', { name: '打开菜单' }).click()
  const menu = page.locator('#mobile-navigation')
  await expect(menu).toBeVisible()

  await page.getByLabel('搜索短剧或小游戏').last().fill('甜宠')
  await expect(page.getByRole('button', { name: '搜短剧' })).toBeVisible()
  await expect(page.getByRole('button', { name: '搜游戏' })).toBeVisible()

  const layout = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    menuBackground: getComputedStyle(document.querySelector('#mobile-navigation')!).backgroundColor,
  }))
  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth)
  expect(layout.menuBackground).toMatch(/^rgb\(/)

  const previousTheme = await page.locator('html').getAttribute('data-theme')
  await page.getByRole('button', { name: /切换到.+模式/ }).click()
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', previousTheme || '')
})

test('local content remains usable when third-party APIs fail', async ({ page }) => {
  await mockApi(page, true)
  await page.goto('/#/dramas')

  await expect(page.getByRole('heading', { name: '短剧专区' })).toBeVisible()
  await expect(page.locator('main article[role="link"]')).toHaveCount(12)
  await expect(page.getByText(/当前展示备用内容/)).toBeVisible()

  await page.getByText('小游戏专区', { exact: true }).first().click()
  await expect(page.getByRole('heading', { name: '小游戏专区' })).toBeVisible()
  await expect(page.locator('main article')).toHaveCount(10)
  await expect(page.getByText(/当前展示备用内容/)).toBeVisible()
})
