"use strict";

let User = require('../model/User');
const assert = require('assert');
const db = require('../db/db_connector');
const auth =  require('../auth/authentication');

module.exports = {
    registerUser(req,res,next){
        let user = new User(req.body.firstname,req.body.lastname,req.body.email,req.body.password);

            const checkquery = {
                sql: 'SELECT * FROM user WHERE Email = ?',
                values: user.email,
                timeout: 2000
            };
            db.query(checkquery,(error,rows)=>{
                if(rows.length>0)
                {
                    res.status(412).send({
                        "message":"email is al ingebruik",
                        "date": Date()
                    });
                }
                else
                {
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
                                console.log(rows)
                                res.send({
                                    "code": 200,
                                    "token" :auth.encodeToken(rows.insertId,user.email),
                                    "email" : user.email,
                                });
                            }
                        });
                }

                    
            });
    },
    LoginUser(req,res,next){
        const email = req.body.email || '';
        const password = req.body.password || '';
        const query = {
            sql: 'SELECT * FROM user WHERE Email = ? AND Password = ?',
            values: [email,password],
            timeout: 2000
        };
        db.query(query,(error,rows)=>{
            console.log(rows);
                if(rows.length ===1){
                    res.status(200).send({
                        "token" :auth.encodeToken(rows[0].ID,rows[0].Email),
                        "email" : rows[0].Email,
                    });
                  }
                  else{
                    res.status(412).send({
                      "Login Failed": "Een of meer properties in de request body ontbreken of zijn foutief",
                      "date": Date()
                        });
                  }
                
                
        });

    }
};
