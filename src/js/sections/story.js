import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import Default from './default'
import Custom from '../lib/smooth/custom'

class Story extends Default {

	constructor(opt) {

		super(opt)

		this.slug = 'story'
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		this.ui.blockTitle.forEach((el, i) => el.innerHTML = this.positionBlockTitle(i))

		this.smooth = new Custom({
			extends: true,
			section: this.ui.scrollContainer,
			divs: this.ui.block,
			ease: 0.075,
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

	positionBlockTitle(index) {
		return [this.ui.blockTitle[index]]
			.map(el => el.textContent)
			.map(str => str.split(' '))
			.map(words =>
				words.length > 1
					? `${words[0]}<div style="margin-left: 1ch">${words.slice(1).join(' ')}</div>`
					: words[0])
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

		this.smooth.destroy()

		this.page.parentNode.removeChild(this.page)

		done()
	}
}

module.exports = Story
