process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
require('../models/index');

const Voter = mongoose.model('Voter');
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();
chai.use(chaiHttp);

describe('voters', () => {
    beforeEach((done) => { // Before each test we empty the database
        Voter.deleteMany({}, (err) => {
            done();
        });
    });
    /*
  * Test the /GET route
  */
    describe('/GET voters', () => {
        it('it should GET all the voters', (done) => {
            chai.request(server)
                .get('/api/voter')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST voter', () => {
        it('it should not POST a voter without password, name or email fields', (done) => {
            chai.request(server)
                .post('/api/voter')
                .send({})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(false);
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('name').eql('required');
                    res.body.errors.should.have.property('email').eql('required');
                    res.body.errors.should.have.property('password').eql('required');
                    done();
                });
        });
        it('it should not POST a voter when password or name fields is too short and email is not valid', (done) => {
            const { post_voter_fake } = require('./config.json');
            chai.request(server)
                .post('/api/voter')
                .send(post_voter_fake)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(false);
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('name').eql('short');
                    res.body.errors.should.have.property('email').eql('invalid');
                    res.body.errors.should.have.property('password').eql('short');
                    done();
                });
        });
        it('it should POST a voter ', (done) => {
            const { post_voter } = require('./config.json');
            chai.request(server)
                .post('/api/voter')
                .send(post_voter)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(true);
                    res.body.voter.should.have.property('_id');
                    res.body.voter.should.have.property('email');
                    res.body.voter.should.have.property('name');
                    done();
                });
        });
    });
    describe('/GET/:id voter', () => {
        it('it should GET a voter by the given id', (done) => {
            const { post_voter } = require('./config.json');
            const date = new Date();
            const tokenExpire = date;
            // let usertoken = "4RdhMXWFn9oeE1QxbyooJXYHZpB5psCaj13YitsRb6WmRN711h3sEvbYjTLZnB9USPaSdCMDLxsmJWtHoJmR6Kfy";
            tokenExpire.setHours(date.getHours() + 2);
            post_voter.time_create = date;
            post_voter.time_update = date;
            post_voter.token_validity = tokenExpire;
            const voter = new Voter(post_voter);
            voter.save((err, book_reg) => {
                chai.request(server)
                    .get(`/api/voter/${book_reg.id}`)
                    .send(book_reg)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name');
                        res.body.should.have.property('email');
                        res.body.should.have.property('_id').eql(book_reg.id);
                        done();
                    });
            });
        });
    });
    describe('/GET/:id voter', () => {
        it('it should GET a voter by the given id', (done) => {
            const { post_voter } = require('./config.json');
            const date = new Date();
            const tokenExpire = date;
            const usertoken = '4RdhMXWFn9oeE1QxbyooJXYHZpB5psCaj13YitsRb6WmRN711h3sEvbYjTLZnB9USPaSdCMDLxsmJWtHoJmR6Kfy';
            tokenExpire.setHours(date.getHours() + 2);
            post_voter.time_create = date;
            post_voter.time_update = date;
            post_voter.token_validity = tokenExpire;
            post_voter.token = usertoken;
            const voter = new Voter(post_voter);
            voter.save((err, voter_reg) => {
                chai.request(server)
                    .get(`/api/voter/tokenverify/${voter_reg.id}/${usertoken}`)
                    .send(voter_reg)
                    .end((err, res) => {
                        res.should.have.status(404);
                        // res.cookies.should.be.a('object');
                        // res.params.should.have.property('status');
                        // res.params.should.have.property('status').eql(true);
                        done();
                    });
            });
        });
    });
    describe('voter authentifiaction', () => {
        it('voter can login with name and password', (done) => {
            const { post_voter } = require('./config.json');
            const date = new Date();
            const tokenExpire = date;
            const usertoken = '4RdhMXWFn9oeE1QxbyooJXYHZpB5psCaj13YitsRb6WmRN711h3sEvbYjTLZnB9USPaSdCMDLxsmJWtHoJmR6Kfy';
            tokenExpire.setHours(date.getHours() + 2);
            post_voter.time_create = date;
            post_voter.time_update = date;
            post_voter.token_validity = tokenExpire;
            post_voter.token = usertoken;

            const voter = new Voter(post_voter);
            voter.save((err, voter_reg) => {
                chai.request(server)
                    .post('/api/login')
                    .send({ name: post_voter.name, password: post_voter.password })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql(true);
                        res.body.voter.should.have.property('name').eql(post_voter.name);
                        res.body.voter.should.have.property('email');
                        res.body.voter.should.have.property('_id');
                        res.body.voter.should.have.property('isVerify');
                        done();
                    });
            });
        });
        it('voter can login with email and password', (done) => {
            const { post_voter } = require('./config.json');
            const date = new Date();
            const tokenExpire = date;
            const usertoken = '4RdhMXWFn9oeE1QxbyooJXYHZpB5psCaj13YitsRb6WmRN711h3sEvbYjTLZnB9USPaSdCMDLxsmJWtHoJmR6Kfy';
            tokenExpire.setHours(date.getHours() + 2);
            post_voter.time_create = date;
            post_voter.time_update = date;
            post_voter.token_validity = tokenExpire;
            post_voter.token = usertoken;

            const voter = new Voter(post_voter);
            voter.save((err, voter_reg) => {
                chai.request(server)
                    .post('/api/login')
                    .send({ email: post_voter.email, password: post_voter.password })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql(true);
                        res.body.voter.should.have.property('name').eql(post_voter.name);
                        res.body.voter.should.have.property('email');
                        res.body.voter.should.have.property('_id');
                        res.body.voter.should.have.property('isVerify');
                        done();
                    });
            });
        });
        it('voter can logout', (done) => {
            const { post_voter } = require('./config.json');
            const date = new Date();
            const tokenExpire = date;
            const usertoken = '4RdhMXWFn9oeE1QxbyooJXYHZpB5psCaj13YitsRb6WmRN711h3sEvbYjTLZnB9USPaSdCMDLxsmJWtHoJmR6Kfy';
            tokenExpire.setHours(date.getHours() + 2);
            post_voter.time_create = date;
            post_voter.time_update = date;
            post_voter.token_validity = tokenExpire;
            post_voter.token = usertoken;

            const voter = new Voter(post_voter);
            voter.save((err, voter_reg) => {
                chai.request(server)
                    .post('/api/login')
                    .send({ name: post_voter.name, password: post_voter.password })
                    .end(() => {
                        chai.request(server).get('/api/logout')
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('status').eql(true);
                                done();
                            });
                    });
            });
        });
    });
});
