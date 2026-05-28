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
    await expect(page.getByRole('button', { name: 'tools' })).toBeVisible({ timeout: 10000 })
  })

  test('unknown routes redirect home', async ({ page }) => {
    await page.goto('/#/unknown-module')
    await expect(page).toHaveURL(/#\/$/)
    await expect(page.locator('text=system online')).toBeVisible({ timeout: 10000 })
  })

  test('short-link tool opens from the tools page', async ({ page }) => {
    await page.goto('/#/tools')
    await page.getByRole('button', { name: /short-link/ }).click()

    await expect(page).toHaveURL(/#\/tools\/short-link$/)
    await expect(page.getByRole('textbox', { name: 'Text to shorten' })).toBeVisible()
    await expect(page.getByRole('button', { name: /link text/i })).toBeVisible()
  })
})
