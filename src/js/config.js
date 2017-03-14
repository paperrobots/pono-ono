import env from 'env'
import select from 'dom-select'

const config = {

	BASE: env,
	HOST: window.location.host,

	body: document.body,
	view: select('main'),
	a: select.all('a'),

	width: window.innerWidth,
	height: window.innerHeight,

	menuBarIsHorizontal: window.innerWidth < 769
}

export default config
