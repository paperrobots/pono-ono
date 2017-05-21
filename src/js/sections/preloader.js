import config from 'config'
import sniffer from 'sniffer'
import classes from 'dom-classes'
import create from 'dom-create-element'
import 'gsap'
import 'pixi.js'

TweenLite.defaultEase = Expo.easeOut

class Preloader {
  constructor (onComplete) {
    this.preloaded = onComplete
    this.view = config.view
    this.el = null

    this.onAssetsLoad = this.onAssetsLoad.bind(this)
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
        this.initPIXI()
      }})

    tl.to(this.el, 1, {autoAlpha: 1})
    tl.to('.preloader__progress-bar', 2, { scaleX: 1, ease: Expo.easeInOut })
    tl.restart()
  }

  animateOut (req, done) {
    const tl = new TimelineMax({ paused: true, onComplete: done })

    tl.set('.preloader__progress-bar', { transformOrigin: 'right' })
    tl.to('.preloader__progress-bar', 0.8, { scaleX: 0, ease: Expo.easeIn }, 'out')
    tl.to(this.el, 0.7, { autoAlpha: 0, ease: Expo.easeIn }, 'out', '+=0.5')

    tl.restart()
  }

  initPIXI () {
    window.pixi = new PIXI.Application(config.width, config.height, { transparent: true })
    window.pixi.view.style.position = 'absolute'
    window.pixi.view.style.display = 'block'
    window.pixi.view.style.pointerEvents = 'none'
    window.pixi.view.style.zIndex = '9999'
    window.pixi.autoResize = true

    config.body.appendChild(window.pixi.view)

    window.pixi.stop()

    PIXI.loader.reset()

    PIXI.loader
      .add('spritesheet', `${APP.THEME_URL}/assets/sprite/sprites.json`)
      .load(this.onAssetsLoad)
  }

  onAssetsLoad (loader, resources) {
    this.preloaded()

    const textures = resources.spritesheet.textures
    const keys = Object.keys(textures)
    const frames = []

    keys.forEach(key => frames.push(textures[key]))

    window.sprite = new PIXI.extras.AnimatedSprite(frames)

    window.sprite.x = -20
    window.sprite.y = 0
    window.sprite.scale.set(2.5, 2.5)
    window.sprite.animationSpeed = 0.35
    window.sprite.loop = false
    window.sprite.gotoAndPlay(0)

    window.pixi.stage.addChild(window.sprite)
    window.pixi.start()
  }

  destroy (req, done) {
    classes.add(config.body, 'is-loaded')
    classes.remove(config.body, 'is-loading')

    this.view.removeChild(this.el)

    done()
  }
}

module.exports = Preloader
