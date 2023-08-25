/* eslint-disable no-useless-escape */
import _ from 'lodash'
import moment from 'moment'
import LinTools from '../../modules/index.js'

export default class Admin extends LinTools {
  constructor () {
    super({
      moduleCode: 'admin',
      moduleName: '管理模块',
      rule: [
        {
          reg: '更新群名',
          fnc: '私人模块_更新群名'
        }
      ]
    })

    this.task = [
      {
        cron: '0 0 0 * * ?',
        name: '私人模块_自动修改群名',
        fnc: () => this.私人模块_自动修改群名(),
        log: false
      }
    ]
  }

  async 私人模块_更新群名 () {
    if (this.e.group_id === 869428640) {
      const groupId = 869428640
      const day = moment('2024-02-09').diff(moment(), 'd') + 1
      await Bot.setGroupName(groupId, `距离过年还有${day}天`)
      this.reply('群名更新成功')
    }
  }

  async 私人模块_自动修改群名 () {
    const groupId = 869428640
    const day = moment('2024-02-09').diff(moment(), 'd') + 1
    await Bot.setGroupName(groupId, `距离过年还有${day}天`)
    Bot.sendGroupMsg(groupId, [
      `新的一天，距离过年还有${day}天 ~~~`
    ])
  }
}
