const Koa = require('koa')
const KoaRouter = require('koa-router')
const json = require('koa-json')
const logger = require('koa-json')
const { genPDF } = require('./poolUtils')
const fs = require('fs')

const app = new Koa();
const router = new KoaRouter()


router.get('/file-api/dps/create-pdf',  async(ctx) => {
  console.log(ctx.url)
  const { fileName, token, url } = ctx.request.query
  console.log(fileName, token, url, new Date())
  if (!fileName || !token || !url) {
    ctx.body = {
      code: 0,
      data: '',
      message: 'fileName,token,url都不可为空'
    }
    return
  }
  const pdf = await genPDF({
    url,
    token,
    waitTime: 0
  }).catch(() => {
    ctx.body = {
      code: 0,
      data: '',
      message: '未知异常，请重试'
    }
  })
  let newFileName = encodeURIComponent(fileName, "GBK")
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
