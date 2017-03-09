import config from 'config'
import cache from 'cache'
import ajax from 'please-ajax'
import create from 'dom-create-element'
import slug from './slug'

export default (req, view, options, done) => {

  const id = slug(req, options)
  const cn = id.replace('/', '-')
  const page = create({ selector: 'div', id: `page-${cn}`, styles: `page page-${cn}` })

  view.appendChild(page)

  if(!cache[id] || !options.cache) {

    ajax.get(`${config.BASE}${id}`, {
      success: (object) => {
        const html = object.data.split(/(<main>|<\/main>)/ig)[2]
        page.innerHTML = html
        if(options.cache) cache[id] = html
        done()
      }
    })

  } else {

    setTimeout(() => {
      page.innerHTML = cache[id]
      done()
    }, 1)
  }

  return page
}
