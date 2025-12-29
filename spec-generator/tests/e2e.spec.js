const { test, expect } = require('@playwright/test');

const base = 'http://localhost:8000';

test('register, generate spec, saved to mock firestore', async ({ page }) => {
  // Register
  await page.goto(base + '/register.html');
  await page.fill('#fullname', 'Test User');
  const email = `testuser+${Date.now()}@example.com`;
  await page.fill('#email', email);
  await page.fill('#password', 'Password123');
  await page.fill('#password-confirm', 'Password123');
  await page.check('#agree');
  await page.click('#btn-register');
  // Wait for redirect to index
  await page.waitForURL('**/index.html');

  // On index: answer first question and complete quick flow
  await page.waitForSelector('#quizContainer');
  // choose first radio option for each question (safe selector)
  for (let i = 1; i <= 7; i++) {
    const sel = `input[name="question-${i}"]`;
    await page.locator(sel).first().check();
    // add small comment
    await page.fill(`#comment-${i}`, `Auto comment ${i}`);
    // click next (last iteration will generate spec)
    await page.click('#btnNext');
  }

  // Wait for results
  await page.waitForSelector('#specContent');
  const specHtml = await page.locator('#specContent').innerHTML();
  expect(specHtml).toContain('Описание проекта');

  // Check localStorage mock_firestore
  const firestore = await page.evaluate(() => localStorage.getItem('mock_firestore'));
  expect(firestore).not.toBeNull();
  const parsed = JSON.parse(firestore);
  // ensure there's at least one user entry with specs
  const users = Object.keys(parsed || {});
  expect(users.length).toBeGreaterThan(0);
});
