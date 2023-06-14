/* eslint-disable no-useless-escape */
import nodeFetch from 'node-fetch'
import fs from 'node:fs'
import _ from 'lodash'
import LinTools from '../../modules/index.js'

export default class Wuxia extends LinTools {
  constructor () {
    super({
      moduleCode: 'wuxia',
      moduleName: '天涯明月刀工具模块',
      rule: [
        {
          reg: '天刀公告',
          fnc: 'announcement'
        }
      ]
    })
  }

  async announcement (e) {
    const url = 'https://wuxia.qq.com/webplat/info/news_version3/5012/5013/5014/5016/m3485/list_1.shtml'
    const htmlRes = await nodeFetch(url).then((response) => response.arrayBuffer()).then((buffer) => {
      const utf8Decoder = new TextDecoder('GBK')
      const html = utf8Decoder.decode(buffer)
      return html
    })
    // console.log(htmlRes)
    const liReg = /<li class="news-st"(([\s\S])*?)<\/li>/gi
    const iterator = htmlRes.matchAll(liReg)

    const arr = []
    const tArr = []
    for (const item of iterator) {
      if (item && item[0]) {
        const liStr = item[0]
        const url = liStr.match(/<a class="cltit" (.*) href=\"(.*)\">(.*)<\/a>/)[2]
        const text = liStr.match(/<a class="cltit" (.*) href=\"(.*)\">(.*)<\/a>/)[3]
        const date = liStr.match(/<span class="cltime">(.*)<\/span>/)[1]
        arr.push({
          liStr,
          text,
          date,
          url: `https://wuxia.qq.com${url}`
        })
        tArr.push(`【${date}】${text}: https://wuxia.qq.com${url}`)
      }
    }

    e.reply(this.makeForwardMsg(tArr))

    // console.log(arr)

    // const start = Date.now()

    // const browser = await puppeteer.launch()
    // const page = await browser.newPage()
    // await page.goto('https://wuxia.qq.com/webplat/info/news_version3/5012/5013/5014/5016/m3486/202303/931558.shtml')

    // const body = await page.$('body')

    // // // 计算页面高度
    // // const boundingBox = await body.boundingBox()

    // const buff = await body.screenshot({
    //   type: 'jpeg',
    //   omitBackground: false,
    //   quality: 90,
    //   path: ''
    // })
    // /** 计算图片大小 */
    // const kb = (buff.length / 1024).toFixed(2) + 'kb'
    // logger.mark(`[图片生成] ${kb} ${logger.green(`${Date.now() - start}ms`)}`)
    // // await page.screenshot({ path: '' })
    // await browser.close()

    // console.log('buff', buff)
    // const img = segment.image(buff)
    // e.reply(img)
    // let utf8decoder = new TextDecoder("GBK");
    // const t = await grab(url)
    // e.reply(JSON.stringify(t))
  }

  /**
 * 制作转发消息
 * @returns
 */
  async makeForwardMsg (arr) {
    let nickname = (this.e.bot ?? Bot).nickname
    if (this.e.isGroup) {
      const info = await (this.e.bot ?? Bot).getGroupMemberInfo(this.e.group_id, (this.e.bot ?? Bot).uin)
      nickname = info.card || info.nickname
    }
    const userInfo = {
      user_id: (this.e.bot ?? Bot).uin,
      nickname
    }

    let forwardMsg = _.map(arr, (x) => {
      return {
        ...userInfo,
        message: x
      }
    })

    /** 制作转发内容 */
    if (this.e.isGroup) {
      forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
    } else {
      forwardMsg = await this.e.friend.makeForwardMsg(forwardMsg)
    }

    return forwardMsg
  }
}
