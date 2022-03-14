'use strict';
module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
      if (ctx.status !== 302) {
        if (ctx.status === 404) {
          ctx.body = {
            code: 40004,
            data: false,
          };
        } else if (ctx.status === 204) {
          ctx.body = {
            code: 20000,
            data: null,
          };
        } else if (ctx.type !== 'application/octet-stream') {
          ctx.body = {
            code: 20000,
            data: ctx.body ? ctx.body : false,
          };
        }
        ctx.status = 200;
      }
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);

      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const errorMsg = status === 500 && ctx.app.config.env === 'prod' ? 'Internal Server Error' : err.message;

      ctx.status = 200;
      switch (status) {
        case 401:
        case 422:
          ctx.body = {
            code: 20000,
            data: false,
          };
          break;
        default:
          ctx.body = {
            code: 50000,
            data: errorMsg,
          };
          break;
      }
    }
  };
};