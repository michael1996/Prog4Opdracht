const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should()
chai.use(chaiHttp)



describe('Studentenhuis API POST', () => {
    let validToken = null;
    let fakeToken = 0;
    before(function(){
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "hansklaas9@server.nl",
                "password":"secret"
            })
            .end((err,res)=>{
                validToken = res.body.token
            })

    });
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
        .post('/api/studentenhuis')
        .set('X-Access-Token',fakeToken)
        .send({
            "email": "hansklaas9@server.nl",
            "password":"secret"
        })

        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })

    })

    it('should return a studentenhuis when posting a valid object', (done) => {
        chai.request(server)
        .post('/api/studentenhuis')
        .set('X-Access-Token',validToken)
        .send({
            "naam":"test ",
            "adres":"test"
        })

        .end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })

    it('should throw an error when naam is missing', (done) => {
        chai.request(server)
        .post('/api/studentenhuis')
        .set('X-Access-Token',validToken)
        .send({
            "adres":"test"
        })

        .end((err,res)=>{
            res.should.have.status(412)
            done()
        })
    })
})

describe('Studentenhuis API GET all', () => {
    let validToken = null;
    let fakeToken = 0;
    before(function(){
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "hansklaas9@server.nl",
                "password":"secret"
            })
            .end((err,res)=>{
                validToken = res.body.token
            })

    });
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
        .get('/api/studentenhuis')
        .set('X-Access-Token',fakeToken)

        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })

    it('should return all studentenhuizen when using a valid token', (done) => {
        chai.request(server)
        .get('/api/studentenhuis')
        .set('X-Access-Token',validToken)

        .end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })
})

describe('Studentenhuis API GET one', () => {
    let validToken = null;
    let fakeToken = 0;
    before(function(){
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "hansklaas9@server.nl",
                "password":"secret"
            })
            .end((err,res)=>{
                validToken = res.body.token
            })

    });
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
        .get('/api/studentenhuis/2')
        .set('X-Access-Token',validToken)

        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })

    it('should return the correct studentenhuis when using an existing huisId', (done) => {
        chai.request(server)
        .get('/api/studentenhuis/2')
        .set('X-Access-Token',validToken)

        .end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })

    it('should return an error when using an non-existing huisId', (done) => {
        chai.request(server)
        .get('/api/studentenhuis/200')
        .set('X-Access-Token',validToken)

        .end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })
})

describe('Studentenhuis API PUT', () => {
    let validToken = null;
    let fakeToken = 0;
    before(function(){
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "hansklaas9@server.nl",
                "password":"secret"
            })
            .end((err,res)=>{
                validToken = res.body.token
            })

    });
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
        .put('/api/studentenhuis/2')
        .set('X-Access-Token',fakeToken)
        .send({
            "naam":"ahahahahahah ",
            "adres":"aahhahaha"
        })

        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })

    it('should return a studentenhuis with ID when posting a valid object', (done) => {
        chai.request(server)
        .put('/api/studentenhuis/15')
        .set('X-Access-Token',validToken)
        .send({
            "naam":"ahahahahahah ",
            "adres":"aahhahaha"
        })

        .end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })

    it('should throw an error when naam is missing', (done) => {
        chai.request(server)
        .put('/api/studentenhuis')
        .set('X-Access-Token',validToken)
        .send({
            "adres":"aahhahaha"
        })

        .end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })

    it('should throw an error when adres is missing', (done) => {
        chai.request(server)
        .put('/api/studentenhuis')
        .set('X-Access-Token',validToken)
        .send({
            "naam":"aahhahaha"
        })

        .end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })
})

describe('Studentenhuis API DELETE', () => {
    let validToken = null;
    let fakeToken = 0;
    before(function(){
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "hansklaas9@server.nl",
                "password":"secret"
            })
            .end((err,res)=>{
                validToken = res.body.token
            })

    });
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
        .del('/api/studentenhuis/15')
        .set('X-Access-Token',fakeToken)

        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })
})