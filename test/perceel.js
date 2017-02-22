process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);

const { PerceelMarkt19: perceel } = require('../data/perceel');
const { Markt19: huisnummer } = require('../data/huisnummer');

describe('Perceel', () => {
  describe('GET /percelen/:huisnummerId', () => {
    it('it should GET all percelen by the given huisnummerId', done => {
      chai.request(server)
      .get(`/percelen/${huisnummer.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        done();
      });
    });
  });

  describe('GET /perceel/:id', () => {
    it('it should GET a perceel by the given id', done => {
      chai.request(server)
      .get(`/perceel/${perceel.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.deep.eql(perceel);
        done();
      });
    });
  });
});
