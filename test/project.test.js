process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
require('../models/index');

const Project = mongoose.model('Project');
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();
chai.use(chaiHttp);

describe('Project', () => {
    beforeEach((done) => { // Before each test we empty the database
        Project.deleteMany({}, (err) => {
            done();
        });
    });
    /*
  * Test the /GET route
  */
    describe('/GET project', () => {
        it('it should GET all the projects', (done) => {
            chai.request(server)
                .get('/api/project')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST project', () => {
        it('it should not POST a project without name or description fields', (done) => {
            chai.request(server)
                .post('/api/project')
                .send({})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(false);
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('name').eql('required');
                    res.body.errors.should.have.property('short_description').eql('required');
                    done();
                });
        });
        
        it('it should POST a project ', (done) => {
            const { post_project } = require('./config.json');
            chai.request(server)
                .post('/api/project')
                .send(post_project)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(true);
                    res.body.project.should.have.property('_id');
                    res.body.project.should.have.property('short_description');
                    res.body.project.should.have.property('name');
                    done();
                });
        });
    });
    describe('/GET/:id project', () => {
        it('it should GET a project by the given id', (done) => {
            const { post_project } = require('./config.json');
            const date = new Date();
            
            
            post_project.time_create = date;
            post_project.time_update = date;
            
            const project = new Project(post_project);
            project.save((err, project_reg) => {
                chai.request(server)
                    .get(`/api/project/${project_reg.id}`)
                    .send(project_reg)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name');
                        res.body.should.have.property('short_description');
                        res.body.should.have.property('_id').eql(project_reg.id);
                        done();
                    });
            });
        });
    });
});
