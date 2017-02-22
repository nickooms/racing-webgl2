process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);

const { BrusselsHoofdstedelijkGewest: gewest } = require('../data/gewest');
const { Nederlands: taal } = require('../data/taal');

describe('Gewest', () => {
  describe('GET /gewesten', () => {
    it('it should GET all gewesten', done => {
      chai.request(server)
      .get('/gewesten')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(9);
        done();
      });
    });
  });

  describe('GET /gewest/:id/:taal', () => {
    it('it should GET a gewest by the given id and taal', done => {
      chai.request(server)
      .get(`/gewest/${gewest.id}/${taal.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.deep.eql(gewest);
        done();
      });
    });
  });
});
