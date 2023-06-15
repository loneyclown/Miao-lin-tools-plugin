import _ from 'lodash'
import moment from 'moment'
import fs from 'node:fs'
import path from 'path'
import plugin from '../../../lib/plugins/plugin.js'
import Setting from './setting.js'

export default class LinTools extends plugin {

  /** 插件公用配置 */
  baseSetting = {}
  /** 插件模块配置 */
  setting = {}

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

    // 初始化插件配置
    if (!this.baseSetting || _.isEmpty(this.baseSetting)) {
      this.baseSetting = Setting.getCfg('base')
      // this.baseSetting = new Setting('base')
    }
    // this.setting = new Setting(conf.moduleCode)
    this.setting = Setting.getCfg(conf.moduleCode)
  }

  /** 插件根路径 */
  get pluginRoot () {
    const _path = process.cwd().replace(/\\/g, '/')
    return path.join(_path, 'plugins', this.name)
  }

  /** 插件数据文件路径 */
  get pluginDataPath () {
    return `${this.pluginRoot}/data/${this.moduleCode}`
  }

  /** 插件资源文件路径 */
  get pluginResourcesPath () {
    return `${this.pluginRoot}/resources`
  }

  /**
   * 数组转Map
   * @param {*} arr 数组对象
   * @param {*} key 转换后的map对象的key
   * @returns 
   */
  arrayToMap (arr, key) {
    const map = new Map()
    for (const item of arr) {
      map.set(item[key], item)
    }
    return map
  }

  /**
   * Map转数组
   * @param {*} map map对象
   * @returns 
   */
  mapToArray (map) {
    const arr = []
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of map) {
      arr.push(value)
    }
    return arr
  }

  /**
   * 判断json文件是否存在
   * @param {*} filePath 文件路径
   * @returns 
   */
  existsJSON (filePath) {
    return fs.existsSync(filePath)
  }

  /**
   * 写入json
   * @param {*} filePath 文件路径
   * @param {*} data 需要写入的数据
   * @returns 
   */
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

  /**
   * 读取json
   * @param {*} filePath 文件路径
   * @returns 
   */
  readJSON (filePath) {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath))
    } else {
      return []
    }
  }

  /**
   * 静态 根据秒数获取完整时间对象
   * @param {*} value 秒数
   * @returns 
   */
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
    return { hourTime, minuteTime, secondTime, time }
  }
}
