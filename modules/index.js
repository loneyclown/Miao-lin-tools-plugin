import _ from 'lodash'
import moment from 'moment'
import fs from 'node:fs'
import path from 'path'
import plugin from '../../../lib/plugins/plugin.js'

export default class LinTools extends plugin {
  constructor (conf) {
    super({
      name: 'lin-tools-plugin',
      dsc: '林自用工具插件',
      priority: 50,
      ...conf,
      rule: _.map(conf.rule, (r) => {
        return {
          ...r,
          reg: `^林${r.reg}`
        }
      })
    })
  }

  get pluginRoot () {
    const _path = process.cwd().replace(/\\/g, '/')
    return path.join(_path, 'plugins', this.name)
  }

  get pluginDataPath () {
    return `${this.pluginRoot}/data`
  }

  get pluginResourcesPath () {
    return `${this.pluginRoot}/resources`
  }

  arrayToMap (arr, key) {
    const map = new Map()
    for (const item of arr) {
      map.set(item[key], item)
    }
    return map
  }

  mapToArray (map) {
    const arr = []
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of map) {
      arr.push(value)
    }
    return arr
  }

  existsJSON (filePath) {
    return fs.existsSync(filePath)
  }

  async writeJSON (filePath, data) {
    const newData = JSON.stringify(data, null, 2)
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
    try {
      await fs.promises.access(filePath, fs.constants.F_OK)
      await fs.promises.writeFile(filePath, newData, 'utf-8')
      return true
    } catch (error) {
      await fs.promises.appendFile(filePath, newData, 'utf-8')
      return false
    }
  }

  readJSON (filePath) {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath))
    } else {
      return []
    }
  }

  static getTimeBySeconds (value) {
    let secondTime = parseInt(value)// 秒
    let minuteTime = 0// 分
    let hourTime = 0// 小时
    if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
      // 获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60)
      // 获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60)
      // 如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
        // 获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60)
        // 获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60)
      }
    }
    const time = moment()
    time.hour(hourTime).minute(minuteTime).second(secondTime)
    return { hourTime, minuteTime, secondTime, time: time.format('HH:mm:ss') }
  }
}
