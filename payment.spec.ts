import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';

/**
 * OHM Staging — Payment Workflow Tests
 * Suite sections: 24 (Instructor/Admin Payment), 25 (Student Payment)
 * Spec source: ohm-test-suite.md + Confluence OHM page
 * Environment: https://ohm-stg.preprod.ludev.team/
 *
 * ⚠️  CRITICAL SETUP NOTES (read before running):
 *
 * 1. Two OHM accounts required:
 *    - TEACHER account (course owner) — env: OHM_TEACHER_USERNAME / OHM_TEACHER_PASSWORD
 *    - ADMIN account (not course owner) — env: OHM_ADMIN_USERNAME / OHM_ADMIN_PASSWORD
 *
 * 2. Teacher MUST be assigned to a group (e.g. "Hogwarts").
 *    Payment settings are ALWAYS read from the course OWNER's group — never the logged-in user.
 *    This is the core behavior tested by OHM-1141.
 *
 * 3. To add a course on behalf of a teacher (as admin):
 *    Admin Page → find teacher by name → click "Add Course" from the gray menu bar.
 *    DO NOT use the standard "Add New Course" button while logged in as admin —
 *    this assigns the course to the admin, breaking payment settings.
 *
 * 4. Student payment tests (section 25) require 3 simultaneous browser contexts:
 *    - OHM as teacher (to control group payment settings)
 *    - Lumen Admin (to Fast Forward / Destroy student EnrollmentLog)
 *    - OHM as student
 *
 * 5. enrollment_id is visible in page source as:
 *    <!-- enrollmentid / enrollment_id = 117 -->
 *    Not present if course has no payment, or if logged in as teacher/admin.
 */

const BASE_URL = process.env.BASE_URL || 'https://ohm-stg.preprod.ludev.team';
const LUMEN_ADMIN_URL = process.env.LUMEN_ADMIN_URL || '';

const TEACHER_USERNAME = process.env.OHM_TEACHER_USERNAME || '';
const TEACHER_PASSWORD = process.env.OHM_TEACHER_PASSWORD || '';
const ADMIN_USERNAME = process.env.OHM_ADMIN_USERNAME || '';
const ADMIN_PASSWORD = process.env.OHM_ADMIN_PASSWORD || '';
const STUDENT_USERNAME = process.env.OHM_STUDENT_USERNAME || '';
const STUDENT_PASSWORD = process.env.OHM_STUDENT_PASSWORD || '';
const TEST_GROUP_NAME = process.env.OHM_TEST_GROUP || 'Hogwarts';
const TEST_COURSE_ID = process.env.TEST_COURSE_ID || '';
const TEST_ENROLLMENT_KEY = process.env.TEST_ENROLLMENT_KEY || '';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function loginAs(page: Page, username: string, password: string) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in|log in/i }).click();
  await page.waitForURL(/home|dashboard/i);
}

async function setGroupPayment(page: Page, setting: 'enabled' | 'not_required') {
  await page.getByRole('link', { name: /admin page/i }).click();
  await page.getByLabel(/find group/i).fill(TEST_GROUP_NAME);
  await page.getByRole('button', { name: /^go$/i }).click();
  await page.getByRole('link', { name: /edit group/i }).click();
  const dropdown = page.getByLabel(/student payments/i);
  await dropdown.selectOption(setting === 'enabled' ? { label: /direct|multi|activation/i } : { label: /not required/i });
  await page.getByRole('button', { name: /update student payment/i }).click();
  await expect(page.getByText(/updated|saved/i)).toBeVisible();
}

async function verifyCourseHasPayment(page: Page, hasPayment: boolean) {
  await page.getByRole('link', { name: /course settings/i }).click();
  const availabilitySection = page.getByRole('button', { name: /availability and access/i });
  await availabilitySection.click();

  if (hasPayment) {
    await expect(page.getByText(/assessments require payment or activation/i)).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /students must provide/i })).toBeChecked();
  } else {
    await expect(page.getByText(/assessments require payment or activation/i)).not.toBeVisible();
  }
}

// ---------------------------------------------------------------------------
// 24a. Payments Enabled — Course Creation
// ---------------------------------------------------------------------------

