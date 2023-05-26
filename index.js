if (!global.segment) {
  global.segment = (await import('oicq')).segment
}

if (Bot?.logger?.info) {
  Bot.logger.info('===========================================')
  Bot.logger.info('lin-tools-plugin loading success')
  Bot.logger.info('===========================================')
} else {
  console.log('===========================================')
  console.log('lin-tools-plugin loading success')
  console.log('===========================================')
}

export * from './apps/index.js'
