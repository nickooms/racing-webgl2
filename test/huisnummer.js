process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);

const { Markt19: huisnummer } = require('../data/huisnummer');
const { Markt: straat } = require('../data/straat');

describe('Huisnummer', () => {
  describe('GET /huisnummers/:straatId', () => {
    it('it should GET all huisnummers by the given straatId', done => {
      chai.request(server)
      .get(`/huisnummers/${straat.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(33);
        done();
      });
    });
  });

  describe('GET /huisnummer/:id', () => {
    it('it should GET a huisnummer by the given id', done => {
      chai.request(server)
      .get(`/huisnummer/${huisnummer.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.deep.eql(huisnummer);
        done();
      });
    });
  });
});
