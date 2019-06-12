/**
 * 判断是否为空
 */
export function isValidatenull (val) {
  if (typeof val === 'boolean') {
    return false
  }
  if (typeof val === 'number') {
    return false
  }
  if (val instanceof Array) {
    if (val.length == 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true
    return false
  }
  return false
}

let isClient = process.client;

/**
 * 存储localStorage
 *
 *params = {
 *name,存储名称
 *content,存储内容
  type，存储类型：默认localStorage，值为session或true表示sessionStorage
 *}
 * 
 */
export const setStorage = (params) => {
  //debugger;
  let {
    name,
    content,
    type
  } = params
  let obj = {
    dataType: typeof (content),
    content: content,
    type: type,
    datetime: new Date().getTime()
  }
  if(!isClient)return//new add 4.23
  if (type) window.sessionStorage.setItem(name, JSON.stringify(obj))
  else window.localStorage.setItem(name, JSON.stringify(obj))
}
/**
 * 获取localStorage
 */

export const getStorage = (params) => {
  
  let {
    name,
    debug
  } = params
  let obj = {}

  let content
  if(isClient){//new add 4.23
    obj = window.sessionStorage.getItem(name)
    if (isValidatenull(obj)) obj = window.localStorage.getItem(name)
  }
  
  if (isValidatenull(obj)) return
  obj = JSON.parse(obj)
  if (debug) {
    return obj
  }
  if (obj.dataType == 'string') {
    content = obj.content
  } else if (obj.dataType == 'number') {
    content = Number(obj.content)
  } else if (obj.dataType == 'boolean') {
    content = eval(obj.content)
  } else if (obj.dataType == 'object') {
    content = obj.content
  }
  console.log("---------,------------getStorage---content-",content);
  return content
}
/**
 * 删除localStorage
 */
export const removeStorage = params => {
  let {
    name
  } = params
  if(!isClient)return//new add 4.23
  window.localStorage.removeItem(name)
  window.sessionStorage.removeItem(name)
}

/**
 * 获取全部localStorage
 */
export const getAllStorage = (params) => {
  let list = []
  let {
    type
  } = params
  if(isClient){//new add 4.23
  
    for (let i = 1; i <= window.sessionStorage.length; i++) {
      if (type) {
        list.push({
          name: window.sessionStorage.key(i),
          content: getStorage({
            name: window.sessionStorage.key(i),
            type: 'session'
          })
        })
      } else {
        list.push(getStorage({
          name: window.localStorage.key(i),
          content: getStorage({
            name: window.localStorage.key(i)
          })
        }))
      }
    }

  }//new add 4.23

  return list
}

/**
 * 清空全部localStorage
 */
export const clearStorage = (params) => {
  let {
    type
  } = params

  if(isClient){//new add 4.23

    if (type) {
      window.sessionStorage.clear()
      return
    }
    window.localStorage.clear() 
  }//new add 4.23
  
}
