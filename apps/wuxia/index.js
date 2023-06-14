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
        }
      ]
    })
  }

  async announcement (e) {
    let tfFlag = false
    let newFlag = false

    if (e.msg.includes('体服')) {
      tfFlag = true
    }

    if (e.msg.includes('最新')) {
      newFlag = true
    }

    const url = 'https://wuxia.qq.com/webplat/info/news_version3/5012/5013/5014/5016/m3485/list_1.shtml'
    const htmlRes = await nodeFetch(url).then((response) => response.arrayBuffer()).then((buffer) => {
      // const utf8Decoder = new TextDecoder('utf-8')
      // const html = utf8Decoder.decode(buffer)
      const html = iconv.decode(Buffer.from(buffer), 'gbk')
      return html
    })
    const liReg = /<li class="news-st"(([\s\S])*?)<\/li>/gi
    const iterator = htmlRes.matchAll(liReg)

    let news = { text: '', date: '2000-01-01', url: '' }
    // const arr = []
    const tArr = []
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

        // arr.push({
        //   liStr,
        //   text,
        //   date,
        //   url: `https://wuxia.qq.com${url}`
        // })
        tArr.push(`【${date}】${text}: https://wuxia.qq.com${url}`)
      }
    }

    logger.info(news)

    if (newFlag) {
      e.reply(`【${news.date}】${news.text}: https://wuxia.qq.com${news.url}`)
      return false
    }

    e.reply(this.makeForwardMsg(tArr))
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