test.describe('24a. Payments Enabled — Course Creation', () => {

  test.beforeAll(async ({ browser }) => {
    // Enable payments for teacher's group before this test group runs
    const page = await browser.newPage();
    await loginAs(page, TEACHER_USERNAME, TEACHER_PASSWORD);
    await setGroupPayment(page, 'enabled');
    await page.close();
  });

  test('24a.2 — Blank course (as Teacher) shows payment requirement', async ({ page }) => {
    await loginAs(page, TEACHER_USERNAME, TEACHER_PASSWORD);
    await page.getByRole('link', { name: /add new course/i }).click();
    await page.getByRole('button', { name: /create blank course/i }).click();
    await page.getByRole('button', { name: /submit/i }).click();
    await page.getByRole('link', { name: /enter course/i }).click();
    await verifyCourseHasPayment(page, true);
  });

  test('24a.3 — Template course (as Teacher) shows payment requirement', async ({ page }) => {
    await loginAs(page, TEACHER_USERNAME, TEACHER_PASSWORD);
    await page.getByRole('link', { name: /add new course/i }).click();
    await page.getByRole('button', { name: /use a lumen template/i }).click();
    // Select Basic Algebra template
    await page.getByText(/basic algebra/i).first().click();
    await page.getByRole('button', { name: /add course/i }).click();
    await page.getByRole('button', { name: /submit/i }).click();
    await page.getByRole('link', { name: /enter course/i }).click();
    await verifyCourseHasPayment(page, true);
  });

  test('24a.5 — Blank course created by Admin on behalf of Teacher shows payment requirement @OHM-1141', async ({ page }) => {
    // This tests the OHM-1141 fix: payment must reflect OWNER's group, not admin's
    await loginAs(page, ADMIN_USERNAME, ADMIN_PASSWORD);
    await page.getByRole('link', { name: /admin page/i }).click();

    // Find teacher and add course via admin gray menu bar
    await page.getByLabel(/find teacher|find user/i).fill(TEACHER_USERNAME);
    await page.getByRole('button', { name: /^go$/i }).click();
    await page.getByRole('link', { name: /add course/i }).click(); // gray menu bar link

    await page.getByRole('button', { name: /create blank course/i }).click();
    await page.getByRole('button', { name: /submit/i }).click();
    await page.getByRole('link', { name: /enter course/i }).click();
    await verifyCourseHasPayment(page, true);
  });

});

// ---------------------------------------------------------------------------
// 24b. Payments Disabled — Course Creation
// ---------------------------------------------------------------------------

test.describe('24b. Payments Disabled — Course Creation', () => {

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await loginAs(page, TEACHER_USERNAME, TEACHER_PASSWORD);
    await setGroupPayment(page, 'not_required');
    await page.close();
  });

  test('24b.2 — Blank course (as Teacher) shows NO payment requirement', async ({ page }) => {
    await loginAs(page, TEACHER_USERNAME, TEACHER_PASSWORD);
    await page.getByRole('link', { name: /add new course/i }).click();
    await page.getByRole('button', { name: /create blank course/i }).click();
    await page.getByRole('button', { name: /submit/i }).click();
    await page.getByRole('link', { name: /enter course/i }).click();
    await verifyCourseHasPayment(page, false);
  });

  test('24b.5 — Blank course created by Admin shows NO payment requirement', async ({ page }) => {
    await loginAs(page, ADMIN_USERNAME, ADMIN_PASSWORD);
    await page.getByRole('link', { name: /admin page/i }).click();
    await page.getByLabel(/find teacher|find user/i).fill(TEACHER_USERNAME);
    await page.getByRole('button', { name: /^go$/i }).click();
    await page.getByRole('link', { name: /add course/i }).click();
    await page.getByRole('button', { name: /create blank course/i }).click();
    await page.getByRole('button', { name: /submit/i }).click();
    await page.getByRole('link', { name: /enter course/i }).click();
    await verifyCourseHasPayment(page, false);
  });

});

// ---------------------------------------------------------------------------
// 25. Payment Workflow — Student
// Requires 3 browser contexts running simultaneously
// ---------------------------------------------------------------------------

