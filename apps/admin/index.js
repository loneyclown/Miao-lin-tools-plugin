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
        },
        {
          reg: '汤圆定制今日老公',
          fnc: '私人模块_汤圆定制今日老公'
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

  async 私人模块_汤圆定制今日老公(e) {
    const groupId = 561892282
    // const userId = [1163170808]
    if (e.group_id === groupId) {
      const memberMap = await e.group.getMemberMap()
      const u = memberMap.get(940906772)
      const msg = [
        segment.at(e.user_id),
        "\n荣登今天汤圆帝后位的幸运妃子是",
        segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${u.user_id}`),
        `【${u.nickname}】(${u.user_id})\n让我举群狂欢，恭迎新后~~~`
      ]
      e.reply(msg)
    }
  }
}
