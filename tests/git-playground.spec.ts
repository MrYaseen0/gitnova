import { test, expect } from '@playwright/test';

test.describe('Git Playground Terminal', () => {
  test.beforeEach(async ({ page }) => {
    // Login via demo first
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.getByText(/Try Demo/i).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Navigate to playground
    await page.goto('/playground');
    await page.waitForLoadState('networkidle');
  });

  test('playground page loads with terminal', async ({ page }) => {
    // Wait for the terminal input to be ready
    await expect(page.locator('input[spellcheck="false"]')).toBeVisible({ timeout: 10000 });
  });

  test('git init initializes a repository', async ({ page }) => {
    const terminalInput = page.locator('input[spellcheck="false"]');
    await expect(terminalInput).toBeVisible({ timeout: 10000 });

    // Type git init
    await terminalInput.fill('git init');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    // Check output contains initialization message
    const outputs = page.locator('pre');
    const lastOutput = await outputs.last().textContent();
    expect(lastOutput).toContain('Initialized');
  });

  test('git init twice shows already-initialized message', async ({ page }) => {
    const terminalInput = page.locator('input[spellcheck="false"]');
    await expect(terminalInput).toBeVisible({ timeout: 10000 });

    // First init
    await terminalInput.fill('git init');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    // Second init
    await terminalInput.fill('git init');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    // Check output
    const outputs = page.locator('pre');
    const lastOutput = await outputs.last().textContent();
    expect(lastOutput).toContain('already');
  });

  test('git add stages a file', async ({ page }) => {
    const terminalInput = page.locator('input[spellcheck="false"]');
    await expect(terminalInput).toBeVisible({ timeout: 10000 });

    // Init
    await terminalInput.fill('git init');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    // Add file
    await terminalInput.fill('git add README.md');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    const outputs = page.locator('pre');
    const lastOutput = await outputs.last().textContent();
    expect(lastOutput).toContain('staged');
  });

  test('git commit creates a commit', async ({ page }) => {
    const terminalInput = page.locator('input[spellcheck="false"]');
    await expect(terminalInput).toBeVisible({ timeout: 10000 });

    // Init + add + commit
    await terminalInput.fill('git init');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    await terminalInput.fill('git add README.md');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    await terminalInput.fill('git commit -m "initial commit"');
    await terminalInput.press('Enter');
    await page.waitForTimeout(1000);

    // Check commit node appears in graph
    const graphNodes = page.locator('.react-flow__node');
    const nodeCount = await graphNodes.count();
    expect(nodeCount).toBeGreaterThanOrEqual(1);
  });

  test('git branch creates a new branch', async ({ page }) => {
    const terminalInput = page.locator('input[spellcheck="false"]');
    await expect(terminalInput).toBeVisible({ timeout: 10000 });

    // Init + add + commit
    await terminalInput.fill('git init');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    await terminalInput.fill('git add README.md');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    await terminalInput.fill('git commit -m "first"');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    // Create branch
    await terminalInput.fill('git branch feature');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    const outputs = page.locator('pre');
    const lastOutput = await outputs.last().textContent();
    expect(lastOutput).toContain('feature');
  });

  test('git status shows working tree status', async ({ page }) => {
    const terminalInput = page.locator('input[spellcheck="false"]');
    await expect(terminalInput).toBeVisible({ timeout: 10000 });

    // Init
    await terminalInput.fill('git init');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    // Status
    await terminalInput.fill('git status');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    const outputs = page.locator('pre');
    const lastOutput = await outputs.last().textContent();
    expect(lastOutput).toContain('On branch');
  });

  test('git log shows commit history', async ({ page }) => {
    const terminalInput = page.locator('input[spellcheck="false"]');
    await expect(terminalInput).toBeVisible({ timeout: 10000 });

    // Init + add + commit
    await terminalInput.fill('git init');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    await terminalInput.fill('git add README.md');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    await terminalInput.fill('git commit -m "my commit"');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    // Log
    await terminalInput.fill('git log');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    const outputs = page.locator('pre');
    const lastOutput = await outputs.last().textContent();
    expect(lastOutput).toContain('my commit');
  });

  test('unknown command shows error', async ({ page }) => {
    const terminalInput = page.locator('input[spellcheck="false"]');
    await expect(terminalInput).toBeVisible({ timeout: 10000 });

    await terminalInput.fill('git foobar');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    const outputs = page.locator('pre');
    const lastOutput = await outputs.last().textContent();
    expect(lastOutput).toContain('not a git command');
  });

  test('git commit without staged files shows error', async ({ page }) => {
    const terminalInput = page.locator('input[spellcheck="false"]');
    await expect(terminalInput).toBeVisible({ timeout: 10000 });

    await terminalInput.fill('git init');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    await terminalInput.fill('git commit -m "empty"');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    const outputs = page.locator('pre');
    const lastOutput = await outputs.last().textContent();
    expect(lastOutput).toContain('nothing to commit');
  });

  test('clear history button clears terminal', async ({ page }) => {
    const terminalInput = page.locator('input[spellcheck="false"]');
    await expect(terminalInput).toBeVisible({ timeout: 10000 });

    // Run a command
    await terminalInput.fill('git init');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);

    // Find and click clear history button
    const clearBtn = page.getByText(/Clear History/i);
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await page.waitForTimeout(500);

      // Terminal should have fewer outputs
      const outputs = page.locator('pre');
      const count = await outputs.count();
      expect(count).toBeLessThanOrEqual(1);
    }
  });
});
