process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);

const { Markt19: huisnummer } = require('../data/huisnummer');
const { GebouwMarkt19: gebouw, GebouwenMarkt19: gebouwen } = require('../data/gebouw');

describe('Gebouw', () => {
  describe('GET /gebouwen/:huisnummerId', () => {
    it('it should GET all gebouwen by the given huisnummerId', done => {
      chai.request(server)
      .get(`/gebouwen/${huisnummer.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        res.body.should.deep.eql(gebouwen);
        done();
      });
    });
  });

  describe('GET /gebouw/:id', () => {
    it('it should GET a gebouw by the given id', done => {
      chai.request(server)
      .get(`/gebouw/${gebouw.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.deep.eql(gebouw);
        done();
      });
    });
  });
});
