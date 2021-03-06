import config from 'config'
import utils from 'utils'
import { ajax } from 'jquery'
import classes from 'dom-classes'
import select from 'dom-select'
import { on, off } from 'dom-event'
import query from 'query-dom-components'
import Default from './default'
import Validation from '../lib/validation'

class Catering extends Default {
  constructor (opt) {
    super(opt)

    this.slug = 'catering'

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  init (req, done) {
    super.init(req, done)
  }

  ready (done) {
    super.ready()

    this.modal = select('.modal--catering') || select('.modal--pono-ono-catering')

    utils.biggie.bind.add(select.all('a', this.modal))

    this.form = query({ el: this.modal })

    this.inputs = [...select.all('select, input:not([type="submit"])')]
    this.inputs.forEach(i => {
      if (i.hasAttribute('required')) {
        i.validation = new Validation()
      }
    })

    this.addEvents()

    done()
  }

  addEvents () {
    on(this.ui.toggle, 'click', this.toggleModal)
    on(this.modal, 'click', this.toggleModal)
    on(this.form.outer, 'click', this.blockClicks)
    on(this.form.el, 'submit', this.onSubmit)

    this.inputs.forEach(i => on(i, 'input', this.onChange))
    this.inputs.forEach(i => on(i, 'focusout', this.onChange))
  }

  removeEvents () {
    off(this.ui.toggle, 'click', this.toggleModal)
    off(this.modal, 'click', this.toggleModal)
    off(this.form.outer, 'click', this.blockClicks)
    off(this.form.el, 'submit', this.onSubmit)

    this.inputs.forEach(i => off(i, 'input', this.onChange))
    this.inputs.forEach(i => off(i, 'focusout', this.onChange))
  }

  toggleModal () {
    classes.toggle(config.body, 'modal-is-hidden')
  }

  blockClicks (e) {
    e.stopPropagation()
  }

  onChange (e) {
    const target = e.target

    if (target.validation) {
      target.validation.checkValidity(target)
    }

    if (target.value.length > 0) {
      classes.add(target.parentNode, 'is-focused')
    } else {
      classes.remove(target.parentNode, 'is-focused')
    }
  }

  onSubmit (e) {
    e.preventDefault()

    const { fullName, eventDate, pickupTime, guestCount, email, dietaryRestrictions, specialRequests } = this.form

    const formData = {
      'fullName': fullName.value,
      'eventDate': eventDate.value,
      'pickupTime': pickupTime.value,
      'guestCount': guestCount.value,
      'email': email.value,
      'dietaryRestrictions': dietaryRestrictions.value,
      'specialRequests': specialRequests.value
    }

    this.postFormData(formData, 'process_catering_request')
  }

  postFormData (formData, action) {
    ajax({
      type: 'POST',
      dataType: 'json',
      url: APP.AJAX_URL,
      data: {
        action: action,
        data: formData,
        submission: select('#xyq').value,
        security: APP.CATERING_REQUEST
      },
      success: response => {
        if (response.success === true) {
          this.displayConfirmation()
        }
      }
    })
  }

  displayConfirmation () {
    classes.add(this.modal, 'is-confirmation')
  }

  animateIn (req, done) {
    classes.add(config.body, `is-${this.slug}`)

    const tl = new TimelineMax({ paused: true, onComplete: done })

    tl.to(this.page, 1, { autoAlpha: 1, ease: Expo.easeInOut })
    tl.restart()
  }

  animateOut (req, done) {
    classes.remove(config.body, `is-${this.slug}`)

    if (!config.infos.isDevice && !config.infos.isFirefox) window.sprite.animate()

    const tl = new TimelineMax({ paused: true, onComplete: done })

    if (!classes.has(config.body, 'modal-is-hidden')) {
      tl.to(this.modal, 0.7, { autoAlpha: 0, ease: Expo.easeInOut, onComplete: this.toggleModal })
    }

    tl.to(this.page, 0.7, { autoAlpha: 0, ease: Expo.easeInOut, clearProps: 'all' })

    tl.restart()
  }

  destroy (req, done) {
    super.destroy()

    this.removeEvents()

    this.page.parentNode.removeChild(this.page)
    this.modal.parentNode.removeChild(this.modal)

    done()
  }
}

module.exports = Catering
