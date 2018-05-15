/**
 * Testcases aimed at testing the authentication process. 
 */
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should()
chai.use(chaiHttp)

// After successful registration we have a valid token. We export this token
// for usage in other testcases that require login.
let validToken

describe('Registration', () => {
    it('should return a token when providing valid information', (done) => {
        // chai.request(server)
        //     .post('/api/register')
        //     .send({
        //         "firstname": "hans",
        //         "lastname" : "klaas",
        //         "email": "123",
        //         "password":"secret"
        //     })
        //     .end((err,res)=>{
        //         res.should.have.status(200)
        //         const response = res.body
        //         response.should.have.property('token').which.is.an('string')
        //         response.should.have.property('email').which.is.an('string')
        //         validToken = res.body.token
        //         done()
        //     })
        //     module.exports = {
        //         token: validToken
        //      }
        done()
    })

    it('should return an error on GET request', (done) => {
        chai.request(server)
        .get('/api/register')
        .end((err,res)=>{
            res.should.have.status(404)  
            done()         
        })

    })

    it('should throw an error when the user already exists', (done) => {
        chai.request(server)
        .post('/api/register')
        .send({
            "firstname": "hans",
            "lastname" : "klaas",
            "email": "'hansklaas4@server.nl'",
            "password":"secret"
        })
        .end((err,res)=>{
            res.should.have.status(412)
            done()
        })
    })

    it('should throw an error when no firstname is provided', (done) => {
        chai.request(server)
        .post('/api/register')
        .send({
            "firstname": "",
            "lastname" : "klaas",
            "email": "'hansklaas4@server.nl'",
            "password":"secret"
        })
        .end((err,res)=>{
            res.should.have.status(412)
            done()
        })
    })

    it('should throw an error when firstname is shorter than 2 chars', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when no lastname is provided', (done) => {
        chai.request(server)
        .post('/api/register')
        .send({
            "firstname": "hans",
            "lastname" : "",
            "email": "'hansklaas4@server.nl'",
            "password":"secret"
        })
        .end((err,res)=>{
            res.should.have.status(412)
            done()
        })
    })

    it('should throw an error when lastname is shorter than 2 chars', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when email is invalid', (done) => {
        chai.request(server)
        .post('/api/register')
        .send({
            "firstname": "henk",
            "lastname" : "klaas",
            "email": "",
            "password":"secret"
        })
        .end((err,res)=>{
            res.should.have.status(412)
            done()
        })

    })

})

describe('Login', () => {

    it('should return a token when providing valid information', (done) => {
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "hansklaas9@server.nl",
                "password":"secret"
            })
            .end((err,res)=>{
                res.should.have.status(200)
                const response = res.body
                response.should.have.property('token').which.is.an('string')
                response.should.have.property('email').which.is.an('string')
                validToken = res.body.token
                done()
            })
    })

    it('should throw an error when email does not exist', (done) => {
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "hansklaa",
                "password":"secret"
            })
            .end((err,res)=>{
                res.should.have.status(412)
                done()
            })
    })

    it('should throw an error when email exists but password is invalid', (done) => {
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "hansklaas9@server.nl",
                "password":"st"
            })
            .end((err,res)=>{
                res.should.have.status(412)
                done()
            })
    })

    it('should throw an error when using an invalid email', (done) => {
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "hansklaas9er.nl",
                "password":"secret"
            })
            .end((err,res)=>{
                res.should.have.status(412)
                done()
            })
    })

})