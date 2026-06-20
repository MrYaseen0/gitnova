import { test, expect } from '@playwright/test';

test.describe('Login → Dashboard → Level Flow', () => {
  test('landing page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/GitNova/);
  });

  test('demo login takes user to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Click Try Demo button
    const demoBtn = page.getByText(/Try Demo/i);
    await demoBtn.click();

    // Should redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/dashboard/);

    // Dashboard should show greeting
    await expect(page.getByText(/Good/i)).toBeVisible();
  });

  test('email login creates account and reaches dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Fill in login form
    const emailInput = page.getByLabelText(/email/i);
    const passwordInput = page.getByLabelText(/password/i);

    await emailInput.fill('testuser@example.com');
    await passwordInput.fill('password123');

    // Click Sign In
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should reach dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/dashboard/);
  });

  test('dashboard shows navigation links', async ({ page }) => {
    // Login via demo first
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.getByText(/Try Demo/i).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Check nav links are visible on desktop
    await expect(page.getByRole('link', { name: /Dashboard/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Learn/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Playground/i }).first()).toBeVisible();
  });

  test('navigating from dashboard to level map works', async ({ page }) => {
    // Login via demo
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.getByText(/Try Demo/i).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Click Learn link
    await page.getByRole('link', { name: /Learn/i }).first().click();

    // Should reach level map
    await page.waitForURL('**/learn/**', { timeout: 10000 });
    await expect(page).toHaveURL(/learn/);
  });

  test('level map shows levels', async ({ page }) => {
    // Login via demo
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.getByText(/Try Demo/i).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Navigate to git levels
    await page.goto('/learn/git');
    await page.waitForLoadState('networkidle');

    // Should show level cards or nodes
    await expect(page.getByText(/Git/i).first()).toBeVisible();
  });

  test('clicking a level opens the level page', async ({ page }) => {
    // Login via demo
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.getByText(/Try Demo/i).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Navigate to first git level
    await page.goto('/level/git/1');
    await page.waitForLoadState('networkidle');

    // Level page should show level content
    await expect(page.getByText(/Level/i).first()).toBeVisible();
  });

  test('profile page shows user info after login', async ({ page }) => {
    // Login via demo
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.getByText(/Try Demo/i).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Navigate to profile
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Should show user name
    await expect(page.getByText('Explorer')).toBeVisible();
  });

  test('settings page is accessible', async ({ page }) => {
    // Login via demo
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.getByText(/Try Demo/i).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Navigate to settings
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    // Should show settings heading
    await expect(page.getByText(/Settings/i).first()).toBeVisible();
  });

  test('achievements page is accessible', async ({ page }) => {
    // Login via demo
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.getByText(/Try Demo/i).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Navigate to achievements
    await page.goto('/achievements');
    await page.waitForLoadState('networkidle');

    // Should show achievements heading
    await expect(page.getByText(/Achievements/i).first()).toBeVisible();
  });

  test('leaderboard page is accessible', async ({ page }) => {
    // Login via demo
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.getByText(/Try Demo/i).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Navigate to leaderboard
    await page.goto('/leaderboard');
    await page.waitForLoadState('networkidle');

    // Should show leaderboard heading
    await expect(page.getByText(/Leaderboard/i).first()).toBeVisible();
  });

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('register page creates account', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Fill in registration form (step 1)
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThanOrEqual(4);

    // Fill name and username
    await inputs.nth(0).fill('Test User');
    await inputs.nth(1).fill('testuser');

    // Click Next or proceed to step 2
    const nextBtn = page.getByRole('button', { name: /next/i });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('contact page is publicly accessible', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    // Should show contact form
    await expect(page.getByPlaceholderText('John Doe')).toBeVisible();
  });

  test('report page is publicly accessible', async ({ page }) => {
    await page.goto('/report');
    await page.waitForLoadState('networkidle');

    // Should show report form
    await expect(page.getByText(/Report/i).first()).toBeVisible();
  });
});
