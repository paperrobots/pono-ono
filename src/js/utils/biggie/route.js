import framework from 'framework'
import classes from 'dom-classes'

export default (e) => {

  e.preventDefault()

  const target = e.currentTarget
  const href = target.getAttribute('href')
  const route = `/${href.split('/')[3]}`

  if(classes.has(target, 'no-route') || (target.hasAttribute('target') && target.getAttribute('target') == '_blank')) return

  framework.go(route)
}
