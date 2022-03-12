const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    keyid: '@id',
    name: 'test',
    remark: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    createuser: 'name',
    createdat: '@datetime',
    updateuser: 'name',
    updatedat: '@datetime',
  }]
})

module.exports = [{
  url: '/table/exist',
  type: 'get',
  response: config => {
    const items = data.items
    return {
      code: 20000,
      data: false
    }
  }
}, {
  url: '/table',
  type: 'post',
  response: config => {
    const items = data.items
    return {
      code: 20000,
      data: true
    }
  }
}, {
  url: '/table/batchremove',
  type: 'delete',
  response: config => {
    return {
      code: 20000,
      data: true
    }
  }
}, {
  url: '/table/id/?',
  type: 'get',
  response: config => {
    const items = data.items
    return {
      code: 20000,
      data: items[0]
    }
  }
}, {
  url: '/table',
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
}, ]