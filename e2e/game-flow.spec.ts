import { test, expect } from '@playwright/test'

test.describe('Moon-Throw game flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/moon-throw')
    const startButton = page.getByRole('button', { name: '开始游戏' })
    if (await startButton.isVisible().catch(() => false)) {
      await startButton.click()
    }
  })

  test('game page loads with correct initial state', async ({ page }) => {
    await expect(page.locator('text=月抛模拟器')).toBeVisible({ timeout: 10000 })
  })

  test('action buttons are present', async ({ page }) => {
    await expect(page.getByRole('button', { name: /口交/ }).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /性交/ }).first()).toBeVisible({ timeout: 10000 })
  })

  test('stats panel shows initial values', async ({ page }) => {
    await expect(page.getByText(/\d+%/).first()).toBeVisible({ timeout: 10000 })
  })

  test('partner card renders with avatar', async ({ page }) => {
    const partnerAvatar = page.getByTestId('partner-avatar')
    await expect(partnerAvatar).toBeVisible({ timeout: 10000 })
  })
})
