import LinTools from '../../modules/index.js'
import grab from './grab.js'

export default class Wuxia extends LinTools {
  constructor () {
    super({
      moduleCode: 'wuxia',
      moduleName: '天涯明月刀工具模块',
      rule: [
        {
          reg: '公告',
          fnc: 'announcement'
        }
      ]
    })
  }

  async announcement (e) {
    const url = 'https://wuxia.qq.com/webplat/info/news_version3/5012/5013/5014/5016/m3485/list_1.shtml'
    grab(url)
  }
}