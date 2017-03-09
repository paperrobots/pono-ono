import config from 'config'
import framework from 'framework'
import biggie from '@utils/biggie'

class App {

  constructor(opt = {}) {

    this.init()
  }

  init() {

    this.addEvents()

    framework.init()
  }

  addEvents() {

    biggie.bind.add(config.nav)
  }
}

module.exports = App
