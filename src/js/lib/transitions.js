import 'pixi.js'
import config from 'config'
import { on } from 'dom-event'

class Transitions {
  constructor (ready) {
    this.src = `${APP.THEME_URL}/assets/sprite/sprites.json`
    this.ready = ready
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
    this.pixi.view.style.zIndex = '9999'
    this.pixi.autoResize = true

    config.body.appendChild(this.pixi.view)
    this.pixi.stop()

    PIXI.loader.reset()
    PIXI.loader
      .add('spritesheet', this.src)
      .load(this.onAssetsLoad)
  }

  onAssetsLoad (loader, resources) {
    this.addEvents()
    this.ready()

    const textures = resources.spritesheet.textures
    const frames = Object.keys(textures).map(key => textures[key])

    this.sprite = new PIXI.extras.AnimatedSprite(frames)
    this.sprite.x = 0
    this.sprite.y = 0
    this.sprite.scale.set(this.scale.x, this.scale.y)
    this.sprite.animationSpeed = 0.35
    this.sprite.loop = false
    this.animate()

    this.pixi.stage.addChild(this.sprite)
    this.pixi.start()
  }

  animate () {
    this.sprite.gotoAndPlay(0)
  }

  addEvents () {
    on(window, 'resize', this.resize.bind(this))
  }

  resize () {
    this.scale = {
      x: window.innerWidth / 600,
      y: window.innerHeight / 338
    }
    this.pixi.view.style.width = `${window.innerWidth}px`
    this.pixi.view.style.height = `${window.innerHeight}px`
    this.sprite && this.sprite.scale.set(this.scale.x, this.scale.y)
  }
}

export default Transitions
