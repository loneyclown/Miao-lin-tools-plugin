import moment from 'moment'
import _ from 'lodash'
import LinTools from '../../modules/index.js'

export default class Arknights extends LinTools {
  constructor () {
    super({
      moduleCode: 'arknights',
      moduleName: '明日方舟工具模块',
      rule: [
        {
          reg: '理智(\\d+)(/)?(\\d+)?',
          fnc: 'reason'
        }
      ]
    })

    this.task = [
      {
        cron: '0 0/6 * * * ?',
        name: '理智恢复提醒',
        fnc: () => this.reasonTips(),
        log: false
      }
    ]
  }

  // get dataPath () {
  //   return `${this.pluginDataPath}/arknights`
  // }

  async reason (e) {
    console.log(this.e)
    const rule = _.find(this.rule, ['fnc', 'reason'])
    const reg = new RegExp(rule.reg)
    const currReasonNum = Number(e.msg.replace(reg, '$1'))
    const maxReasonNum = Number(e.msg.replace(reg, '$3') || 130)
    const userId = e.user_id
    const groupId = e.group_id

    console.log({
      currReasonNum,
      maxReasonNum
    })

    if (currReasonNum >= maxReasonNum) {
      e.reply('刀客塔，你的理智足够充足，去消费下再来吧~', true)
      return false
    }

    try {
      const path = `${this.this.pluginDataPath}/reason.json`
      const { time, date, noteTime } = await this.getReasonTime(currReasonNum, maxReasonNum)
      const obj = { userId, currReasonNum, maxReasonNum, recoverTime: time, recoverDate: date, noteTime, groupId, isTips: false }
      if (this.existsJSON(path)) {
        const json = await this.readJSON(path)
        const map = this.arrayToMap(json, 'userId')
        map.set(userId, obj)
        await this.writeJSON(`${this.this.pluginDataPath}/reason.json`, this.mapToArray(map))
      } else {
        await this.writeJSON(`${this.this.pluginDataPath}/reason.json`, [obj])
      }
      e.reply(`已为您记录下当前理智值[${currReasonNum}]\n预计[${time}]后恢复到[${maxReasonNum}]\n预计完全恢复时间: [${date}]`, true)
    } catch (error) {
      logger.error(error)
      e.reply('理智记录失败，请检查日志')
    }
  }

  async reasonTips () {
    try {
      const path = `${this.this.pluginDataPath}/reason.json`
      if (this.existsJSON(path)) {
        const json = await this.readJSON(path)
        const map = this.arrayToMap(json, 'userId')
        const mapIter = map.values()
        for (let i = 0; i < map.size; i++) {
          const item = mapIter.next().value
          const noteTime = moment(item.noteTime)
          const currTime = moment()
          const diff = currTime.diff(noteTime, 'minutes')
          const dot = parseInt(diff / 6)
          const curr = item.currReasonNum + dot
          if (curr >= item.maxReasonNum && !item.isTips) {
            Bot.sendGroupMsg(item.groupId, [
              global.segment.at(item.userId),
              '刀客塔，你记录的理智好像得到了恢复, 快去看看吧~'
            ])
            map.set(item.userId, { ...item, isTips: true })
            await this.writeJSON(`${this.dataPath}/reason.json`, this.mapToArray(map))
          }
        }
      }
    } catch (error) {
      console.log('reasonTips error', error)
      return Promise.reject(new Error(error))
    }
  }

  async getReasonTime (currReasonNum, maxReasonNum) {
    if (currReasonNum && maxReasonNum) {
      return getDate(currReasonNum, maxReasonNum)
    }
  }
}

function getDate (currReasonNum, maxReasonNum) {
  const noteTime = moment().format('YYYY-MM-DD HH:mm:ss')
  const difference = Number(maxReasonNum) - Number(currReasonNum)
  const seconds = difference * 6 * 60
  const time = LinTools.getTimeBySeconds(seconds).time.format('HH小时mm分ss秒')
  const date = moment(noteTime).add(seconds, 's').format('YYYY-MM-DD HH:mm:ss')
  return { time, date, noteTime }
}
