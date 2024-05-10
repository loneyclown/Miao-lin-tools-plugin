/* eslint-disable no-useless-escape */
import _ from 'lodash'
import LinTools from '../../modules/index.js'

export default class Nsh extends LinTools {
  constructor () {
    super({
      moduleCode: 'nsh',
      moduleName: '逆水寒手游工具模块',
      rule: [{
          reg: '(神相|铁衣|素问|血河|碎梦|九灵)(职业)?攻略$',
          fnc: '职业攻略'
        }]
    })
  }

  职业攻略 (e) {
    const imgs = {
        神相: `${this.moduleResourcesPath}/攻略/神相.jpg`,
        铁衣: `${this.moduleResourcesPath}/攻略/铁衣.jpg`,
        碎梦: `${this.moduleResourcesPath}/攻略/碎梦.jpg`,
    }
    const job = e.msg.replace(/^林(神相|铁衣|素问|血河|碎梦|九灵)(职业)?攻略$/, '$1')
    const img = imgs[job]
    if (!img) {
        e.reply('当前职业暂时没有攻略哦')
    }
    e.reply(segment.image(img))
  }
}
