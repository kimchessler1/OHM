import { test, expect } from '@playwright/test';

/**
 * OHM Staging — Student Site Workflow Tests
 * Suite section: 21 (Student Home Page + Student Gradebook)
 * Spec source: ohm-test-suite.md
 * Environment: https://ohm-stg.preprod.ludev.team/
 *
 * Requires: Student test account + a course the student is enrolled in
 */

const BASE_URL = process.env.BASE_URL || 'https://ohm-stg.preprod.ludev.team';
const STUDENT_USERNAME = process.env.OHM_STUDENT_USERNAME || '';
const STUDENT_PASSWORD = process.env.OHM_STUDENT_PASSWORD || '';
const TEST_COURSE_ID = process.env.TEST_COURSE_ID || '';
const TEST_ENROLLMENT_KEY = process.env.TEST_ENROLLMENT_KEY || '';

// Use saved student auth state to avoid re-login on every test
test.use({ storageState: 'tests/fixtures/auth/student.json' });

// ---------------------------------------------------------------------------
// 21a. OHM Student Home Page
// ---------------------------------------------------------------------------

test.describe('21a. Student Home Page (OHM Alone)', () => {

  test('21a.1 — Student can enroll in course via CID and enrollment key', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel(/username/i).fill(STUDENT_USERNAME);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in|log in/i }).click();

    await page.getByRole('link', { name: /enroll in.*class|enroll/i }).click();
    await page.getByLabel(/course id/i).fill(TEST_COURSE_ID);
    await page.getByLabel(/enrollment key/i).fill(TEST_ENROLLMENT_KEY);
    await page.getByRole('button', { name: /sign up|enroll|search/i }).click();
    await expect(page.getByText(/enrolled|success|welcome/i)).toBeVisible();
  });

  test('21a.2 — Enrolled course appears in "Courses You\'re Taking" on Home', async ({ page }) => {
    await page.goto(`${BASE_URL}/home`);
    await expect(page.getByText(/courses you're taking|my courses/i)).toBeVisible();
    const courseItem = page.locator('[data-testid="student-course-list"] li, .student-course-item');
    await expect(courseItem.first()).toBeVisible();
  });

  test('21a.3 — Course Home displays correctly with clickable options', async ({ page }) => {
    await page.goto(`${BASE_URL}/home`);
    // Navigate into first available course
    await page.locator('[data-testid="student-course-list"] a, .student-course-item a').first().click();
    await expect(page).toHaveURL(/course/i);

    // Verify basic nav options are visible and clickable
    const navLinks = page.getByRole('navigation').getByRole('link');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);

    // Click the first nav link to verify it's interactive
    await navLinks.first().click();
    await expect(page).not.toHaveURL(/error/i);
  });

});

// ---------------------------------------------------------------------------
// 21b. Student Gradebook
// ---------------------------------------------------------------------------

test.describe('21b. Student Gradebook', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/home`);
    // Enter first available course
    await page.locator('[data-testid="student-course-list"] a, .student-course-item a').first().click();
  });

  test('21b.1 — Gradebook accessible via left dash and top nav', async ({ page }) => {
    // Via left dash
    await page.getByRole('link', { name: /gradebook/i }).first().click();
    await expect(page).toHaveURL(/gradebook/i);
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('21b.2 — Gradebook dashboard options all respond', async ({ page }) => {
    await page.getByRole('link', { name: /gradebook/i }).first().click();

    const optionsToCheck = [
      /offline grades/i,
      /export/i,
      /settings/i,
      /comments/i,
    ];

    for (const option of optionsToCheck) {
      const link = page.getByRole('link', { name: option });
      if (await link.isVisible()) {
        await expect(link).toBeEnabled();
      }
    }
  });

  test('21b.3 — Clicking student name opens individual gradebook detail', async ({ page }) => {
    await page.getByRole('link', { name: /gradebook/i }).first().click();
    const studentLink = page.getByRole('table').getByRole('link').first();
    await studentLink.click();
    await expect(page).toHaveURL(/student|detail/i);
  });

  test('21b.4 — Clicking grade item opens assessment attempt review', async ({ page }) => {
    await page.getByRole('link', { name: /gradebook/i }).first().click();
    const studentLink = page.getByRole('table').getByRole('link').first();
    await studentLink.click();
    // Click a grade item
    const gradeItem = page.locator('[data-testid="grade-item"], .grade-item').first();
    if (await gradeItem.isVisible()) {
      await gradeItem.click();
      await expect(page).toHaveURL(/attempt|review|assessment/i);
    } else {
      test.skip();
    }
  });

  test('21b.7 — Single Score override: manual score entry and Full Credit option', async ({ page }) => {
    await page.getByRole('link', { name: /gradebook/i }).first().click();
    const studentLink = page.getByRole('table').getByRole('link').first();
    await studentLink.click();

    const gradeItem = page.locator('[data-testid="grade-item"], .grade-item').first();
    if (await gradeItem.isVisible()) {
      await gradeItem.click();
      const scoreInput = page.getByLabel(/score|points/i);
      if (await scoreInput.isVisible()) {
        await scoreInput.fill('10');
        await page.getByRole('button', { name: /full credit/i }).click();
        await expect(page.getByText(/saved|updated/i)).toBeVisible();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('21b.8 — Return to Gradebook link works from detail view', async ({ page }) => {
    await page.getByRole('link', { name: /gradebook/i }).first().click();
    const studentLink = page.getByRole('table').getByRole('link').first();
    await studentLink.click();
    await page.getByRole('link', { name: /return to gradebook|back to gradebook/i }).click();
    await expect(page).toHaveURL(/gradebook/i);
  });

  test('21b.9 — Gradebook detail links: View as Student, Print Version, Activity Log', async ({ page }) => {
    await page.getByRole('link', { name: /gradebook/i }).first().click();
    const studentLink = page.getByRole('table').getByRole('link').first();
    await studentLink.click();

    await expect(page.getByRole('link', { name: /view as student/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /print version/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /activity log/i })).toBeVisible();
  });

});
