process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);

const { Stabroek: gemeente } = require('../data/gemeente');
const { Markt: straat } = require('../data/straat');

describe('Straat', () => {
  describe('GET /straten/:gemeenteId', () => {
    it('it should GET all straten by the given gemeenteId', done => {
      chai.request(server)
      .get(`/straten/${gemeente.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(154);
        done();
      });
    });
  });

  describe('GET /straat/:id', () => {
    it('it should GET a straat by the given id', done => {
      chai.request(server)
      .get(`/straat/${straat.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.deep.eql(straat);
        done();
      });
    });
  });
});
