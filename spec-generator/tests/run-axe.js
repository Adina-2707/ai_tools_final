const fs = require('fs');
const { chromium } = require('playwright');
const axeSource = require('axe-core').source;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const urls = ['http://localhost:8000/index.html', 'http://localhost:8000/register.html'];
  const results = {};
  for (const u of urls) {
    await page.goto(u);
    await page.addScriptTag({ content: axeSource });
    const res = await page.evaluate(async () => await axe.run());
    results[u] = res;
  }
  await browser.close();
  fs.writeFileSync('axe-results.json', JSON.stringify(results, null, 2));
  console.log('Axe results saved to axe-results.json');
})();
