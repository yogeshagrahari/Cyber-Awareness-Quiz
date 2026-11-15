import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('application loads canonical content and navigates between primary views', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Build the instinct/i })).toBeVisible();
  await page.getByRole('button', { name: 'Learning paths' }).click();
  await expect(page.getByRole('heading', { name: 'Choose your learning path' })).toBeVisible();
  await page.getByRole('button', { name: 'Topic library' }).click();
  await expect(page.getByRole('heading', { name: 'Practice by topic' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('beginner assessment supports keyboard selection, answer feedback and persisted progress', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Start learning/ }).click();
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  const firstRadio = page.getByRole('radio').first();
  await firstRadio.focus();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Submit answer' }).click();
  await expect(page.getByRole('status').filter({ hasText: /Correct answer|Review the correct answer/ })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'My progress' }).click();
  await expect(page.getByText(/1 answered|1 first attempt|1 scenario/i).first()).toBeVisible();
});

test('dashboard, assessment and primary learner views expose no critical or serious axe violations', async ({ page }) => {
  await page.goto('/');
  const dashboard = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const importantDashboard = dashboard.violations.filter(item => item.impact === 'critical' || item.impact === 'serious');
  expect(importantDashboard, JSON.stringify(importantDashboard, null, 2)).toEqual([]);

  await page.getByRole('button', { name: /Start learning/ }).click();
  const assessment = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const importantAssessment = assessment.violations.filter(item => item.impact === 'critical' || item.impact === 'serious');
  expect(importantAssessment, JSON.stringify(importantAssessment, null, 2)).toEqual([]);

  for (const navName of ['Learning paths', 'Topic library', 'Simulations', 'My progress', 'Research sources', 'Achievements', 'Settings']) {
    await page.getByRole('button', { name: navName }).click();
    const viewAudit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const importantView = viewAudit.violations.filter(item => item.impact === 'critical' || item.impact === 'serious');
    expect(importantView, `${navName}: ${JSON.stringify(importantView, null, 2)}`).toEqual([]);
  }
});

test('reduced-motion control can be toggled and is announced', async ({ page }) => {
  await page.goto('/');
  const control = page.getByRole('button', { name: 'Toggle reduced motion' });
  await expect(control).toHaveAttribute('aria-pressed', 'false');
  await control.click();
  await expect(control).toHaveAttribute('aria-pressed', 'true');
});


test('responsive application has no document-level horizontal overflow', async ({ page }) => {
  await page.goto('/');
  const width = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(width.document, `Unexpected horizontal overflow: ${JSON.stringify(width)}`).toBeLessThanOrEqual(width.viewport);
});


test('quiz progress export downloads a backup and import requires confirmation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Settings' }).click();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export JSON' }).click()
  ]);
  expect(download.suggestedFilename()).toMatch(/^cyberaware3d-quiz-progress-\d{4}-\d{2}-\d{2}\.json$/);

  const fixture = {
    format: 'cyberaware3d-quiz-progress',
    formatVersion: 1,
    exportedAt: '2026-11-12T12:00:00.000Z',
    progress: {
      version: 2,
      attempts: [{
        questionId: 'PHISH-B01',
        level: 'Beginner',
        category: 'Phishing indicators',
        learningObjective: 'Identify urgency, unexpected requests and mismatched context in a suspicious message',
        selectedOptionId: 'B',
        correct: true,
        answeredAt: '2026-11-12T12:00:00.000Z'
      }]
    }
  };
  await page.locator('input[type="file"]').setInputFiles({
    name: 'quiz-progress.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(fixture))
  });
  const confirmation = page.getByRole('group', { name: 'Confirm progress import' });
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toContainText('1 quiz attempt');
  await confirmation.getByRole('button', { name: 'Cancel' }).click();
  await expect(confirmation).not.toBeVisible();

  await page.locator('input[type="file"]').setInputFiles({
    name: 'quiz-progress.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(fixture))
  });
  await page.getByRole('group', { name: 'Confirm progress import' }).getByRole('button', { name: 'Replace progress' }).click();
  await page.getByRole('button', { name: 'My progress' }).click();
  await expect(page.getByText(/1 answered/).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText(/1 answered/).first()).toBeVisible();
});


test('settings switch and learning progress expose accessible names', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Settings' }).click();
  const preference = page.getByRole('switch', { name: 'Reduced motion' });
  await expect(preference).toBeVisible();
  await expect(preference).toHaveAttribute('aria-describedby', 'reduced-motion-description');
  const before = await preference.getAttribute('aria-checked');
  await preference.click();
  await expect(preference).toHaveAttribute('aria-checked', before === 'true' ? 'false' : 'true');

  await page.getByRole('button', { name: 'My progress' }).click();
  await expect(page.getByRole('progressbar', { name: 'Beginner questions completed' })).toBeVisible();
});

test('pathway navigation announces the active section during a quiz', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start learning' }).click();
  await expect(page.getByRole('button', { name: 'Learning paths' })).toHaveAttribute('aria-current', 'page');
});
