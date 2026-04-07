import { test, expect } from '@playwright/test'

test.describe('Portal homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/')
  })

  test('portal homepage loads', async ({ page }) => {
    await expect(page.locator('text=OWLTREE')).toBeVisible({ timeout: 10000 })
  })

  test('project grid is visible', async ({ page }) => {
    await expect(page.locator('text=PROJECTS')).toBeVisible({ timeout: 10000 })
  })

  test('navigation to moon-throw works', async ({ page }) => {
    await page.getByRole('link', { name: /进入|月抛/i }).first().click()
    await expect(page).toHaveURL(/#\/moon-throw/)
    await expect(page.locator('text=月抛模拟器')).toBeVisible({ timeout: 10000 })
  })

  test('navigation back to home works', async ({ page }) => {
    await page.goto('/#/moon-throw')
    await expect(page.locator('text=月抛模拟器')).toBeVisible({ timeout: 10000 })
    await page.locator('text=OWLTREE').first().click()
    await expect(page).toHaveURL(/#\/$/)
  })
})
