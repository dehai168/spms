const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    keyid: '@id',
    agency: '@sentence(10, 20)',
    'businessStatus|1': ['1', '2', '3', '4'],
    createuser: 'name',
    createdat: '@datetime',
    updateuser: 'name',
    updatedat: '@datetime',
  }]
})

module.exports = [{
  url: '/fleatrade/exist',
  type: 'get',
  response: config => {
    const items = data.items
    return {
      code: 20000,
      data: false
    }
  }
}, {
  url: '/fleatrade',
  type: 'post',
  response: config => {
    const items = data.items
    return {
      code: 20000,
      data: true
    }
  }
}, {
  url: '/fleatrade/batchremove',
  type: 'delete',
  response: config => {
    return {
      code: 20000,
      data: true
    }
  }
}, {
  url: '/fleatrade/id/?',
  type: 'get',
  response: config => {
    const items = data.items
    return {
      code: 20000,
      data: items[0]
    }
  }
}, {
  url: '/fleatrade',
  type: 'get',
  response: config => {
    const items = data.items
    return {
      code: 20000,
      data: {
        total: items.length,
        items: items
      }
    }
  }
},]