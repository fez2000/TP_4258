'use strict';

const authorize = require('../middleware/authorization');
const domains = require('../controllers/domains');
const domainMiddleware = require('../middleware/domain');
const platformadminsMw = require('../middleware/platformadmins');
const helperMw = require('../middleware/helper');

module.exports = function(router) {

  /**
   * @swagger
   * /domains:
   *   get:
   *     tags:
   *      - Domain
   *     description: |
   *       List ESN domains.
   *     parameters:
   *       - $ref: "#/parameters/dm_hostname_filter"
   *       - $ref: "#/parameters/dm_name_filter"
   *       - $ref: "#/parameters/cm_limit"
   *       - $ref: "#/parameters/cm_offset"
   *     responses:
   *       200:
   *         $ref: "#/responses/dm_domains"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       409:
   *         $ref: "#/responses/cm_409"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.get('/domains', authorize.requiresAPILogin, platformadminsMw.requirePlatformAdmin, domains.list);

  /**
   * @swagger
   * /domains:
   *   post:
   *     tags:
   *      - Domain
   *     description: |
   *       Create an ESN domain.
   *     parameters:
   *       - $ref: "#/parameters/dm_domain_create"
   *     responses:
   *       201:
   *         $ref: "#/responses/dm_created_domain"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       404:
   *         $ref: "#/responses/cm_404"
   *       409:
   *         $ref: "#/responses/cm_409"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.post('/domains',
    authorize.requiresAPILogin,
    platformadminsMw.requirePlatformAdmin,
    domainMiddleware.requireDomainInfo,
    domainMiddleware.requireAdministrator,
    domains.create);

  /**
   * @swagger
   * /domains/{domain_id}:
   *   put:
   *     tags:
   *      - Domain
   *     description: |
   *       Update an ESN domain.
   *     parameters:
   *       - $ref: "#/parameters/dm_id"
   *       - $ref: "#/parameters/dm_company_name"
   *       - $ref: "#/parameters/dm_hostnames"
   *     responses:
   *       200:
   *         $ref: "#/responses/cm_200"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       404:
   *         $ref: "#/responses/cm_404"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.put('/domains/:uuid',
    authorize.requiresAPILogin,
    platformadminsMw.requirePlatformAdmin,
    helperMw.checkIdInParams('uuid', 'Domain'),
    domainMiddleware.load,
    domainMiddleware.checkUpdateParameters,
    domains.update);

  /**
   * @swagger
   * /domains/{domain_id}:
   *   get:
   *     tags:
   *      - Domain
   *     description: Get the domain information.
   *     parameters:
   *       - $ref: "#/parameters/dm_id"
   *     responses:
   *       200:
   *         $ref: "#/responses/dm_domain"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       404:
   *         $ref: "#/responses/cm_404"
   */
  router.get('/domains/:uuid', authorize.requiresAPILogin, domainMiddleware.load, authorize.requiresDomainMember, domains.getDomain);

  router.head('/domains/:uuid/members', authorize.requiresAPILogin, domainMiddleware.load, domainMiddleware.canGetMembers, domains.getMembersHeaders);

  /**
   * @swagger
   * /api/domains/{domain_id}/members:
   *   get:
   *     tags:
   *      - Domain
   *     description: Get the list of members for a domain.
   *     parameters:
   *       - $ref: "#/parameters/dm_id"
   *       - $ref: "#/parameters/cl_limit"
   *       - $ref: "#/parameters/cl_offset"
   *       - $ref: "#/parameters/cl_search"
   *       - $ref: "#/parameters/dm_search_includes_disabled_searchable"
   *     responses:
   *       200:
   *         $ref: "#/responses/dm_members"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       404:
   *         $ref: "#/responses/cm_404"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.get('/domains/:uuid/members', authorize.requiresAPILogin, domainMiddleware.load, domainMiddleware.canGetMembers, domains.getMembers);

  /**
   * @swagger
   * /api/domains/{domain_id}/members:
   *   post:
   *     tags:
   *      - Domain
   *     description: |
   *       Create a member for a specific domain.
   *       Only the domain manager has permission to create.
   *     parameters:
   *       - $ref: "#/parameters/dm_id"
   *       - $ref: "#/parameters/dm_member"
   *     responses:
   *       201:
   *         $ref: "#/responses/dm_member"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       404:
   *         $ref: "#/responses/cm_404"
   *       409:
   *         $ref: "#/responses/cm_409"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.post('/domains/:uuid/members', authorize.requiresAPILogin, domainMiddleware.load, authorize.requiresDomainManager, domainMiddleware.checkMemberAccounts, domains.createMember);

  /**
   * @swagger
   * /api/domains/{domain_id}/manager:
   *   get:
   *     tags:
   *      - Domain
   *     description: Check if the authenticated user is the domain manager.
   *     parameters:
   *       - $ref: "#/parameters/dm_id"
   *     responses:
   *       200:
   *         $ref: "#/responses/dm_domain"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       404:
   *         $ref: "#/responses/cm_404"
   */
  router.get('/domains/:uuid/manager', authorize.requiresAPILogin, domainMiddleware.load, authorize.requiresDomainManager, domains.getDomain);

  /**
   * @swagger
   * /api/domains/{domain_id}/administrators:
   *   get:
   *     tags:
   *      - Domain
   *     description: get list administrators of a domain.
   *     parameters:
   *       - $ref: "#/parameters/dm_id"
   *     responses:
   *       200:
   *         $ref: "#/responses/dm_members"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       404:
   *         $ref: "#/responses/cm_404"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.get('/domains/:uuid/administrators', authorize.requiresAPILogin, domainMiddleware.load, authorize.requiresDomainManager, domains.getDomainAdministrators);

  /**
   * @swagger
   * /api/domains/{domain_id}/administrators:
   *   post:
   *     tags:
   *      - Domain
   *     description: Add administrators to a domain
   *     parameters:
   *       - $ref: "#/parameters/dm_id"
   *       - $ref: "#/parameters/dm_user_ids"
   *     responses:
   *       204:
   *         $ref: "#/responses/cm_204"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       404:
   *         $ref: "#/responses/cm_404"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.post('/domains/:uuid/administrators', authorize.requiresAPILogin, domainMiddleware.load, authorize.requiresDomainManager, domains.addDomainAdministrator);

  /**
   * @swagger
   * /api/domains/{domain_id}/administrators/{administrator_id}:
   *   delete:
   *     tags:
   *      - Domain
   *     description: Remove an administrator from a domain
   *     parameters:
   *       - $ref: "#/parameters/dm_id"
   *       - $ref: "#/parameters/dm_administrator_id"
   *     responses:
   *       204:
   *         $ref: "#/responses/cm_204"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       404:
   *         $ref: "#/responses/cm_404"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.delete('/domains/:uuid/administrators/:administratorId', authorize.requiresAPILogin, domainMiddleware.load, authorize.requiresDomainManager, domains.removeDomainAdministrator);
};
