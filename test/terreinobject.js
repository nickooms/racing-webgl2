process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);

const { TerreinobjectMarkt1: terreinobject } = require('../data/terreinobject');
const { Markt19: huisnummer } = require('../data/huisnummer');

describe('Terreinobject', () => {
  describe('GET /terreinobjecten/:huisnummerId', () => {
    it('it should GET all terreinobjecten by the given huisnummerId', done => {
      chai.request(server)
      .get(`/terreinobjecten/${huisnummer.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        done();
      });
    });
  });

  describe('GET /terreinobject/:id', () => {
    it('it should GET a terreinobject by the given id', done => {
      chai.request(server)
      .get(`/terreinobject/${terreinobject.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.deep.eql(terreinobject);
        done();
      });
    });
  });
});
