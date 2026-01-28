import { test, expect } from '@playwright/test';

test('auth page has expected content and sidebar color', async ({ page }) => {
  // Set a desktop viewport
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto('http://localhost:5173/auth');

  // Check for the main heading
  await expect(page.locator('h1').first()).toHaveText('Acesse sua conta');

  // Check for the green sidebar
  const sidebar = page.getByTestId('auth-sidebar');
  await expect(sidebar).toBeVisible();
  await expect(sidebar).toHaveClass(/bg-primary/);

  // Take a screenshot
  await page.screenshot({ path: '/home/jules/verification/auth-page-desktop.png' });
});
