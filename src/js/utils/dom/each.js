export default (nodelist, callback) => {
  let i = -1
  const l = nodelist.length
  const opts = {
    el: nodelist.item(i),
    index: i
  }

  while (++i < l) { callback(opts) }
}