test.describe('25. Payment Workflow — Student', () => {

  /**
   * Scenario A: Direct pay + course copied from template by teacher
   * Full multi-context trial flow
   */
  test('25 — Full student trial flow (Scenario A: Direct pay)', async ({ browser }) => {
    // Context 1: Teacher window (payment control)
    const teacherContext = await browser.newContext();
    const teacherPage = await teacherContext.newPage();
    await loginAs(teacherPage, TEACHER_USERNAME, TEACHER_PASSWORD);
    await setGroupPayment(teacherPage, 'enabled');

    // Context 2: Student window
    const studentContext = await browser.newContext();
    const studentPage = await studentContext.newPage();
    await loginAs(studentPage, STUDENT_USERNAME, STUDENT_PASSWORD);

    // Navigate student into assessment
    await studentPage.goto(`${BASE_URL}/home`);
    await studentPage.locator('.student-course-item a, [data-testid="student-course"] a').first().click();
    await studentPage.getByRole('link', { name: /assessment/i }).first().click();

    // 25a.1 — Paywall displayed
    await expect(studentPage.getByText(/payment|access code|paywall/i)).toBeVisible();

    // 25a.2 — enrollment_id in page source
    const source = await studentPage.content();
    expect(source).toMatch(/enrollment_id\s*=\s*\d+/i);

    // 25a.3 — Begin new trial
    await studentPage.getByRole('button', { name: /start trial|begin trial/i }).click();
    await expect(studentPage.getByText(/start assessment|begin/i)).toBeVisible();

    // 25a.4 — Re-enter: only Continue option available
    await studentPage.goto(`${BASE_URL}/home`);
    await studentPage.locator('.student-course-item a, [data-testid="student-course"] a').first().click();
    await studentPage.getByRole('link', { name: /assessment/i }).first().click();
    await expect(studentPage.getByRole('button', { name: /continue trial/i })).toBeVisible();
    await expect(studentPage.getByRole('button', { name: /start.*new trial/i })).not.toBeVisible();
    await expect(studentPage.getByRole('button', { name: /extend/i })).not.toBeVisible();

    // 25a.5 — Continue trial
    await studentPage.getByRole('button', { name: /continue trial/i }).click();
    await expect(studentPage.getByText(/start assessment|begin/i)).toBeVisible();

    // 25a.6 — Fast Forward (Lumen Admin step — manual or via Context 3 if LUMEN_ADMIN_URL set)
    if (LUMEN_ADMIN_URL) {
      const adminContext = await browser.newContext();
      const adminPage = await adminContext.newPage();
      await adminPage.goto(LUMEN_ADMIN_URL);
      // Find enrollment log and fast forward
      await adminPage.getByRole('link', { name: /enrollment logs/i }).click();
      await adminPage.getByLabel(/enrollment_id/i).fill(
        source.match(/enrollment_id\s*=\s*(\d+)/i)?.[1] || ''
      );
      await adminPage.getByRole('button', { name: /search/i }).click();
      await adminPage.getByRole('button', { name: /fast forward/i }).click();
      await adminContext.close();
    } else {
      test.skip(true, 'LUMEN_ADMIN_URL not set — Fast Forward step requires manual execution');
    }

    // 25a.7 — After fast forward: only Extend available
    await studentPage.goto(`${BASE_URL}/home`);
    await studentPage.locator('.student-course-item a').first().click();
    await studentPage.getByRole('link', { name: /assessment/i }).first().click();
    await expect(studentPage.getByRole('button', { name: /extend/i })).toBeVisible();
    await expect(studentPage.getByRole('button', { name: /continue trial/i })).not.toBeVisible();
    await expect(studentPage.getByRole('button', { name: /start.*new/i })).not.toBeVisible();

    // 25a.8 — Extend trial
    await studentPage.getByRole('button', { name: /extend/i }).click();
    await expect(studentPage.getByText(/start assessment|begin/i)).toBeVisible();

    await teacherContext.close();
    await studentContext.close();
  });

  test.skip('25 — Scenario B: Not required + admin-created course (no paywall expected)', async () => {
    // TODO: implement — student should NOT see paywall; no enrollment_id in source
  });

  test.skip('25 — Scenario C: Multi pay + course copied from existing by admin', async () => {
    // TODO: implement
  });

  test.skip('25 — Scenario D: Activation codes + course copied from existing by teacher', async () => {
    // TODO: implement
  });

});
