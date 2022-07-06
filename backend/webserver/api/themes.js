const controller = require('../controllers/themes');
const authorize = require('../middleware/authorization');
const domainMiddleware = require('../middleware/domain');
const themesMW = require('../middleware/themes');

module.exports = router => {
  /**
   * @swagger
   * /api/themes/{domain_id}:
   *   get:
   *     tags:
   *      - themes
   *     description: Get the theme for a given domain.
   *     parameters:
   *       - $ref: "#/parameters/dm_id"
   *     responses:
   *       200:
   *         $ref: "#/responses/tm_themes"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       404:
   *         $ref: "#/responses/cm_404"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.get(
    '/themes/:uuid',
    authorize.requiresAPILogin,
    domainMiddleware.load,
    controller.getTheme
  );

  /**
   * @swagger
   * /api/themes/{domain_id}:
   *   put:
   *     tags:
   *      - themes
   *     description: Set the theme for a given domain.
   *     parameters:
   *       - $ref: "#/parameters/dm_id"
   *       - $ref: "#/parameters/tm_themes"
   *     responses:
   *       200:
   *         $ref: "#/responses/cm_204"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       404:
   *         $ref: "#/responses/cm_404"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.put(
    '/themes/:uuid',
    authorize.requiresAPILogin,
    domainMiddleware.load,
    authorize.requiresDomainManager,
    themesMW.validateWriteBody,
    controller.saveTheme
  );

  /**
   * @swagger
   * /api/themes/{domain_id}/logo:
   *   get:
   *     tags:
   *      - themes
   *     description: Get the logo resource for a given domain.
   *     parameters:
   *       - $ref: "#/parameters/dm_id"
   *     responses:
   *       302:
   *         $ref: "#/responses/tm_logo"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       404:
   *         $ref: "#/responses/cm_404"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.get(
    '/themes/:uuid/logo',
    authorize.requiresAPILogin,
    domainMiddleware.load,
    controller.getLogo
  );

  /**
   * @swagger
   * /api/themes/:uuid/favicon:
   *   get:
   *     tags:
   *      - themes
   *     description: Get the favicon resource for a given domain.
   *     parameters:
   *       - $ref: "#/parameters/dm_id"
   *     responses:
   *       200:
   *         $ref: "#/responses/tm_favicon"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       404:
   *         $ref: "#/responses/cm_404"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.get(
    '/themes/:uuid/favicon',
    authorize.requiresAPILogin,
    domainMiddleware.load,
    controller.getFavicon
  );
};
