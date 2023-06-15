import fs from 'node:fs'
import chokidar from 'chokidar'
import File from './file.js'
import _ from 'lodash'

const _path = process.cwd().replace(/\\/g, '/')

class Setting {

  /** 插件默认配置 */
  defPath = `${_path}/plugins/lin-tools-plugin/defSet/`
  /** 插件用户自定义配置 */
  configPath = `${_path}/plugins/lin-tools-plugin/config/`
  /** 配置监听 */
  watcher = {}

  constructor () {
    this.initCfg()
  }

  /** 初始化配置，拷贝默认配置，监听配置修改 */
  initCfg () {
    const files = fs.readdirSync(this.defPath).filter(file => file.endsWith('.yaml'))
    for (const file of files) {
      const app = file.replace(/(.*)\.yaml$/, '$1')
      const filePath = this.getFilePath(app)
      if (filePath) {
        this.watch(app)
      }
    }
  }

  /**
   * 获取配置
   * @param {*} app 模块
   * @returns 配置对象
   */
  getCfg (app) {
    const filePath = this.getFilePath(app)
    if (!filePath) {
      return {}
    }
    return File.readYaml(filePath)
  }

  /**
   * 获取插件配置文件路径
   * @param {*} app 模块
   * @param {*} type 配置类型
   * @returns 
   */
  getFilePath (app) {
    try {
      // 缺少用户配置则拷贝默认配置到用户配置
      if (!fs.existsSync(`${this.configPath}${app}.yaml`)) {
        fs.copyFileSync(`${this.defPath}${app}.yaml`, `${this.configPath}${app}.yaml`)
      }
    } catch (error) {
      // 没有默认配置时直接返回false
      return false
    }

    return `${this.configPath}${app}.yaml`
  }

  watch (app) {
    const filePath = this.getFilePath(app)
    if (!filePath) {
      return
    }
    if (this.watcher && !_.isEmpty(this.watcher)) {
      return
    }
    const watcher = chokidar.watch(filePath)
    watcher.on('change', path => {
      logger.mark(`[lin-tools-plugin][${app}]修改配置文件: ${path}`)
    })
    this.watcher = watcher
  }
}

export default new Setting()