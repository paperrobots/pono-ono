import framework from 'framework'
import config from 'config'
import classes from 'dom-classes'

export default (e) => {

  e.preventDefault()

  const target = e.currentTarget

  if (classes.has(target, 'no-route') || (target.hasAttribute('target') && target.getAttribute('target') == '_blank')) return

  framework.go(target.getAttribute('href'))
}
