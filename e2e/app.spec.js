import { test, expect } from "@playwright/test";

// Helper functions
async function signUp(page, email, password) {
  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: "Sign up free" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Submit" }).click();
  // Wait for navigation or a success element
}

async function addCoffeeEntry(page, coffeeName, amount) {
  // First check if coffee card exists
  const coffeeCard = page.getByRole("button", { name: coffeeName });

  if (await coffeeCard.isVisible().catch(() => false)) {
    await coffeeCard.click();
  } else {
    // Otherwise use dropdown
    await page.getByRole("button", { name: "Latte 80 mg" }).click();
  }

  await page.getByPlaceholder("price").fill(amount);
  await page.locator("#hours-select").selectOption("2");
  await page.locator("#mins-select").selectOption("30");
;
  await page.getByRole("button", { name: "Add Entry" }).click();
}

// Main test
test("Signup, add coffee entries", async ({ page }) => {
  const email = "ttt@gmail.com";
  const password = "tttpass";

  // Signup
  await signUp(page, email, password);

  // Add coffee entries
  await addCoffeeEntry(page, "Latte", "4", "1");
  await addCoffeeEntry(page, "Mocha", "7.50", "3");

  // Assertions: check entries exist
  const activeCaffeine = page.locator('div.stat-card', { hasText: 'Active Caffeine Level' });
  await expect(activeCaffeine.locator('.stat-text')).toHaveText(/\d+/);
  await expect(activeCaffeine.locator('h5')).toHaveText('moderate'); 
});
