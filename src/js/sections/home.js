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
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		this.renderer = new PIXI.autoDetectRenderer(config.width, config.height, { transparent: true })
		this.renderer.view.style.position = 'absolute'
		this.renderer.view.style.display = 'block'
		this.renderer.view.style.pointerEvents = 'none'
		this.renderer.autoResize = true;

		config.body.appendChild(this.renderer.view)

		this.stage = new PIXI.Container()

		PIXI.loader
		  .add('assets/img/sprite-01.png')
		  .load(this.setupSprite)

		done()
	}

	setupSprite() {

		console.log('entered setup')
	  // //Create the `tileset` sprite from the texture
	  // const texture = PIXI.utils.TextureCache['assets/img/sprite-01.png']
		//
	  // // Create a rectangle object that defines the position and
	  // // size of the sub-image you want to extract from the texture
	  // const rectangle = new PIXI.Rectangle(192, 128, 64, 64)
		//
	  // // Tell the texture to use that rectangular section
	  // texture.frame = rectangle
		//
	  // // Create the sprite from the texture
	  // const sprite = new PIXI.Sprite(texture)
		//
	  // // Position the rocket sprite on the canvas
	  // sprite.x = 0
	  // sprite.y = 0
		//
	  // // Add the rocket to the stage
	  // this.stage.addChild(sprite)
		//
	  // // Render the stage
	  // this.renderer.render(stage)
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

		this.renderer.resize(width, height)
	}

	destroy(req, done) {

		super.destroy()

		this.ui = null

		this.page.parentNode.removeChild(this.page)

		done()
	}
}

module.exports = Home
