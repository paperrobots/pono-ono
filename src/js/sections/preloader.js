import config from 'config'
import sniffer from 'sniffer'
import classes from 'dom-classes'
import create from 'dom-create-element'
import 'gsap'

TweenLite.defaultEase = Expo.easeOut

class Preloader {
  constructor (onComplete) {
    this.preloaded = onComplete
    this.view = config.view
    this.el = null
  }

  init (req, done) {
    classes.add(config.body, 'is-loading')

    config.infos = sniffer.getInfos()

    this.createDOM()

    done()
  }

  createDOM () {
    const page = this.view.firstChild

    this.el = create({
      selector: 'div',
      styles: 'preloader',
      html: `
        <div class="preloader__inner">
          <img class="preloader__logo" src="${APP.THEME_URL}/assets/img/logo-green.png" alt="Logo" />
          <div class="preloader__progress-bar"></div>
        </div>`
    })

    this.view.insertBefore(this.el, page)
  }

  resize (width, height) {
    config.width = width
    config.height = height
  }

  animateIn (req, done) {
    const tl = new TimelineMax({ paused: true,
      onComplete: () => {
        done()
        this.preloaded()
      }})

    tl.to(this.el, 1, {autoAlpha: 1})
    tl.to('.preloader__progress-bar', 2, { scaleX: 1, ease: Expo.easeInOut })
    tl.restart()
  }

  animateOut (req, done) {
    const tl = new TimelineMax({ paused: true, onComplete: done })

    tl.set('.preloader__progress-bar', { transformOrigin: 'right' })
    tl.to('.preloader__progress-bar', 0.8, { scaleX: 0, ease: Expo.easeIn }, 'out')
    tl.to(this.el, 0.7, { autoAlpha: 0, ease: Expo.easeIn }, 'out', '+=0.4')

    tl.restart()
  }

  destroy (req, done) {
    classes.add(config.body, 'is-loaded')
    classes.remove(config.body, 'is-loading')

    this.view.removeChild(this.el)

    done()
  }
}

module.exports = Preloader
