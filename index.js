const Koa = require('koa')
const KoaRouter = require('koa-router')
const json = require('koa-json')
const logger = require('koa-json')
const puppeteer = require('puppeteer')

const app = new Koa();
const router = new KoaRouter()

router.get('/developers/pdf',  async(ctx) => {
  console.log(0)
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 100000,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '//Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'
  });
  const page = await browser.newPage();
  await page.goto('https://www.developers.pub/article/603', {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({
    format: 'A4'
  });
  await browser.close();
  ctx.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
  ctx.body = pdf
})

app.use(json())
app.use(logger())
app.use(router.routes())

app.listen(3001, () => {
  console.log('listen: 3001...')
})
