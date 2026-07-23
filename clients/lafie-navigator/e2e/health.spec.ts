import { test, expect } from '@playwright/test'

test("le shell affiche la marque et l'état du backend", async ({ page }) => {
  await page.goto('/')
  // Barre haute (brand)
  await expect(page.getByText('Lafie', { exact: true })).toBeVisible()
  // Widget Système : phase du backend via /api (proxy nginx -> backend)
  await expect(page.getByText(/0-skeleton/)).toBeVisible()
})
