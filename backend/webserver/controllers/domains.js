'use strict';

const _ = require('lodash');
const q = require('q');

const userDomain = require('../../core/user/domain');
const userIndex = require('../../core/user/index');
const coreDomain = require('../../core/domain');
const logger = require('../../core').logger;
const denormalizeUser = require('../denormalize/user').denormalize;
const denormalizeDomain = require('../denormalize/domain');
const { filterDomainsByMembersCanBeSearched } = require('../../core/domain/helpers');

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 50;

module.exports = {
  list,
  create,
  update,
  getMembers,
  getMembersHeaders,
  getDomain,
  createMember,
  getDomainAdministrators,
  addDomainAdministrator,
  removeDomainAdministrator
};

/**
 * List domains
 *
 * @param {Request} req
 * @param {Response} res
 */
function list(req, res) {
  const options = {
    hostname: req.query.hostname,
    name: req.query.name,
    limit: +req.query.limit || DEFAULT_LIMIT,
    offset: +req.query.offset || DEFAULT_OFFSET
  };

  coreDomain.list(options, (err, domains) => {
    if (err) {
      const details = 'Error while listing domains';

      logger.error(details, err);

      return res.status(500).json({
        error: {
          code: 500,
          message: 'Server Error',
          details
        }
      });
    }

    res.header('X-ESN-Items-Count', domains.length);
    res.status(200).json(domains.map(domain => denormalizeDomain(domain)));
  });
}

/**
 * Create a new domain and a new user who become domain administrator
 *
 * @param {Request} req
 * @param {Response} res
 */
function create(req, res) {
  const data = req.body;
  const company_name = data.company_name;
  const hostnames = [...new Set(data.hostnames || [])];
  const name = data.name;
  const administrator = data.administrator;

  const domain = {
    name,
    company_name,
    hostnames
  };

  return _createWithAdministrator(domain, administrator)
    .then(domain => res.status(201).json(denormalizeDomain(domain)))
    .catch(err => {
      const details = `Error while creating domain ${name}`;

      logger.error(details, err);

      return res.status(500).json({
        error: {
          code: 500,
          message: 'Server Error',
          details
        }
      });
    });
}

/**
 * Create domain with administrator
 * @param  {object} domain        the basic information of the domain contains name and company_name
 * @param  {object} administrator the object contains emails and password which will be used for the new domain administrator
 * @return {Promise} resolve a created domain
 */
function _createWithAdministrator(domain, administrator) {
  const user = {
    accounts: [{
      hosted: true,
      type: 'email',
      emails: [administrator.email]
    }],
    password: administrator.password
  };

  return q.ninvoke(coreDomain, 'create', domain)
    .then(domain => {
      user.domains = [{ domain_id: domain._id }];

      return q.ninvoke(userIndex, 'recordUser', user)
        .then(administrator => {
          const administrators = [{ user_id: administrator._id }];

          // update domain with administrator
          return q.ninvoke(coreDomain, 'updateById', domain._id, { administrators });
        })
        .catch(
          err => q.ninvoke(coreDomain, 'removeById', domain._id) // Remove domain if failed to create domain administrator
            .then(() => q.reject(err))                           // then return error from create domain administrator progression
        );
    });
}

/**
 * Update a domain.
 *
 * @param {Request} req  Request params must contain id of domain which expected to be update as uuid property.
 *                       Request body must contain new company name or new hostnames of domain which expected to be updated.
 * @param {Response} res
 */
function update(req, res) {
  const domain = {
    id: req.params.uuid,
    company_name: req.body.company_name || req.domain.company_name,
    hostnames: [...new Set(req.body.hostnames || req.domain.hostnames)]
  };

  return q.ninvoke(coreDomain, 'update', domain)
    .then(updated => {
      if (updated) {
        return res.status(204).end();
      }

      return res.status(404).json({
        error: {
          code: 404,
          message: 'Not Found',
          details: 'Domain not found'
        }
      });
    })
    .catch(err => {
      const details = 'Error while updating domain';

      logger.error(details, err);

      return res.status(500).json({
        error: {
          code: 500,
          message: 'Server Error',
          details
        }
      });
    });
}

/**
 * Get members of a domain
 *
 * @param {Request} req
 * @param {Response} res
 */
