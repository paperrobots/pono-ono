import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import { on, off } from 'dom-event'
import Default from './default'
import Slider from '../lib/slider'
import SplitText from '../lib/split'

class Menu extends Default {

	constructor(opt) {

		super(opt)

		this.slug = 'menu'

		this.bindEvents()
	}

	bindEvents() {

		['onSlide', 'goToNextSlide', 'goToPreviousSlide']
		.forEach(fn => this[fn] = this[fn].bind(this))
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		this.positionStepList()
		this.setupMenuItemTitles()

		this.addEvents()

		done()
	}

	addEvents() {

		this.initSlider()

		on(this.ui.next, 'click', this.goToNextSlide)
		on(this.ui.prev, 'click', this.goToPreviousSlide)
	}

	removeEvents() {

		this.slider.destroy()

		off(this.ui.next, 'click', this.goToNextSlide)
		off(this.ui.prev, 'click', this.goToPreviousSlide)
	}

	positionStepList() {

		let margin = 28
		const interval = 1.2

		this.ui.steps.forEach((step, i) => {
			step.style.marginLeft = `${margin}%`
			margin = margin * interval
		})
	}

	setupMenuItemTitles() {

		this.titles = []

		this.ui.title.forEach((title, i) => {
			this.titles[i] = new SplitText(title, { type: 'words', wordsClass: 'word' }).words
			this.titles[i].map(word => word.innerHTML = `<span class="word--inner">${word.textContent}</span>`)
		})
	}

	initSlider() {

		this.current = 0
		this.previous = null
		this.slides = [...this.ui.slides]

		this.slider = new Slider({
			length: this.slides.length - 1,
			direction: config.infos.isDevice ? 'x' : 'y',
			callback: this.onSlide
		})

		this.slider.init()
	}

	onSlide(e) {

		const direction = e.direction
		const index = this.current = e.current
		const previous = this.previous = e.previous

		const words = {
			current: [...this.slides[index].querySelectorAll('.word--inner')],
			previous: [...this.slides[previous].querySelectorAll('.word--inner')]
		}

		index === this.slides.length - 1 ? classes.add(this.ui.next, 'is-disabled') : classes.remove(this.ui.next, 'is-disabled')
		index === 0 ? classes.add(this.ui.prev, 'is-disabled') : classes.remove(this.ui.prev, 'is-disabled')

		this.slider.animating = true

		const tl = new TimelineMax({ paused: true, onComplete: () => {
			this.slider.animating = false
		}})

		tl.staggerTo(this.slides, 0.8, { cycle: {
			x: (loop) => index === loop ? 0 : loop < index ? -config.width : config.width,
			zIndex: (loop) => index === loop ? 2 : 1
		}, ease: Expo.easeInOut}, 0, 0, 'slide')
		tl.staggerTo(words.current, 0.6, { y: 0, ease: Expo.easeInOut }, 0.1, 0.25, 'slide')
		tl.staggerTo(words.previous, 0.6, { y: '120%', ease: Expo.easeOut, clearProps: 'all' }, -0.1, 0, 'slide')

		tl.restart()
	}

	goToNextSlide() {

		classes.remove(this.ui.next, 'is-disabled')
		classes.remove(this.ui.prev, 'is-disabled')

		this.slider.goTo(this.current + 1)
	}

	goToPreviousSlide() {

		classes.remove(this.ui.next, 'is-disabled')
		classes.remove(this.ui.prev, 'is-disabled')

		this.slider.goTo(this.current - 1)
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

		this.removeEvents()

		this.page.parentNode.removeChild(this.page)

		done()
	}
}

module.exports = Menu
