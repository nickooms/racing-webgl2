process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);

const { Talen } = require('../data/taal');

describe('Taal', () => {
  describe('GET /talen', () => {
    it('it should GET all talen', done => {
      chai.request(server)
      .get('/talen')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(3);
        res.body.should.deep.include.members(Talen);
        done();
      });
    });
  });
});
