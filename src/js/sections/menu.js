import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import Default from './default'
import Slider from '../lib/slider'

class Menu extends Default {

	constructor(opt) {

		super(opt)

		this.slug = 'menu'

		this.onSlide = this.onSlide.bind(this)
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		this.positionStepList()
		this.positionMenuItemTitles()

		this.initSlider()

		done()
	}

	positionStepList() {

		let margin = 28
		const interval = 1.2

		this.ui.steps.forEach((step, i) => {
			step.style.marginLeft = `${margin}%`
			margin = margin * interval
		})
	}

	positionMenuItemTitles() {

		[...this.ui.title]
		.map(el => el.innerHTML)
		.map(text => text.split(' '))
		.map(arr => arr
			.map(word => `<span>${word}</span>`)
			.join('')
		).forEach((split, i) => {
			this.ui.title[i].innerHTML = split
		})
	}

	initSlider() {

		this.slides = [...this.ui.slides]

		this.slider = new Slider({
			length: this.slides.length - 1,
			direction: config.infos.isDevice ? 'x' : 'y',
			callback: this.onSlide
		})

		this.slider.init()
	}

	onSlide(e) {

		const index = e.current
		const previous = e.previous

		this.slider.animating = true

		const tl = new TimelineMax({ paused: true, onComplete: _ => {
			this.slider.animating = false
		}})

		tl.staggerTo(this.slides, 0.8, { cycle: {
			x: (loop) => index === loop ? 0 : loop < index ? -config.width : config.width,
			zIndex: (loop) => index === loop ? 2 : 1
		}, ease: Power4.easeInOut}, 0, 0)

		tl.restart()
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

	destroy(req, done) {

		super.destroy()

		this.slider.destroy()

		this.page.parentNode.removeChild(this.page)

		done()
	}
}

module.exports = Menu
