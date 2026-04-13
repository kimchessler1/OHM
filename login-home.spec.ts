import { test, expect } from '@playwright/test';

/**
 * OHM Staging — Login & Home Page Tests
 * Suite sections: 1 (Home Page / Login), 2 (Home and Core Pages)
 * Spec source: ohm-test-suite.md
 * Environment: https://ohm-stg.preprod.ludev.team/
 */

const BASE_URL = process.env.BASE_URL || 'https://ohm-stg.preprod.ludev.team';
const VALID_USERNAME = process.env.OHM_USERNAME || '';
const VALID_PASSWORD = process.env.OHM_PASSWORD || '';

// ---------------------------------------------------------------------------
// 1. Home Page (Login)
// ---------------------------------------------------------------------------

test.describe('1. Home Page (Login)', () => {

  test('1.1 — Confirm login with existing credentials redirects to OHM Home', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel(/username/i).fill(VALID_USERNAME);
    await page.getByLabel(/password/i).fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    await expect(page).toHaveURL(/home|dashboard/);
  });

  test('1.2 — Enroll in new course using Course ID and Enrollment Key', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    // Enroll flow from login page
    await page.getByRole('link', { name: /enroll/i }).click();
    await page.getByLabel(/course id/i).fill(process.env.TEST_COURSE_ID || 'TEST_CID');
    await page.getByLabel(/enrollment key/i).fill(process.env.TEST_ENROLLMENT_KEY || 'TEST_KEY');
    await page.getByRole('button', { name: /search|find|enroll/i }).click();
    await expect(page.getByText(/course found|enrolled/i)).toBeVisible();
  });

  test('1.3 — Forgot Password shows email input and sends reset link', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByRole('link', { name: /forgot password/i }).click();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByRole('button', { name: /send|submit|reset/i }).click();
    await expect(page.getByText(/email sent|check your email/i)).toBeVisible();
  });

  test('1.4 — Forgot Username shows email input and sends username', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByRole('link', { name: /forgot username/i }).click();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByRole('button', { name: /send|submit/i }).click();
    await expect(page.getByText(/email sent|check your email/i)).toBeVisible();
  });

  test('1.5 — "What is Lumen OHM?" link opens lumenlearning.com in new tab', async ({ page, context }) => {
    await page.goto(`${BASE_URL}/login`);
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: /what is lumen ohm/i }).click(),
    ]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('lumenlearning.com');
  });

  test('1.6 — "Request an Instructor Account" opens try-lumen-course in new tab', async ({ page, context }) => {
    await page.goto(`${BASE_URL}/login`);
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: /request.*instructor account/i }).click(),
    ]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('info.lumenlearning.com/try-lumen-course');
  });

});

// ---------------------------------------------------------------------------
// 2. Home and Core Pages (requires authenticated session)
// ---------------------------------------------------------------------------

test.describe('2. Home and Core Pages', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel(/username/i).fill(VALID_USERNAME);
    await page.getByLabel(/password/i).fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    await page.waitForURL(/home|dashboard/);
  });

  test('2.1 — Courses You\'re Teaching panel populates on Home', async ({ page }) => {
    await expect(page.getByText(/courses you're teaching|my courses/i)).toBeVisible();
    // At least one course should be listed (assumes test account has courses)
    const courseList = page.locator('[data-testid="course-list"] li, .course-item');
    await expect(courseList.first()).toBeVisible();
  });

  test('2.2 — Add New Course button is present below course list', async ({ page }) => {
    await expect(page.getByRole('link', { name: /add new course/i })).toBeVisible();
  });

  test('2.3 — Enroll in New Class via CID search works', async ({ page }) => {
    await page.getByRole('link', { name: /enroll in.*class|enroll/i }).click();
    await page.getByLabel(/course id/i).fill(process.env.TEST_COURSE_ID || 'TEST_CID');
    await page.getByLabel(/enrollment key/i).fill(process.env.TEST_ENROLLMENT_KEY || 'TEST_KEY');
    await page.getByRole('button', { name: /search|enroll/i }).click();
    await expect(page.getByText(/enrolled|success/i)).toBeVisible();
  });

  test('2.4 — User Settings opens and saves changes', async ({ page }) => {
    await page.getByRole('link', { name: /settings|user settings/i }).click();
    await expect(page).toHaveURL(/settings/);
    const firstNameField = page.getByLabel(/first name/i);
    await firstNameField.fill('TestFirst');
    await page.getByRole('button', { name: /save|submit|update/i }).click();
    await expect(page.getByText(/saved|updated|success/i)).toBeVisible();
  });

  test('2.5 — Right dash items: My Classes, Help, Log Out all present and functional', async ({ page }) => {
    await expect(page.getByRole('link', { name: /my classes/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /help/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /log out|logout/i })).toBeVisible();

    // Test Log Out
    await page.getByRole('link', { name: /log out|logout/i }).click();
    await expect(page).toHaveURL(/login|home/);
  });

});
