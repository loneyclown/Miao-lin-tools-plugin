/* eslint-disable no-useless-escape */
import nodeFetch from 'node-fetch'
import _ from 'lodash'
import iconv from 'iconv-lite'
import moment from 'moment'
import LinTools from '../../modules/index.js'

export default class Wuxia extends LinTools {
  constructor () {
    super({
      moduleCode: 'wuxia',
      moduleName: '天涯明月刀工具模块',
      rule: [
        {
          reg: '天刀公告(体服)?(最新)?',
          fnc: 'announcement'
        }, {
          reg: '天刀145老一(文斗|答题|题目)?',
          fnc: 'td145one'
        }
      ]
    })
  }

  get moduleResourcesPath () {
    return `${this.pluginResourcesPath}/wuxia`
  }

  /** 公告 */
  async announcement (e) {
    /** 是否体服 */
    let tfFlag = false
    /** 是否最新 */
    let newFlag = false

    if (e.msg.includes('体服')) {
      tfFlag = true
    }

    if (e.msg.includes('最新')) {
      newFlag = true
    }

    const url = this.setting.wuxiaAnnoListUrl
    const htmlRes = await nodeFetch(url).then((response) => response.arrayBuffer()).then((buffer) => {
      // const utf8Decoder = new TextDecoder('utf-8')
      // const html = utf8Decoder.decode(buffer)
      const html = iconv.decode(Buffer.from(buffer), 'gbk')
      return html
    })
    const liReg = /<li class="news-st"(([\s\S])*?)<\/li>/gi
    const iterator = htmlRes.matchAll(liReg)

    let news = { text: '', date: '2000-01-01', url: '' }
    const arr = []
    // const tArr = []
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
        // tArr.push(`【${date}】${text}: https://wuxia.qq.com${url}`)
      }
    }

    // logger.info(news)

    if (newFlag) {
      e.reply(`【${news.date}】${news.text}: https://wuxia.qq.com${news.url}`)
      return false
    }

    // 日期排序
    const tArr = _.map(arr.sort((a, b) => moment(b.date).diff(moment(a.date))), (x) => {
      return `【${x.date}】${x.text}: ${x.url}`
    })

    e.reply(this.makeForwardMsg(tArr))
  }

  /** 145答题 */
  async td145one (e) {
    const img = segment.image(`${this.moduleResourcesPath}/td145one.jpg`)
    e.reply(img)
  }
}
