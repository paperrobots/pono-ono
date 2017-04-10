import config from 'config'
import cache from 'cache'
import ajax from 'please-ajax'
import create from 'dom-create-element'
import slug from './slug'

export default (req, view, options, done) => {
  const id = slug(req, options)
  const cn = id.replace('/', '-')
  const page = req.previous === undefined ? view.querySelector('.page') : create({ selector: 'div', id: `page-${cn}`, styles: `page page-${cn}` })

  let modal

  if (id === 'catering' || id === 'contact' || id === 'pono-ono/catering' || id === 'pono-ono/contact') {
    modal = req.previous === undefined ? config.modal.querySelector(`.modal--${cn}`) : create({ selector: 'div', styles: `modal modal--${cn} js-modal` })
    console.log(req.previous, id, modal)
    config.modal.appendChild(modal)
  }

  view.appendChild(page)

  if (!cache[id] || !options.cache) {
    ajax.get(`${config.BASE}${id}`, {
      success: (object) => {
        const inner = object.data.split(/(<main>|<\/main>)/ig)[2]
        const form = object.data.split(/(<aside>|<\/aside>)/ig)[2].trim()

        page.innerHTML = inner

        if (form.length > 0) modal.innerHTML = form

        if (options.cache) cache[id] = { inner, form }

        done()
      }
    })
  } else {
    window.requestAnimationFrame(_ => {
      page.innerHTML = cache[id]['inner']

      if (cache[id]['form'].length > 0) modal.innerHTML = cache[id]['form']

      done()
    })
  }

  return page
}
