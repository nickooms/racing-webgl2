process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);

const { WegsegmentMarkt1: wegsegment } = require('../data/wegsegment');
const { Markt: straat } = require('../data/straat');

describe('Wegsegment', () => {
  describe('GET /wegsegmenten/:straatId', () => {
    it('it should GET all wegsegmenten by the given straatId', done => {
      chai.request(server)
      .get(`/wegsegmenten/${straat.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(4);
        done();
      });
    });
  });

  describe('GET /wegsegment/:id', () => {
    it('it should GET a wegsegment by the given id', done => {
      chai.request(server)
      .get(`/wegsegment/${wegsegment.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.deep.eql(wegsegment);
        done();
      });
    });
  });
});
