import framework from 'framework'
import config from 'config'
import utils from 'utils'
import select from 'dom-select'
import event from 'dom-event'
import classes from 'dom-classes'
import query from 'query-dom-components'
import biggie from '@utils/biggie'

class Default {

  constructor(opt = {}) {

    this.view = config.view
    this.page = null
    this.a = null
  }

  init(req, done, options) {

    const opts = options || { cache: true, sub: false }
    const view = this.view

    let page;

    if (req.previous === undefined) {
      page = this.view.querySelector('.page');
      classes.remove(page, 'is-hidden')
      this.ready(done)
    } else {
      const ready = this.ready.bind(this, done)
      page = biggie.page(req, view, opts, ready)
    }

    this.page = page;
  }

  ready() {

    this.ui = query({ el: this.page })

    this.a = select.all('a', this.page)

    biggie.bind.add(this.a)
  }

  resize(width, height) {

    config.height = height
    config.width = width

    config.menuBarIsHorizontal = config.width < 769
  }

  destroy() {

    biggie.bind.remove(this.a)

    this.a = null
  }
}

module.exports = Default
