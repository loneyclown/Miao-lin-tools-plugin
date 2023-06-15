import fs from 'node:fs'
import YAML from 'yaml'

export default class File {
  constructor () {}
  /**
   * 读取yaml文件，对象形式
   * @param {*} filePath 文件路径
   * @returns {Object} yaml转换后的对象
   */
  static readYaml (filePath) {
    try {
      return YAML.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (error) {
      logger.error(`YAML文件解析错误 ${error}`)
      return false
    }
  }

  /**
   * 写入yaml文件，对象形式
   * @param {*} filePath 文件路径
   * @param {*} obj 需要写入文件的对象
   */
  static writeYaml (filePath, obj) {
    try {
      fs.writeFileSync(filePath, YAML.stringify(obj), 'utf8')
    } catch (error) {
      logger.error(`YAML文件写入错误 ${error}`)
      return false
    }
  }
}