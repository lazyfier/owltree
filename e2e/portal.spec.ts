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

  test('unknown routes redirect home', async ({ page }) => {
    await page.goto('/#/unknown-module')
    await expect(page).toHaveURL(/#\/$/)
    await expect(page.locator('text=system online')).toBeVisible({ timeout: 10000 })
  })
})
