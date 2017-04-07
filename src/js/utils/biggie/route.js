import framework from 'framework'
import config from 'config'
import classes from 'dom-classes'

export default (e) => {

  const target = e.currentTarget

  if (classes.has(target, 'no-route') || (target.hasAttribute('target') && target.getAttribute('target') == '_blank')) {
    return
  } else {
    e.preventDefault()
  }

  framework.go(target.getAttribute('href'))
}
