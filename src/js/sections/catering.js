import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import select from 'dom-select'
import { on, off } from 'dom-event'
import Default from './default'

class Catering extends Default {

	constructor(opt) {

		super(opt)

		this.slug = 'catering'
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		this.ui.modal = select('.js-modal')
		this.ui.container = select('.js-container')

		this.addEvents()

		done()
	}

	toggleModal() {

		classes.toggle(config.body, 'modal-is-hidden')
	}

	blockClicks(e) {

		e.stopPropagation()
	}

	addEvents() {

		on(this.ui.toggle, 'click', this.toggleModal)
		on(this.ui.modal, 'click', this.toggleModal)
		on(this.ui.container, 'click', this.blockClicks)
	}

	removeEvents() {

		off(this.ui.toggle, 'click', this.toggleModal)
		off(this.ui.modal, 'click', this.toggleModal)
		off(this.ui.container, 'click', this.blockClicks)
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
			clearProps: 'all',
			onComplete: done
		})
	}

	destroy(req, done) {

		super.destroy()

		this.removeEvents()

		this.page.parentNode.removeChild(this.page)
		this.ui.modal.parentNode.removeChild(this.ui.modal)

		done()
	}
}

module.exports = Catering
