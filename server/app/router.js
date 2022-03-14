'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller
  } = app;
  // auth
  router.get('/web/v1/auth/authcode', controller.auth.authcode);
  router.post('/web/v1/auth/login', controller.auth.login);
  router.post('/web/v1/auth/pwdvalid', controller.auth.pwdvalid);
  router.put('/web/v1/auth/changepwd', controller.auth.changepwd);
  router.get('/web/v1/auth/logout', controller.auth.logout);
  // users
  router.get('/web/v1/user/whoami', controller.users.whoami);
  // test
  router.get('/web/v1/hotelbase', controller.tests.items);
  router.get('/web/v1/domestic', controller.tests.items);
  router.get('/web/v1/overseas', controller.tests.items);
  router.get('/web/v1/fleatrade', controller.tests.items);
  router.get('/web/v1/vehiclerepair', controller.tests.items);
  router.get('/web/v1/table', controller.tests.items);
};