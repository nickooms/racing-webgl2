process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);

const { WegobjectMarkt1: wegobject } = require('../data/wegobject');
const { Markt: straat } = require('../data/straat');

describe('Wegobject', () => {
  describe('GET /wegobjecten/:straatId', () => {
    it('it should GET all wegobjecten by the given straatId', done => {
      chai.request(server)
      .get(`/wegobjecten/${straat.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(5);
        done();
      });
    });
  });

  describe('GET /wegobject/:id', () => {
    it('it should GET a wegobject by the given id', done => {
      chai.request(server)
      .get(`/wegobject/${wegobject.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.deep.eql(wegobject);
        done();
      });
    });
  });
});
