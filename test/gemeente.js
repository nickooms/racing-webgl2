process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);

const { BrusselsHoofdstedelijkGewest: gewest } = require('../data/gewest');
const { Stabroek: gemeente } = require('../data/gemeente');

describe('Gemeente', () => {
  describe('GET /gemeenten/:gewestId', () => {
    it('it should GET all gemeenten by the given gewestId', done => {
      chai.request(server)
      .get(`/gemeenten/${gewest.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(38);
        done();
      });
    });
  });

  describe('GET /gemeente/:id', () => {
    it('it should GET a gemeente by the given id', done => {
      chai.request(server)
      .get(`/gemeente/${gemeente.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.deep.eql(gemeente);
        done();
      });
    });
  });
});
