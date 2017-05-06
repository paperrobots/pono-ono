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
      html: this.template()
    })

    this.view.insertBefore(this.el, page)
  }

  template () {
    return `
      <video class="preloader__video" preload autoplay>
        <source src="${APP.THEME_URL}/assets/video/preloader.mp4" type="video/mp4">
      </video>`
  }

  resize (width, height) {
    config.width = width
    config.height = height
  }

  animateIn (req, done) {
    const video = document.querySelector('.preloader__video')

    const tl = new TimelineMax({ paused: true,
      onComplete: () => {
        done()
      }})

    tl.to(this.el, 1, { autoAlpha: 1 })
    tl.restart()

    video.addEventListener('timeupdate', e => {
      if (e.timeStamp > 4000) {
        this.preloaded()
      }
    })
  }

  animateOut (req, done) {
    const nav = document.querySelector('.js-menu-bar')
    const tl = new TimelineMax({ paused: true, onComplete: done })

    tl.to(nav, 1, { autoAlpha: 1, ease: Expo.easeInOut }, 'out')
    tl.to(this.el, 1, { autoAlpha: 0, ease: Expo.easeInOut }, 'out')
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
