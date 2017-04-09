import classes from 'dom-classes'

export default class Validation {
  constructor () {
    this.invalidities = []
  }

  addInvalidity (message) {
    this.invalidities.push(message)
  }

  getInvalidity () {
    return this.invalidities.join()
  }

  checkValidity (input) {
    const el = input.parentNode
    const msg = el.querySelector('.js-msg')
    const type = input.getAttribute('type')

    if (input.value.trim().length === 0) {
      this.invalidities = []

      this.addInvalidity('This field is required.')

      classes.add(el, 'is-invalid')

      msg.innerHTML = this.getInvalidity()
    } else if (type === 'date' && this.isPast(input.value)) {
      this.invalidities = []

      this.addInvalidity('Please select a future date.')

      classes.add(el, 'is-invalid')

      msg.innerHTML = this.getInvalidity()
    } else if (type === 'email' && !this.isEmail(input.value)) {
      this.invalidities = []

      this.addInvalidity('Please enter a real email address.')

      classes.add(el, 'is-invalid')

      msg.innerHTML = this.getInvalidity()
    } else {
      this.invalidities = []

      classes.remove(el, 'is-invalid')

      msg.innerHTML = ''
    }
  }

  isPast (date) {
    const inputDate = new Date(date)
    const currentDate = new Date()

    return inputDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)
  }

  isEmail (value) {
    /* eslint-disable no-useless-escape */
    const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    /* eslint-enable no-useless-escape */
    return pattern.test(value)
  }
}
