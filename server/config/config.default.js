/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1636771349191_5555';
  config.middleware = ['errorHandler'];
  config.security = {
    csrf: {
      enable: true,
      queryName: '_csrf',
      bodyName: '_csrf',
      headerName: 'x-csrf-token',
      ignore: '/api/',
    },
  };
  // server listen
  config.cluster = {
    listen: {
      port: 7001,
      hostname: '0.0.0.0',
      // path: '/var/run/egg.sock',
    },
  };
  // cors
  config.cors = {
    origin: '*',
    allowMethods: 'GET,PUT,POST,DELETE',
  };
  config.static = {
    prefix: "/",
    maxAge: 3600000,
  };
  // post size
  config.bodyParser = {
    jsonLimit: '2mb',
  };
  config.multipart = {
    fileSize: '5mb',
    whitelist: [
      // images
      '.jpg',
      '.jpeg', // image/jpeg
      '.png', // image/png, image/x-png
      // xlsy
      '.xls',
      '.xlsx',
    ],
  };
  // add your user config here
  const userConfig = {
    tokenName: 'spms_token',
  };
  return {
    ...config,
    ...userConfig,
  };
};