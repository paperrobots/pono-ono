import config from 'config'
import utils from 'utils'
import ajax from 'please-ajax'
import classes from 'dom-classes'
import select from 'dom-select'
import { on, off } from 'dom-event'
import query from 'query-dom-components'
import Default from './default'

class Catering extends Default {

	constructor(opt) {

		super(opt)

		this.slug = 'catering'

		this.onSubmit = this.onSubmit.bind(this)
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		this.modal = select('.js-modal')

		this.form = query({ el: this.modal })

		this.addEvents()

		done()
	}

	addEvents() {

		on(this.ui.toggle, 'click', this.toggleModal)
		on(this.modal, 'click', this.toggleModal)
		on(this.form.outer, 'click', this.blockClicks)
		on(this.form.el, 'submit', this.onSubmit)
	}

	removeEvents() {

		off(this.ui.toggle, 'click', this.toggleModal)
		off(this.modal, 'click', this.toggleModal)
		off(this.form.outer, 'click', this.blockClicks)
		off(this.form.el, 'submit', this.onSubmit)
	}

	toggleModal() {

		classes.toggle(config.body, 'modal-is-hidden')
	}

	blockClicks(e) {

		e.stopPropagation()
	}

	onSubmit(e) {

		e.preventDefault()

		const { fullName, eventDate, pickupTime, guestCount, email, dietaryRestrictions, specialRequests } = this.form

		const formData = {
			'fullName' : fullName.value,
			'eventDate' : eventDate.value,
			'pickupTime' : pickupTime.value,
			'guestCount' : guestCount.value,
			'email' : email.value,
			'dietaryRestrictions' : dietaryRestrictions.value,
			'specialRequests' : specialRequests.value
		}

		this.postFormData(formData, 'process_catering_request')
	}

	postFormData(formData, action) {

		ajax.post(APP.AJAX_URL, {
			action: action,
			data: formData,
			submission: select('#xyq').value,
			security: APP.SECURITY
		}, {
			success: response => {
				if ( response.success === true ) {
					alert('success')
				} else {
					alert('nahhhhhh bull u done fucked up')
				}
			}
		})
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
