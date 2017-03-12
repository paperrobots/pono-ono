import select from 'dom-select'

const config = {

	BASE: '/',
	HOST: window.location.host,

	body: document.body,
	view: select('main'),
	a: select.all('a'),

	width: window.innerWidth,
	height: window.innerHeight
}

export default config
