import config from 'config'
import classes from 'dom-classes'
import Default from './default'
import Parallax from '../lib/parallax'

class Story extends Default {
  constructor (opt) {
    super(opt)

    this.slug = 'story'
  }

  init (req, done) {
    super.init(req, done)
  }

  ready (done) {
    super.ready()

    this.ui.title.forEach((el, i) => { el.innerHTML = super.positionTitle(i) })

    this.smooth = new Parallax({
      extends: true,
      section: this.ui.scrollContainer,
      blocks: this.ui.block,
      leaves: this.ui.leaves,
      front: this.ui.front,
      ease: 0.1,
      noscrollbar: true,
      vs: {
        mouseMultiplier: 0.25,
        touchMultiplier: 1.8,
        firefoxMultiplier: 30
      }
    })

    this.smooth.init()

    done()
  }

  resize (width, height) {
    if (this.smooth) {
      if (width < 769) {
        this.smooth.off()
        window.requestAnimationFrame(() => {
          this.smooth.on()
        })
      } else {
        this.smooth.off()
        window.requestAnimationFrame(() => {
          this.smooth.on()
        })
      }
    }
  }

  animateIn (req, done) {
    classes.add(config.body, `is-${this.slug}`)

    TweenLite.to(this.page, 1, {
      autoAlpha: 1,
      ease: Expo.easeInOut,
      onComplete: done
    })
  }

  animateOut (req, done) {
    classes.remove(config.body, `is-${this.slug}`)

    window.sprite.animate()

    TweenLite.to(this.page, 0.7, {
      autoAlpha: 0,
      ease: Expo.easeInOut,
      onComplete: done
    })
  }

  destroy (req, done) {
    super.destroy()

    this.smooth.destroy()

    this.page.parentNode.removeChild(this.page)

    done()
  }
}

module.exports = Story
