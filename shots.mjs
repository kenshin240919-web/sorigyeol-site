// 데시벨 계산기 화면을 직접 캡처해 images/에 저장합니다. (NO_BASE=1로 빌드한 dist를 미리보기 서버 8799로 띄워 둔 상태에서)
// 실행: node shots.mjs  — Playwright는 D:\guidejung\toss-src\node_modules 것을 빌려 씁니다.
import {createRequire} from 'node:module';
const {chromium} = createRequire('D:/guidejung/toss-src/tools/x.js')('playwright');
const base = process.argv[2] || 'http://localhost:8799';
const shots = [
  // [파일, 계산기 칸, {입력칸: 값}]
  ['calc-sum-60-60.png', '#calc-sum', {'sum-a': '60', 'sum-b': '60'}],
  ['calc-sum-70-60.png', '#calc-sum', {'sum-a': '70', 'sum-b': '60'}],
  ['calc-dist-80-1-8.png', '#calc-dist', {'dist-l': '80', 'dist-r1': '1', 'dist-r2': '8'}],
  ['calc-time-94.png', '#calc-time', {'time-l': '94'}],
];
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1200, height: 900}, deviceScaleFactor: 2});
for (const [file, sel, vals] of shots) {
  await page.goto(base + '/tools/decibel/');
  for (const [id, v] of Object.entries(vals)) await page.fill('#' + id, v);
  await page.evaluate(() => document.activeElement.blur());
  await page.locator(sel).screenshot({path: 'images/' + file});
  console.log('saved images/' + file);
}
await browser.close();
