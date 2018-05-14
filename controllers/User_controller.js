let User = require('../model/User')
const assert = require('assert')
const db = require('../db/db_connector')

module.exports = {
    registerUser(req,res,next){
        let user = req.body;

        assert.equal(typeof(req.body.firstname), 'string', "Argument 'firstname' must be a string.");
        assert.equal(typeof(req.body.lastname), 'string', "Argument 'lastname' must be a string.");
        assert.equal(typeof(req.body.email), 'string', "Argument 'email' must be a string.");
        assert.equal(typeof(req.body.password), 'string', "Argument 'password' must be a string.");

        const query = {
            sql: 'INSERT INTO user(Voornaam, Achternaam,Email,Password) VALUES (?, ?,?,?)',
            values: [user.firstname, user.lastname,user.email,user.password ],
            timeout: 2000
        };
    
        console.log('QUERY: ' + query.sql);
    
        db.query( query, (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.status(200).json(rows)
                }
            })
        
    }
}