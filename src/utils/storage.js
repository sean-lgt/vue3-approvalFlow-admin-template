/**
 * storage 二次封装
 * @author sean-lgt
 */

import projectConfig from '@/config'

class Storage {
  setItem(key, val) {
    const storage = this.getStorage()
    storage[key] = val
    window.localStorage.setItem(
      projectConfig.namespace,
      JSON.stringify(storage)
    )
  }
  getItem(key) {
    return this.getStorage()[key] || null
  }
  getStorage() {
    const storage = JSON.parse(
      window.localStorage.getItem(projectConfig.namespace) || '{}'
    )
    return storage
  }
  clearItem(key) {
    let storage = this.getStorage()
    delete storage[key]
    window.localStorage.setItem(
      projectConfig.namespace,
      JSON.stringify(storage)
    )
  }
  clearAll() {
    window.localStorage.clear()
  }
}

export default Storage
