import { test, expect } from '@playwright/test'

test.describe('Portal homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/')
  })

  test('portal homepage loads with terminal theme', async ({ page }) => {
    await expect(page.locator('text=system online')).toBeVisible({ timeout: 10000 })
  })

  test('terminal modules are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'notes' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: 'projects' })).toBeVisible({ timeout: 10000 })
  })

  test('moon-throw route redirects home after removal', async ({ page }) => {
    await page.goto('/#/moon-throw')
    await expect(page).toHaveURL(/#\/$/)
    await expect(page.locator('text=system online')).toBeVisible({ timeout: 10000 })
  })

  test('removed games route redirects home', async ({ page }) => {
    await page.goto('/#/games')
    await expect(page).toHaveURL(/#\/$/)
    await expect(page.locator('text=system online')).toBeVisible({ timeout: 10000 })
  })
})
