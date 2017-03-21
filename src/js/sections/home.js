import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import Default from './default'
import 'pixi.js'

class Home extends Default {

	constructor(opt) {

		super(opt)

		this.slug = 'home'
		this.ui = null

		this.onAssetsLoad = this.onAssetsLoad.bind(this)
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		this.pixi = new PIXI.Application(config.width, config.height, { transparent: true })
		this.pixi.view.style.position = 'absolute'
		this.pixi.view.style.display = 'block'
		this.pixi.view.style.pointerEvents = 'none'
		this.pixi.view.style.zIndex = '9999'
		this.pixi.autoResize = true;

		config.body.appendChild(this.pixi.view)

		this.pixi.stop()

		PIXI.loader.reset()

		PIXI.loader
		  .add('spritesheet', `//${config.HOST}${this.ui.container.dataset.atlas}`)
		  .load(this.onAssetsLoad)

		done()
	}

	onAssetsLoad(loader, resources) {

		const textures = resources.spritesheet.textures
		const keys = Object.keys(textures)
		const frames = []

		keys.forEach(key => frames.push(textures[key]))

		this.anim = new PIXI.extras.AnimatedSprite(frames)

		this.anim.x = 0
    this.anim.y = 0
		this.anim.scale.set(2.4, 2.4)
    this.anim.animationSpeed = 0.5
    this.anim.play()

		this.pixi.stage.addChild(this.anim)
		this.pixi.start()
	}

	animateIn(req, done) {

		classes.add(config.body, `is-${this.slug}`)

		TweenLite.to(this.page, 1, {
			autoAlpha: 1,
			ease: Expo.easeInOut,
			onComplete: done
		})
	}

	animateOut(req, done) {

		classes.remove(config.body, `is-${this.slug}`)

		TweenLite.to(this.page, 0.7, {
			autoAlpha: 0,
			ease: Expo.easeInOut,
			onComplete: done
		})
	}

	resize(width, height) {

		super.resize()

		this.pixi.renderer.resize(width, height)
	}

	destroy(req, done) {

		super.destroy()

		this.ui = null

		this.page.parentNode.removeChild(this.page)
		this.pixi.view.parentNode.removeChild(this.pixi.view)

		done()
	}
}

module.exports = Home
