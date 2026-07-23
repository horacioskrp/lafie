import { test, expect } from '@playwright/test'

test("la page affiche le titre et l'état du backend", async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Lafie Navigator')).toBeVisible()
  // L'état backend est chargé via /api (proxy nginx -> backend).
  await expect(page.getByText(/0-skeleton|reachable|joignable/i)).toBeVisible()
})
