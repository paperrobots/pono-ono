import config from 'config'
import framework from 'framework'
import biggie from '@utils/biggie'
import query from 'query-dom-components'
import { on, off } from 'dom-event'
import classes from 'dom-classes'

class App {

  constructor(opt = {}) {

    this.onBurgerClick = this.onBurgerClick.bind(this)
    this.onPageClick = this.onPageClick.bind(this)
    this.onAnchorClick = this.onAnchorClick.bind(this)

    this.init()
  }

  init() {

    this.ui = query({ el: config.body })
    this.page = config.view
    this.a = Array.apply(null, this.ui.link)

    this.addEvents()

    framework.init()
  }

  addEvents() {

    biggie.bind.add(config.a)

    on(this.ui.burger, 'click', this.onBurgerClick)
    on(this.page, 'click', this.onPageClick)
    this.a.forEach(a => on(a, 'click', this.onAnchorClick))
  }

  onBurgerClick(e) {

    this.open === true ? this.animateMenuOut() : this.animateMenuIn()
  }

  onPageClick(e) {

    if (!this.open) return

    this.animateMenuOut()
  }

  onAnchorClick(e) {

    this.animateMenuOut()
  }

  animateMenuIn() {

    this.open = true

    classes.add(config.body, 'menu-is-open')

    const tl = new TimelineMax({ paused: true })

    tl.to(this.ui.overlay, 0.8, { autoAlpha: 0 }, 'in')
    tl.to(this.ui.mask, 0.8, { x: 0, borderColor: 'transparent' }, 'in')
    tl.to(this.ui.sideNav, 0.8, { x: 0 }, 'in')
    tl.staggerFrom(this.a, 1, { y: '100%', autoAlpha: 0 }, 0.06, 'in')
    tl.restart()
  }

  animateMenuOut() {

    this.open = false

    classes.remove(config.body, 'menu-is-open')

    this.translate = (config.width / 2) - 100;

    const tl = new TimelineMax({ paused: true })

    tl.to(this.ui.overlay, 0.8, { autoAlpha: 1 }, 'out')
    tl.to(this.ui.mask, 0.8, { x: -this.translate, borderColor: '#B8B8B8', clearProps: 'all' }, 'out')
    tl.to(this.ui.sideNav, 0.8, { x: this.translate, clearProps: 'all' }, 'out')
    tl.restart()
  }
}

module.exports = App
