'use strict';

const Controller = require('egg').Controller;

class ModulController extends Controller {
  async whoami() {
    const ctx = this.ctx;
    ctx.body = {
      userid: 1,
      username: 'admin',
      role: 1,
      sex: '男',
      age: 20,
      state: 1,
      remark: ''
    }
  }
}

module.exports = ModulController;