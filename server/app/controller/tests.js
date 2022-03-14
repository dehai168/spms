'use strict';

const Controller = require('egg').Controller;

class ModulController extends Controller {
    async items() {
        const ctx = this.ctx;
        ctx.body = {
            total: 0,
            items: []
        }
    }
}

module.exports = ModulController;