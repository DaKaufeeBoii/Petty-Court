import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

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
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('petty-court:rulings:v1'))).toContain('Putting the empty milk carton back in the fridge.');
  await expect(page.getByTestId('button-archive-1')).toBeVisible();
  await page.getByTestId('button-archive-1').click();
  await expect(verdict).toHaveText(firstVerdict);
  await expect(page.locator('.ruling-title h2')).toHaveText('Putting the empty milk carton back in the fridge.');

  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('button-download-ruling-image').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^petty-court-.*\.png$/);
  const imagePath = await download.path();
  if (!imagePath) throw new Error('The ruling image download did not produce a file.');
  const imageBytes = await readFile(imagePath);
  expect([...imageBytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(imageBytes.readUInt32BE(16)).toBe(1080);
  expect(imageBytes.readUInt32BE(20)).toBeGreaterThan(1200);
  await expect(page.getByRole('status')).toContainText('Ruling image downloaded.');

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
  await page.reload();
  await expect(page.getByTestId('button-archive-0')).toBeVisible();
  await expect(page.getByTestId('button-archive-1')).toBeVisible();
  await page.getByTestId('button-archive-0').click();
  await expect(page.locator('.ruling-title h2')).toHaveText('Putting the empty milk carton back in the fridge.');
});

test('a maximum-length dispute and party names fit in the downloaded ruling image', async ({ page }) => {
  await page.goto('/');

  const dispute = 'An unusually long household dispute about an extremely important matter '.repeat(3).slice(0, 150);
  const defendant = 'The defendant with a very long formal name '.repeat(2).slice(0, 48);
  const plaintiff = 'The plaintiff with a very long formal name '.repeat(2).slice(0, 48);
  await page.getByTestId('input-dispute').fill(dispute);
  await page.getByTestId('input-defendant').fill(defendant);
  await page.getByTestId('input-plaintiff').fill(plaintiff);
  await expect(page.getByTestId('input-dispute')).toHaveValue(dispute);
  await expect(page.getByTestId('input-defendant')).toHaveValue(defendant);
  await expect(page.getByTestId('input-plaintiff')).toHaveValue(plaintiff);

  await page.getByTestId('button-summon').click();
  await expect(page.locator('.ruling-title h2')).toHaveText(dispute, { timeout: 5_000 });
  await expect(page.locator('.ruling-title p')).toContainText(plaintiff);
  await expect(page.locator('.ruling-title p')).toContainText(defendant);

  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('button-download-ruling-image').click();
  const download = await downloadPromise;
  const imagePath = await download.path();
  if (!imagePath) throw new Error('The long ruling image download did not produce a file.');

  const imageBytes = await readFile(imagePath);
  expect([...imageBytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(imageBytes.readUInt32BE(16)).toBe(1080);
  const imageHeight = imageBytes.readUInt32BE(20);
  expect(imageHeight).toBeGreaterThan(1500);

  const footerInkPixels = await page.evaluate(async (base64Image) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64Image}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not inspect the downloaded ruling image.');
    context.drawImage(image, 0, 0);
    const footerTop = Math.max(0, image.height - 70);
    const pixels = context.getImageData(180, footerTop, 720, image.height - footerTop - 3).data;
    let inkPixels = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index] < 180 && pixels[index + 1] < 155 && pixels[index + 2] < 120) inkPixels++;
    }
    return inkPixels;
  }, imageBytes.toString('base64'));
  expect(footerInkPixels).toBeGreaterThan(100);
  await expect(page.getByRole('status')).toContainText('Ruling image downloaded.');
});

test('the archive keeps only the five newest rulings in newest-first order', async ({ page }) => {
  await page.goto('/');

  const disputes = Array.from({ length: 6 }, (_, index) => `Archive limit test ruling ${index + 1}`);
  for (const dispute of disputes) {
    await page.getByTestId('input-dispute').fill(dispute);
    await page.getByTestId('input-defendant').fill(`Defendant for ${dispute}`);
    await page.getByTestId('input-plaintiff').fill(`Plaintiff for ${dispute}`);
    await page.getByTestId('button-summon').click();
    await expect(page.locator('.ruling-title h2')).toHaveText(dispute, { timeout: 5_000 });
    if (dispute !== disputes[disputes.length - 1]) {
      await page.getByTestId('button-new-dispute').click();
    }
  }

  const archiveButtons = page.locator('.archive-list .archive-item');
  await expect(page.locator('.archive-count')).toHaveText('5 / 5');
  await expect(archiveButtons).toHaveCount(5);
  for (const [index, dispute] of disputes.slice(1).reverse().entries()) {
    await expect(page.getByTestId(`button-archive-${index}`)).toContainText(dispute);
  }

  const archivedRulings = await page.evaluate(() => JSON.parse(window.localStorage.getItem('petty-court:rulings:v1') ?? '[]') as { dispute: string }[]);
  expect(archivedRulings.map(({ dispute }) => dispute)).toEqual(disputes.slice(1).reverse());
  await expect(page.getByRole('button', { name: /Review ruling .*Archive limit test ruling 1$/ })).toHaveCount(0);

  await page.getByTestId('button-archive-4').click();
  await expect(page.locator('.ruling-title h2')).toHaveText(disputes[1]);
});
