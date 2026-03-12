const { test, expect } = require('@playwright/test')

test.describe('Погодний Віджет', () => {

  test('сторінка завантажується і показує пошуковий рядок', async ({ page }) => {
    await page.goto('/')

    const input = page.locator('input[placeholder="Введіть місто..."]')
    await expect(input).toBeVisible()
  })

  test('після вводу London зʼявляється погода для London', async ({ page }) => {
    await page.goto('/')

    // Чекаємо поки завантажиться початкова погода (Kyiv)
    await page.waitForTimeout(5000)

    const input = page.locator('input[placeholder="Введіть місто..."]')
    await input.fill('London')
    await input.press('Enter')

    // Чекаємо поки завантажиться London
    await page.waitForTimeout(6000)

    // Шукаємо h1 з текстом London — це назва міста у картці
    const cityName = page.locator('h1')
    await expect(cityName).toContainText('London', { timeout: 10000 })
  })

})