import plugin from '../../../lib/plugins/plugin.js'

export default class LinTools extends plugin {
  constructor (conf) {
    super({
      name: 'lin-tools-plugin',
      dsc: '林自用工具插件',
      priority: 50,
      ...conf
    })
  }
}
