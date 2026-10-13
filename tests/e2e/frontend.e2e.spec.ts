import { test, expect } from '@playwright/test'

test.describe('Site public', () => {
  test("affiche la page d'accueil", async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Agence PISE/)
    await expect(page.locator('h1').first()).toBeVisible()
  })
})
