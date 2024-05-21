const Koa = require('koa')
const KoaRouter = require('koa-router')
const json = require('koa-json')
const logger = require('koa-json')
const PuppeteerPool = require('./pool')
const fs = require('fs')

const app = new Koa();
const router = new KoaRouter()


router.get('/file-api/dps/create-pdf',  async(ctx) => {
  // const { fileName, token, url } = ctx.request.query
  // console.log(fileName, token, url)
  // if (!fileName || !token || !url) {
  //   ctx.body = {
  //     code: 0,
  //     data: '',
  //     message: 'fileName,token,url都不可为空'
  //   }
  //   return
  // }
  var pdf = wkhtmltopdf('<h1>Test</h1><p>Hello world</p>', { pageSize: 'letter' })
      .pipe(fs.createWriteStream('out.pdf'))
  // const page = await browser.newPage();
  // await page.setCookie({
  //   name: '__dp_tk__',
  //   value: token,
  //   domain: 'www.developers.pub'
  // })
  // await page.goto(url, {waitUntil: 'networkidle0'});
  // const pdf = await page.pdf({
  //   format: 'A4',
  //   margin: { top: 35, bottom: 35, left: 0, right: 0 }
  // });
  // await page.close();
  // let newFileName = encodeURIComponent(fileName,"GBK")
  // newFileName = newFileName.toString('iso8859-1')
  PuppeteerPool(ctx.body).then(file => {
    res.json({
      code: 1,
      data: file,
      msg: ""
    })
  }).catch(err => {
    res.json({
      code: 0,
      data: null,
      msg: "海报生成失败",
      err: String(err)
    })
  })
})

app.use(json())
app.use(logger())
app.use(router.routes())

app.listen(8088, () => {
  console.log('listen: 8088...')
})