function getMembers(req, res) {
  const domain = req.domain;
  const query = {
    limit: +req.query.limit || DEFAULT_LIMIT,
    offset: +req.query.offset || DEFAULT_OFFSET,
    includesDisabledSearchable: req.query.includesDisabledSearchable === 'true',
    search: req.query.search || null
  };
  const getUsers = query.search ? userDomain.getUsersSearch : userDomain.getUsersList;
  const errorMessage = query.search ? 'Error while searching domain members' : 'Error while getting domain members';

  getDomains(req.query, domain)
    .then(domains => {
      if (!domains.length) {
        res.header('X-ESN-Items-Count', 0);

        return res.status(200).json([]);
      }

      return q.denodeify(getUsers)(domains, query)
        .then(result =>
          Promise.all(result.list.map(user => denormalizeUser(user)))
            .then(denormalized => {
              res.header('X-ESN-Items-Count', result.total_count);
              res.status(200).json(denormalized);
            })
        );
    })
    .catch(err => {
      logger.error(errorMessage, err);

      res.status(500).json({
        error: {
          status: 500,
          message: 'Server Error',
          details: errorMessage
        }
      });
    });

    function getDomains(query, domain) {
      return (query.ignoreMembersCanBeSearchedConfiguration === 'true' ? Promise.resolve([domain]) : filterDomainsByMembersCanBeSearched([domain]));
    }
}

function getMembersHeaders(req, res) {
  userDomain.countDomainsMembers([req.domain])
    .then(count => {
      res.header('X-ESN-Items-Count', count || 0);
      res.status(200).send();
    })
    .catch(err => {
      const errorMessage = 'Error while counting domain members';

      logger.error(errorMessage, err);

      res.status(500).json({
        error: {
          status: 500,
          message: 'Server Error',
          details: errorMessage
        }
      });
    });
}

/**
 * Send invitations to a list of emails.
 *
 * @param {Request} req - The request with user and domain as attribute. The body MUST contains an array of emails.
 * @param {Response} res
 */

function getDomain(req, res) {
  if (req.domain) {
    return res.status(200).json(req.domain);
  }

  return res.status(404).json({error: 404, message: 'Not found', details: 'Domain not found'});
}

function createMember(req, res) {
  if (!req.body || _.isEmpty(req.body)) {
    return res.status(400).json({ error: { code: 400, message: 'Bad request', details: 'Missing input member' } });
  }

  userIndex.recordUser(req.body, (err, user) => {
    if (err) {
      if (/^Emails already in use/.test(err.message)) {
        return res.status(409).json({ error: { code: 409, message: 'Conflict', details: err.message } });
      }

      logger.error('Error while creating member', err);

      return res.status(500).json({ error: { code: 500, message: 'Server Error', details: 'Error while creating member' } });
    }

    return res.status(201).json(user);
  });
}

function getDomainAdministrators(req, res) {
  userDomain.getAdministrators(req.domain, (err, administrators) => {
    if (err || !administrators) {
      logger.error('Can not get domain administrators : %s', err);

      return res.status(500).json({ error: { code: 500, message: 'Server Error', details: 'Can not get domain administrators. ' + err.message } });
    }

    q.all(administrators.map(administrator =>
        denormalizeUser(administrator).then(denormalized => {
          denormalized.role = administrator.role;

          return denormalized;
        })
      ))
      .then(denormalizeds => res.status(200).json(denormalizeds));
  });
}

function addDomainAdministrator(req, res) {
  const domain = req.domain;
  const userIds = req.body;

  if (!Array.isArray(userIds)) {
    return res.status(400).json({
      error: { code: 400, message: 'Bad request', details: 'body should be an array of user\'s ID'}
    });
  }

  userDomain.addDomainAdministrator(domain, userIds, err => {
    if (err) {
      logger.error('Error while adding domain administrators:', err);

      return res.status(500).json({
        error: { code: 500, message: 'Server Error', details: 'Error while adding domain administrators' }
      });
    }

    res.status(204).end();
  });
}

function removeDomainAdministrator(req, res) {
  const domain = req.domain;
  const administratorId = req.params.administratorId;

  if (req.user._id.equals(administratorId)) {
    return res.status(403).json({
      error: { code: 403, message: 'Forbidden', details: 'You cannot remove yourself' }
    });
  }

  userDomain.removeDomainAdministrator(domain, administratorId, err => {
    if (err) {
      logger.error('Error while removing domain administrator:', err);

      return res.status(500).json({
        error: { code: 500, message: 'Server Error', details: 'Error while removing domain administrator' }
      });
    }

    res.status(204).end();
  });
}
