import { expect, test } from '@playwright/test';

test('a user can file, appeal, review, copy, and restart a petty case', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');

  const dispute = page.getByTestId('input-dispute');
  const defendant = page.getByTestId('input-defendant');
  const plaintiff = page.getByTestId('input-plaintiff');

  await page.getByTestId('button-summon').click();
  await expect(dispute).toHaveJSProperty('required', true);
  expect(await dispute.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  await expect(page.getByTestId('button-summon')).toBeVisible();

  await dispute.fill('Leaving the microwave timer beeping.');
  await page.getByTestId('button-summon').click();
  expect(await defendant.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);

  await defendant.fill('The microwave abandoner');
  await page.getByTestId('button-summon').click();
  expect(await plaintiff.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);

  await page.getByTestId('button-sample-refrigerator').click();
  await expect(dispute).toHaveValue('Putting the empty milk carton back in the fridge.');
  await expect(defendant).toHaveValue('The carton returner');
  await expect(plaintiff).toHaveValue('The next person needing milk');
  await page.getByTestId('button-summon').click();

  const verdict = page.locator('.verdict-heading');
  await expect(verdict).toBeVisible({ timeout: 5_000 });
  const firstVerdict = await verdict.innerText();
  await expect(page.getByTestId('button-appeal')).toBeVisible();

  await page.getByTestId('button-appeal').click();
  await expect(page.locator('.deliberation')).toBeVisible();
  await expect(page.locator('.deliberation')).toBeHidden({ timeout: 5_000 });
  await expect(verdict).toBeVisible();
  const appealedVerdict = await verdict.innerText();
  expect(appealedVerdict).not.toBe(firstVerdict);

  await expect(page.getByTestId('button-archive-0')).toBeVisible();
  await expect(page.getByTestId('button-archive-1')).toBeVisible();
  await page.getByTestId('button-archive-1').click();
  await expect(verdict).toHaveText(firstVerdict);
  await expect(page.locator('.ruling-title h2')).toHaveText('Putting the empty milk carton back in the fridge.');

  await page.getByTestId('button-copy-transcript').click();
  await expect(page.getByRole('status')).toContainText('Transcript copied.');
  const transcript = await page.evaluate(() => navigator.clipboard.readText());
  expect(transcript).toContain('IN THE MATTER OF: Putting the empty milk carton back in the fridge.');
  expect(transcript).toContain(`VERDICT: ${firstVerdict}`);

  await page.getByTestId('button-new-dispute').click();
  await expect(page.getByTestId('button-summon')).toBeVisible();
  await expect(dispute).toHaveValue('');
  await expect(defendant).toHaveValue('');
  await expect(plaintiff).toHaveValue('');
  await expect(page.getByTestId('button-archive-0')).toBeVisible();
});
