/* eslint-disable no-useless-escape */
import nodeFetch from 'node-fetch'
import _ from 'lodash'
import iconv from 'iconv-lite'
import moment from 'moment'
import LinTools from '../../modules/index.js'

export default class Nsh extends LinTools {
  constructor () {
    super({
      moduleCode: 'nsh',
      moduleName: '逆水寒手游工具模块',
      rule: [{
          reg: '(神相|铁衣|素问|血河|碎梦|九灵)(职业)?攻略$',
          fnc: 'announcement'
        }]
    })
  }

  get moduleResourcesPath () {
    return `${this.pluginResourcesPath}/wuxia`
  }

  职业攻略 (e) {
      const imgs = {
          神相: 'https://i.postimg.cc/hvYVYZ0S/image.jpg'
      }

      const job = e.msg.replace(/^林(神相|铁衣|素问|血河|碎梦|九灵)(职业)?攻略$/, '$1')
      const img = segment.image(imgs[job])
    e.reply(img)
      
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