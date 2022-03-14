'use strict';

const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');

class AuthController extends Controller {
  async login() {
    const ctx = this.ctx;
    const {
      username,
      password,
      authcode,
      source
    } = ctx.request.body;
    const tokenStr = ctx.helper.setToken(username + password);
    ctx.body = {
      result: tokenStr,
      error: 0, // 正常
    };
  }
  async logout() {
    const {
      ctx
    } = this;
    ctx.body = true;
  }
  async changepwd() {
    const ctx = this.ctx;
    const {
      oldpwd,
      newpwd
    } = ctx.request.body;
    ctx.body = true;
  }
  async authcode() {
    const options = {
      width: 108,
      height: 30,
      fontSize: 50,
      color: true,
      noise: 2,
    };
    const Captcha = svgCaptcha.createMathExpr(options); // 生成验证码
    this.ctx.session.authcode = Captcha.text; // 把验证码保存到session
    this.ctx.session.maxAge = 1000 * 60 * 1; // 设置session过期时间
    const buffer = Buffer.from(Captcha.data);
    this.ctx.body = 'data:image/svg+xml;base64,' + buffer.toString('base64');
  }
  async pwdvalid() {
    const ctx = this.ctx;
    const {
      password
    } = ctx.request.body;
    ctx.body = true;
  }
}

module.exports = AuthController;