import select from 'dom-select'

const config = {

	BASE: '/',

	body: document.body,
	view: select('main'),
	nav: select.all('nav a'),

	width: window.innerWidth,
	height: window.innerHeight
}

export default config
