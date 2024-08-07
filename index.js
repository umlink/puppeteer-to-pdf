const Koa = require('koa')
const KoaRouter = require('koa-router')
const json = require('koa-json')
const logger = require('koa-json')
const puppeteer = require('puppeteer')

const app = new Koa();
const router = new KoaRouter()
let browser
puppeteer.launch({
  headless: true,
  timeout: 30000,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  executablePath: '//Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}).then(b => browser = b)

router.get('/file-api/dps/create-pdf',  async(ctx) => {
  const { fileName, token, url } = ctx.request.query
  console.log(fileName, token, url)
  if (!fileName || !token || !url) {
    ctx.body = {
      code: 0,
      data: '',
      message: 'fileName,token,url都不可为空'
    }
    return
  }
  const page = await browser.newPage();
  await page.setCookie({
    name: '__dp_tk__',
    value: token,
    domain: 'www.developers.pub'
  })
  await page.goto(url, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({
    format: 'A4',
    margin: { top: 35, bottom: 35, left: 0, right: 0 }
  });
  await page.close();
  let newFileName = encodeURIComponent(fileName,"GBK")
  newFileName = newFileName.toString('iso8859-1')
  ctx.set({ 'Content-Type': 'application/pdf;charset=utf-8' })
  ctx.set('Content-disposition', `attachment;filename=${newFileName}.pdf`);
  ctx.body = pdf
})

router.get('/file-api/wktline/create-pdf',  async(ctx) => {
  const { fileName, token, url, margin } = ctx.request.query
  console.log(fileName, token, url)
  if (!fileName || !token || !url) {
    ctx.body = {
      code: 0,
      data: '',
      message: 'fileName,token,url都不可为空'
    }
    return
  }
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    authorization: token,
  });
  await page.goto(url, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: margin ? JSON.parse(margin) : { top: 40, bottom: 40, left: 30, right: 30 }
  });
  await page.close();
  let newFileName = encodeURIComponent(fileName,"GBK")
  newFileName = newFileName.toString('iso8859-1')
  ctx.set({ 'Content-Type': 'application/pdf;charset=utf-8' })
  ctx.set('Content-disposition', `attachment;filename=${newFileName}.pdf`);
  ctx.body = pdf
})

app.use(json())
app.use(logger())
app.use(router.routes())

app.listen(8088, () => {
  console.log('listen: 8088...')
})
