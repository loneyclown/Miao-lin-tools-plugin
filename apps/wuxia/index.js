/* eslint-disable no-useless-escape */
import nodeFetch from 'node-fetch'
import _ from 'lodash'
import moment from 'moment'
import puppeteer from 'puppeteer'
import LinTools from '../../modules/index.js'

export default class Wuxia extends LinTools {
  constructor () {
    super({
      moduleCode: 'wuxia',
      moduleName: '天涯明月刀工具模块',
      rule: [
        {
          reg: '天刀公告(体服)?(最新)?(图)?',
          fnc: 'announcement'
        }
      ]
    })
  }

  /** 公告 */
  async announcement (e) {
    /** 是否体服 */
    const tfFlag = e.msg.includes('体服')
    /** 是否最新 */
    const newFlag = e.msg.includes('最新')
    /** 是否图片发送 */
    const imgFlag = e.msg.includes('图')

    const url = this.setting.wuxiaAnnoListUrl
    const htmlRes = await nodeFetch(url).then((response) => response.arrayBuffer()).then((buffer) => new TextDecoder('gbk').decode(buffer))
    const liReg = /<li class="news-st"(([\s\S])*?)<\/li>/gi
    const iterator = htmlRes.matchAll(liReg)

    let news = { text: '', date: '2000-01-01', url: '' }
    const arr = []
    for (const item of iterator) {
      if (item && item[0]) {
        const liStr = item[0]
        const url = liStr.match(/<a class="cltit" (.*) href=\"(.*)\">(.*)<\/a>/)[2]
        const text = liStr.match(/<a class="cltit" (.*) href=\"(.*)\">(.*)<\/a>/)[3]
        const date = liStr.match(/<span class="cltime">(.*)<\/span>/)[1]

        if (moment(date).diff(moment(news.date)) > 0) {
          if (tfFlag) {
            if (text.includes('欢乐英雄')) {
              news = { text, date, url }
            }
          } else if (newFlag) {
            news = { text, date, url }
          }
        }

        if (tfFlag) {
          if (text.includes('欢乐英雄')) {
            arr.push({
              liStr,
              text,
              date,
              url: `https://wuxia.qq.com${url}`
            })
          }
        } else {
          arr.push({
            liStr,
            text,
            date,
            url: `https://wuxia.qq.com${url}`
          })
        }
      }
    }

    if (newFlag) {
      if (imgFlag) {
        await this.screenshot(`https://wuxia.qq.com${news.url}`, '.main')
        return false
      }
      e.reply(`【${news.date}】${news.text}: https://wuxia.qq.com${news.url}`)
      return false
    }

    // 日期排序
    const tArr = _.map(arr.sort((a, b) => moment(b.date).diff(moment(a.date))), (x) => {
      return `【${x.date}】${x.text}: ${x.url}`
    })

    // e.reply(this.makeForwardMsg(tArr))
    e.reply(Bot.makeForwardArray(tArr))
  }

  async screenshot(url, selectors = 'body') {
    logger.info(this.moduleResourcesPath, this.moduleDataPath)
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(url)
    const body = await page.$(selectors)
    await body.screenshot({ path: `${this.moduleResourcesPath}/temp.jpg` })
    const img = segment.image(`${this.moduleResourcesPath}/temp.jpg`)
    await e.reply(img)
    await browser.close()
    await fs.unlink(`${this.moduleResourcesPath}/temp.jpg`);
  }
}
