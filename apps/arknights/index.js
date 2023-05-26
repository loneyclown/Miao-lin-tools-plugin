import moment from 'moment'
import _ from 'lodash'
import LinTools from '../../modules/index.js'

export default class Arknights extends LinTools {
  constructor () {
    super({
      name: 'lin-tools-plugin',
      dsc: '林自用工具插件',
      priority: 50,
      rule: [
        {
          reg: '^#理智记录(\\d+)?',
          fnc: 'reason'
        }
      ]
    })

    this.task = [
      {
        cron: '0/6 * * * * ?',
        name: '理智恢复提醒',
        fnc: this.reasonTips,
        log: false
      }
    ]

    // console.log('34 >>> this', this)
    // console.log('34 >>> this', this.e)
    // console.log('34 >>> this', this.e.reply)
  }

  async reason (e) {
    const reg = /^#理智记录(\d+)/
    const reasonNum = e.msg.replace(reg, '$1')
    if (!_.isNumber(Number(reasonNum)) || Number(reasonNum) <= 0) {
      e.reply('请输入需要记录的理智值, 请输入大于0的数值, 如: #理智记录20')
      return false
    }

    console.log(e.user_id)

    try {
      await redis.set(`LIN-TOOLS-ARK-REASON:${e.user_id}`, reasonNum)

      const difference = 130 - Number(reasonNum)
      const seconds = difference * 6 * 60
      const time = moment().subtract(seconds, 'seconds').format('hh:mm:ss')
      const date = moment().add(seconds, 'seconds').format('YYYY-MM-DD HH:mm:ss')

      e.reply(`已为您记录下当前理智值[${reasonNum}]，预计[${time}]后恢复到130, 预计完全恢复时间: [${date}]`, true)
    } catch (error) {
      logger.error(error)
      e.reply('理智记录失败，请检查日志')
    }
  }

  async reasonTips () {
    // console.log('e', e)
    // console.log('this', this)
    // console.log('this.job', this.job)
    // console.log(Bot)
    // console.log(Bot.e)
    // console.log(Bot.reply)
    // // console.log('this.job.job', this.job.job)
    // // console.log(this.reply)
    // Bot.reply('测试提醒', false, { at: true })
  }
}
