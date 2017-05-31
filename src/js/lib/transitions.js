import 'pixi.js'
import config from 'config'
import { on } from 'dom-event'
import classes from 'dom-classes'

class Transitions {
  constructor (ready) {
    this.src = `${APP.THEME_URL}/assets/sprite/sprites.json`
    this.preloaded = ready
    this.ui = { pageLoader: document.querySelector('.js-page-loader') }
    this.scale = {
      x: config.width / 600,
      y: config.height / 338
    }

    this.onAssetsLoad = this.onAssetsLoad.bind(this)
  }

  initPIXI () {
    this.pixi = new PIXI.Application(config.width, config.height, { transparent: true })
    this.pixi.view.style.position = 'absolute'
    this.pixi.view.style.display = 'block'
    this.pixi.view.style.pointerEvents = 'none'
    this.pixi.view.style.zIndex = '9998'

    config.body.appendChild(this.pixi.view)
    this.pixi.stop()

    PIXI.loader.reset()
    PIXI.loader
      .add('spritesheet', this.src)
      .load(this.onAssetsLoad)
  }

  onAssetsLoad (loader, resources) {
    this.addEvents()

    const textures = resources.spritesheet.textures
    const frames = Object.keys(textures).map(key => textures[key])

    this.sprite = new PIXI.extras.AnimatedSprite(frames)
    this.sprite.x = 0
    this.sprite.y = 0
    this.sprite.scale.set(this.scale.x, this.scale.y)
    this.sprite.animationSpeed = 0.35
    this.sprite.loop = false

    this.pixi.stage.addChild(this.sprite)
    this.pixi.start()
    this.preloaded()
  }

  animateIntro () {
    this.sprite.gotoAndPlay(0)
  }

  animate () {
    const tl = new TimelineMax({ paused: true })
    tl.add(() => this.sprite.gotoAndPlay(0))
    tl.to(this.ui.pageLoader, 0.6, { autoAlpha: 1 })
    tl.add(() => classes.add(this.ui.pageLoader, 'is-animating'))
    tl.to(this.ui.pageLoader, 1, { autoAlpha: 1 })
    tl.add(() => classes.remove(this.ui.pageLoader, 'is-animating'))
    tl.to(this.ui.pageLoader, 0.5, { autoAlpha: 0 })
    tl.restart()
  }

  addEvents () {
    on(window, 'resize', this.resize.bind(this))
  }

  resize () {
    this.scale = {
      x: window.innerWidth / 600,
      y: window.innerHeight / 338
    }
    this.pixi.renderer.resize(window.innerWidth, window.innerHeight)
    this.sprite && this.sprite.scale.set(this.scale.x, this.scale.y)
  }
}

export default Transitions
