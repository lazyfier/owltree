import { test, expect } from '@playwright/test'

test.describe('Portal homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/')
  })

  test('portal homepage loads with terminal theme', async ({ page }) => {
    await expect(page.locator('text=SYSTEM ONLINE')).toBeVisible({ timeout: 10000 })
  })

  test('terminal modules are visible', async ({ page }) => {
    await expect(page.locator('text=GAMES')).toBeVisible({ timeout: 10000 })
  })

  test('navigation to moon-throw works', async ({ page }) => {
    await page.goto('/#/games')
    await expect(page.locator('text=月抛模拟器')).toBeVisible({ timeout: 10000 })
    await page.getByText('月抛模拟器').click()
    await expect(page).toHaveURL(/#\/moon-throw/)
  })

  test('navigation back to home works', async ({ page }) => {
    await page.goto('/#/moon-throw')
    await expect(page.locator('text=月抛模拟器')).toBeVisible({ timeout: 10000 })
    await page.getByRole('link', { name: /返回首页/ }).click()
    await expect(page).toHaveURL(/#\/$/)
  })
})
