const Koa = require('koa')
const KoaRouter = require('koa-router')
const json = require('koa-json')
const logger = require('koa-json')
const puppeteer = require('puppeteer')

const app = new Koa();
const router = new KoaRouter()

router.get('/file-api/dps/create-pdf',  async(ctx) => {
  const { fileName, token, url } = ctx.request.query
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 30000,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // executablePath: '//Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'
  });
  const page = await browser.newPage();
  page.setCookie({
    name: '__dp_tk__',
    value: token,
    domain: 'www.developers.pub'
  })
  await page.goto(url, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({
    format: 'A4',
    margin: { top: 30, bottom: 30, left: 30, right: 30 }
  });
  await browser.close();
  ctx.set('Content-disposition', `attachment; filename=${fileName}.pdf`);
  ctx.body = pdf
})

app.use(json())
app.use(logger())
app.use(router.routes())

app.listen(3001, () => {
  console.log('listen: 3001...')
})
