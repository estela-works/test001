const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SLIDE_DIR = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(SLIDE_DIR, 'images');

// Slide list extracted from slide-viewer.html inline data
const slides = [
  { name: 'main-0-01', path: 'prompts/section-0/main-0-01.html' },
  { name: 'main-0-02', path: 'prompts/section-0/main-0-02.html' },
  { name: 'main-0-03', path: 'prompts/section-0/main-0-03.html' },
  { name: 'main-0-04', path: 'prompts/section-0/main-0-04.html' },
  { name: 'main-0-05', path: 'prompts/section-0/main-0-05.html' },
  { name: 'main-0-06', path: 'prompts/section-0/main-0-06.html' },
  { name: 'main-1-01', path: 'prompts/section-1/main-1-01.html' },
  { name: 'main-1-02', path: 'prompts/section-1/main-1-02.html' },
  { name: 'main-1-03', path: 'prompts/section-1/main-1-03.html' },
  { name: 'main-1-04', path: 'prompts/section-1/main-1-04.html' },
  { name: 'main-1-05', path: 'prompts/section-1/main-1-05.html' },
  { name: 'main-1-06', path: 'prompts/section-1/main-1-06.html' },
  { name: 'main-1-07', path: 'prompts/section-1/main-1-07.html' },
  { name: 'main-1-08', path: 'prompts/section-1/main-1-08.html' },
  { name: 'main-1-09', path: 'prompts/section-1/main-1-09.html' },
  { name: 'main-1-10', path: 'prompts/section-1/main-1-10.html' },
  { name: 'main-2-01', path: 'prompts/section-2/main-2-01.html' },
  { name: 'main-2-02', path: 'prompts/section-2/main-2-02.html' },
  { name: 'main-2-03', path: 'prompts/section-2/main-2-03.html' },
  { name: 'main-2-04', path: 'prompts/section-2/main-2-04.html' },
  { name: 'main-2-05', path: 'prompts/section-2/main-2-05.html' },
  { name: 'main-2-06', path: 'prompts/section-2/main-2-06.html' },
  { name: 'main-2-07', path: 'prompts/section-2/main-2-07.html' },
  { name: 'main-2-08', path: 'prompts/section-2/main-2-08.html' },
  { name: 'main-2-09', path: 'prompts/section-2/main-2-09.html' },
  { name: 'main-3-01', path: 'prompts/section-3/main-3-01.html' },
  { name: 'main-3-02', path: 'prompts/section-3/main-3-02.html' },
  { name: 'main-3-04', path: 'prompts/section-3/main-3-04.html' },
  { name: 'main-3-05', path: 'prompts/section-3/main-3-05.html' },
  { name: 'main-3-06', path: 'prompts/section-3/main-3-06.html' },
  { name: 'main-4-01', path: 'prompts/section-4/main-4-01.html' },
  { name: 'main-4-02', path: 'prompts/section-4/main-4-02.html' },
  { name: 'main-4-03', path: 'prompts/section-4/main-4-03.html' },
  { name: 'main-4-04', path: 'prompts/section-4/main-4-04.html' },
  { name: 'main-4-07', path: 'prompts/section-4/main-4-07.html' },
  { name: 'main-4-08', path: 'prompts/section-4/main-4-08.html' },
  { name: 'main-5-01', path: 'prompts/section-5/main-5-01.html' },
  { name: 'main-5-02', path: 'prompts/section-5/main-5-02.html' },
  { name: 'main-5-03', path: 'prompts/section-5/main-5-03.html' },
  { name: 'main-5-04', path: 'prompts/section-5/main-5-04.html' },
  { name: 'main-5-05', path: 'prompts/section-5/main-5-05.html' },
  { name: 'main-5-07', path: 'prompts/section-5/main-5-07.html' },
  { name: 'main-5-09', path: 'prompts/section-5/main-5-09.html' },
  { name: 'main-5-10', path: 'prompts/section-5/main-5-10.html' },
  { name: 'main-6-01', path: 'prompts/section-6/main-6-01.html' },
  { name: 'main-6-03', path: 'prompts/section-6/main-6-03.html' },
  { name: 'main-6-04', path: 'prompts/section-6/main-6-04.html' },
  { name: 'main-c-01', path: 'prompts/section-closing/main-c-01.html' },
  { name: 'main-c-02', path: 'prompts/section-closing/main-c-02.html' },
  { name: 'main-c-03', path: 'prompts/section-closing/main-c-03.html' },
  { name: 'main-c-04', path: 'prompts/section-closing/main-c-04.html' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024 + 48, height: 576 + 48, deviceScaleFactor: 2 });

  for (const slide of slides) {
    const filePath = path.join(SLIDE_DIR, slide.path);
    const url = 'file:///' + filePath.replace(/\\/g, '/');
    await page.goto(url, { waitUntil: 'networkidle0' });

    const el = await page.$('.slide');
    if (el) {
      await el.screenshot({
        path: path.join(IMAGES_DIR, slide.name + '.png'),
        type: 'png',
      });
    } else {
      await page.screenshot({
        path: path.join(IMAGES_DIR, slide.name + '.png'),
        type: 'png',
        clip: { x: 0, y: 0, width: 1024, height: 576 },
      });
    }
    console.log(`captured: ${slide.name}`);
  }

  await browser.close();
  console.log(`\nDone: ${slides.length} slides captured to ${IMAGES_DIR}`);
})();
