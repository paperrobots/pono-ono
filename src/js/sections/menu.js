import config from 'config'
import classes from 'dom-classes'
import { on, off } from 'dom-event'
import Default from './default'
import Slider from 'slider-manager'

class Menu extends Default {
  constructor (opt) {
    super(opt)

    this.slug = 'menu'

    this.bindEvents()
  }

  bindEvents () {
    ['onSlide', 'goToNextSlide', 'goToPreviousSlide']
    .forEach(fn => { this[fn] = this[fn].bind(this) })
  }

  init (req, done) {
    super.init(req, done)
  }

  ready (done) {
    super.ready()

    this.positionStepList()
    this.ui.title.forEach((el, i) => { el.innerHTML = super.positionTitle(i) })

    this.addEvents()

    done()
  }

  addEvents () {
    this.initSlider()

    on(this.ui.next, 'click', this.goToNextSlide)
    on(this.ui.prev, 'click', this.goToPreviousSlide)
  }

  removeEvents () {
    this.slider.destroy()

    off(this.ui.next, 'click', this.goToNextSlide)
    off(this.ui.prev, 'click', this.goToPreviousSlide)
  }

  positionStepList () {
    let margin = 32
    const interval = 1.2

    this.ui.steps.forEach((step, i) => {
      step.style.marginLeft = `${margin}%`
      margin = margin * interval
    })
  }

  initSlider () {
    this.current = 0
    this.previous = null
    this.slides = [...this.ui.slides]

    this.slider = new Slider({
      length: this.slides.length - 1,
      direction: config.infos.isDevice ? 'x' : 'y',
      limitInertia: true,
      callback: this.onSlide
    })

    this.slider.init()
  }

  onSlide (e) {
    const index = this.current = e.current

    if (this.current === 0) {
      classes.add(this.ui.prev, 'is-disabled')
      classes.add(this.ui.pdf, 'is-hidden')
      classes.remove(this.ui.cta, 'is-hidden')
    } else {
      classes.remove(this.ui.prev, 'is-disabled')
      classes.remove(this.ui.pdf, 'is-hidden')
      classes.add(this.ui.cta, 'is-hidden')
    }

    if (this.current === this.slides.length - 1) {
      classes.add(this.ui.next, 'is-disabled')
    } else {
      classes.remove(this.ui.next, 'is-disabled')
    }

    this.slider.animating = true

    const tl = new TimelineMax({ paused: true,
      onComplete: _ => {
        this.slider.animating = false
      }})

    tl.staggerTo(this.slides, 0.8, { cycle: { x: (loop) => index === loop ? 0 : loop < index ? -config.width : config.width }, ease: Expo.easeInOut }, 0, 0)

    tl.restart()
  }

  goToNextSlide () {
    classes.remove(this.ui.next, 'is-disabled')
    classes.remove(this.ui.prev, 'is-disabled')

    this.slider.goTo(this.current + 1)
  }

  goToPreviousSlide () {
    classes.remove(this.ui.next, 'is-disabled')
    classes.remove(this.ui.prev, 'is-disabled')

    this.slider.goTo(this.current - 1)
  }

  animateIn (req, done) {
    classes.add(config.body, `is-${this.slug}`)

    TweenLite.to(this.page, 1, {
      autoAlpha: 1,
      ease: Expo.easeInOut,
      onComplete: done
    })
  }

  animateOut (req, done) {
    classes.remove(config.body, `is-${this.slug}`)

    window.sprite.gotoAndPlay(0)

    TweenLite.to(this.page, 0.7, {
      autoAlpha: 0,
      ease: Expo.easeInOut,
      onComplete: done
    })
  }

  destroy (req, done) {
    super.destroy()

    this.removeEvents()

    this.page.parentNode.removeChild(this.page)

    done()
  }
}

module.exports = Menu
