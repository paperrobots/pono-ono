import config from 'config'
import select from 'dom-select'
import query from 'query-dom-components'
import biggie from '@utils/biggie'

class Default {
  constructor (opt = {}) {
    this.view = config.view
    this.page = null
    this.a = null
  }

  init (req, done, options) {
    const opts = options || { cache: true, sub: false }
    const view = this.view
    const ready = this.ready.bind(this, done)
    this.page = biggie.page(req, view, opts, ready)
  }

  ready () {
    this.ui = query({ el: this.page })

    this.a = select.all('a', this.page)

    biggie.bind.add(this.a)
  }

  resize (width, height) {
    config.height = height
    config.width = width

    config.menuBarIsHorizontal = config.width < 769
  }

  positionTitle (i) {
    return [this.ui.title[i]]
      .map(el => el.textContent)
      .map(str => str.split(' '))
      .map(words =>
        words.length > 1
          ? `${words[0]}<div style="margin-left: 1ch">${words.slice(1).join(' ')}</div>`
          : words[0])
  }

  destroy () {
    biggie.bind.remove(this.a)

    this.a = null
  }
}

module.exports = Default
