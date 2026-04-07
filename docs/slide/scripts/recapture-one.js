const puppeteer = require('puppeteer');
const path = require('path');

const SLIDE_DIR = path.resolve(__dirname, '..');
const slideName = process.argv[2] || 'main-6-04';
const slidePath = `prompts/section-6/${slideName}.html`;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024 + 48, height: 576 + 48, deviceScaleFactor: 2 });

  const filePath = path.join(SLIDE_DIR, slidePath);
  const url = 'file:///' + filePath.replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'networkidle0' });

  const el = await page.$('.slide');
  if (el) {
    await el.screenshot({
      path: path.join(SLIDE_DIR, 'images', slideName + '.png'),
      type: 'png',
    });
  }
  await browser.close();
  console.log(`Recaptured: ${slideName}.png`);
})();
