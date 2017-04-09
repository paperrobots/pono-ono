import Smooth from 'smooth-scrolling'
import classes from 'dom-classes'

class Custom extends Smooth {
  constructor (opt) {
    super(opt)

    this.createExtraBound()

    this.resizing = false
    this.cache = null
    this.dom.blocks = Array.prototype.slice.call(opt.blocks, 0)
    this.dom.leaves = Array.prototype.slice.call(opt.leaves, 0)
    this.dom.front = Array.prototype.slice.call(opt.front, 0)
  }

  createExtraBound () {
    ['getCache', 'inViewport']
    .forEach((fn) => { this[fn] = this[fn].bind(this) })
  }

  resize () {
    this.resizing = true

    this.getCache()
    super.resize()

    this.resizing = false
  }

  getCache () {
    this.cache = []

    const unit = this.vars.width + 125

    this.dom.blocks.forEach((el, index) => {
      el.style.display = 'inline-block'
      el.style.transform = 'none'
      el.style['z-index'] = '2'

      const scrollX = this.vars.target
      const bounding = el.getBoundingClientRect()
      const bounds = {
        el: el,
        state: false,
        left: bounding.left + scrollX,
        right: bounding.right + scrollX,
        center: unit / 2,
        width: bounding.width,
        speed: el.getAttribute('data-speed') || '-1'
      }

      this.cache.push(bounds)
    })

    this.dom.leaves.forEach((el, index) => {
      el.style.transform = 'none'

      const scrollX = this.vars.target
      const bounding = el.getBoundingClientRect()
      const bounds = {
        el: el,
        state: false,
        left: bounding.left + scrollX,
        right: bounding.right + scrollX,
        center: bounding.width / 2,
        width: bounding.width,
        speed: el.getAttribute('data-speed') || '0.1'
      }

      this.cache.push(bounds)
    })

    this.dom.front.forEach((el, index) => {
      el.style.transform = 'none'

      const scrollX = this.vars.target
      const bounding = el.getBoundingClientRect()
      const bounds = {
        el: el,
        state: false,
        left: bounding.left + scrollX,
        right: bounding.right + scrollX,
        center: bounding.width / 2,
        width: bounding.width,
        speed: el.getAttribute('data-speed') || '-0.015'
      }

      this.cache.push(bounds)
    })

    this.dom.section.style.width = `${this.vars.width}px`
    this.vars.bounding = (unit * this.dom.blocks.length) - this.vars.width
  }

  run () {
    [...this.dom.blocks, ...this.dom.leaves, ...this.dom.front].forEach(this.inViewport)

    this.dom.section.style[this.prefix] = `translate3d(${this.vars.current * -1}px, 0, 0)`

    super.run()
  }

  inViewport (el, index) {
    if (!this.cache || this.resizing) return

    const cache = this.cache[index]
    const current = this.vars.current
    const transform = current * cache.speed
    const left = Math.round((cache.left + transform) - current)
    const right = Math.round((cache.right + transform) - current)
    const inview = right > 0 && left < this.vars.width + cache.width

    if (inview && (classes.has(el, 'js-leaves') || classes.has(el, 'js-front'))) {
      el.style[this.prefix] = `translate3d(${transform}px, 0, 0)`
    }
  }
}

export default Custom
