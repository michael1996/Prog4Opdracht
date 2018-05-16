"use strict";

const assert = require('assert')
const db = require('../db/db_connector')
const auth =  require('../auth/authentication');

module.exports = {
    createMeal(req,res,next){
        const id = req.params.id ||'';
        const name = req.body.naam;
        const description = req.body.beschrijving;
        const ingredients = req.body.ingredienten;
        const allergies = req.body.allergie;
        const price = req.body.prijs;
        var token = (req.header('X-Access-Token')) || '';
        auth.decodeToken(token, (err, payload) => {
            const query = {
                sql: 'INSERT INTO maaltijd(Naam,Beschrijving,Ingredienten,Allergie,Prijs,UserId,StudentenhuisID) VALUES (?, ?,?,?,?,?,?)',
                values: [name,description,ingredients,allergies,price,payload.id,id],
                timeout: 2000
            };

            const queryStudenthouse = {
                sql: 'SELECT * FROM  studentenhuis WHERE ID = ?',
                values: id,
                timeout: 2000
            };

            console.log('QUERY: ' + queryStudenthouse.sql);
                db.query( queryStudenthouse, (error, rows) => {
                    if (rows.length === 0) {
                        res.status(404).send({
                            "message": "Niet gevonden (huisId bestaat niet)",
                            "code": 404,
                            "date": Date()
                        });
                    }else{
                        db.query( query, (error, rows) => {
                            console.log('QUERY: ' + query.sql);

                            if(error) {
                                res.status(412).send({
                                    "message": "Een of meer properties in de request body ontbreken of zijn foutief",
                                    "code":412,
                                    "date": Date()
                                });
                            }else{
                                res.status(200).send({
                                    "ID": rows.insertId,
                                    "naam": name,
                                    "beschrijving": description,
                                    "ingredienten": ingredients,
                                    "allergie": allergies,
                                    "prijs": price
                                });
                            }
                        });
                    }
            });
        });
    },
    getMeals(req,res,next){
        const id = req.params.id ||'';
        const query = {
            sql: 'SELECT * FROM maaltijd WHERE StudentenhuisID = ?',
            values: id,
            timeout: 2000
        };

        const queryStudenthouse = {
            sql: 'SELECT * FROM  studentenhuis WHERE ID = ?',
            values: id,
            timeout: 2000
        };
    
        console.log('QUERY: ' + queryStudenthouse.sql);

        db.query( queryStudenthouse, (error, rows) => {
            if (rows.length === 0) {
                res.status(404).send({
                    "message": "Niet gevonden (huisId bestaat niet)",
                    "code": 404,
                    "date": Date()
                });
            }else {
                console.log('QUERY: ' + query.sql);

                db.query(query, (error, rows, fields) => {
                    if (error) {
                        res.status(500).json(error.toString())
                    } else {
                        res.status(200).json(rows)
                    }
                });
            }

        });
    },
    getMeal(req,res,next){
        const id = req.params.id ||'';
        const maaltijdid= req.params.maaltijdid||'';
        const query = {
            sql: 'SELECT * FROM maaltijd WHERE StudentenhuisID = ? and ID=?' ,
            values: [id,maaltijdid],
            timeout: 2000
        };

        const queryStudenthouse = {
            sql: 'SELECT * FROM  studentenhuis WHERE ID = ?',
            values: id,
            timeout: 2000
        };

        const queryMeal = {
            sql: 'SELECT * FROM  maaltijd WHERE ID = ?',
            values: maaltijdid,
            timeout: 2000
        };
        console.log('QUERY: ' + queryStudenthouse.sql);

        db.query( queryStudenthouse, (error, rows) => {
            if (rows.length === 0) {
                res.status(404).send({
                    "message": "Niet gevonden (huisId bestaat niet)",
                    "code": 404,
                    "date": Date()
                });
            } else {
                console.log('QUERY: ' + queryMeal.sql);

                db.query(queryMeal, (error, rows) => {
                    if (rows.length === 0) {
                        res.status(404).send({
                            "message": "Niet gevonden (maaltijdId bestaat niet)",
                            "code": 404,
                            "date": Date()
                        });
                    }else{
                        console.log('QUERY: ' + query.sql);
                        db.query(queryMeal, (error, rows) => {
                            if (error) {
                                res.status(500).json(error.toString())
                            } else {
                                res.status(200).json(rows)
                            }
                        });
                    }
                });
            }
        });

    },
    updateMeal(req,res,next){
        const maaltijdid= req.params.maaltijdid||'';
        const id = req.params.id ||'';
        const name = req.body.naam
        const description = req.body.beschrijving
        const ingredients = req.body.ingredienten
        const allergies = req.body.allergie
        const price = req.body.prijs
            var token = (req.header('X-Access-Token')) || '';
            auth.decodeToken(token, (err, payload) => {

            const queryStudenthouse = {
                sql: 'SELECT * FROM  studentenhuis WHERE ID = ?',
                values: id,
                timeout: 2000
            };

            const queryMeal = {
                sql: 'SELECT * FROM  maaltijd WHERE ID = ?',
                values: maaltijdid,
                timeout: 2000
            };

            const queryUser = {
                sql: 'SELECT * FROM maaltijd WHERE ID = ?',
                values: [maaltijdid],
                timeout: 2000
            };

            const query = {
                sql: 'UPDATE maaltijd SET Naam = ?, Beschrijving =?,Ingredienten =?,Allergie = ?,Prijs = ? WHERE ID = ?',
                values: [name, description, ingredients, allergies, price, maaltijdid],
                timeout: 2000
            };

            console.log('QUERY: ' + queryUser.sql);

            db.query(queryStudenthouse, (error, rows, fields) => {
                if (rows.length === 0) {
                    res.status(404).send({
                        "message": "Niet gevonden (huisId bestaat niet)",
                        "code": 404,
                        "date": Date()
                    });
                }else{
                    db.query(queryMeal, (error, rows) => {
                        if (rows.length === 0) {
                            res.status(404).send({
                                "message": "Niet gevonden (maaltijdId bestaat niet)",
                                "code": 404,
                                "date": Date()
                            });
                        }else{
                            db.query(queryUser, (error, rows, fields) => {
                                console.log(payload.id);
                                if (rows[0].UserID === payload.id) {
                                    db.query(query, (error, rows, fields) => {
                                        if (error) {
                                            res.status(412).send({
                                                "message": "Een of meer properties in de request body ontbreken of zijn foutief",
                                                "code": 412,
                                                "date": Date()
                                            });
                                        } else {
                                            res.status(200).send({
                                                "ID": maaltijdid,
                                                "naam": name,
                                                "beschrijving": description,
                                                "ingredienten": ingredients,
                                                "allergie": allergies,
                                                "prijs": price
                                            });
                                        }
                                    });
                                } else {
                                    res.status(409).send({
                                        "Message" : "Conflict (Gebruiker mag deze data niet wijzigen)",
                                        "Datetime" : Date
                                    });
                                }
                            });
                        }
                    });
                }
            });

        });
    },
    deleteMeal(req,res,next){
        const maaltijdid = req.params.maaltijdid ||'';
        const id = req.params.id ||'';

        var token = (req.header('X-Access-Token')) || '';
        auth.decodeToken(token, (err, payload) => {

            const queryStudenthouse = {
                sql: 'SELECT * FROM  studentenhuis WHERE ID = ?',
                values: id,
                timeout: 2000
            };

            const queryMeal = {
                sql: 'SELECT * FROM  maaltijd WHERE ID = ?',
                values: maaltijdid,
                timeout: 2000
            };

            const queryUser = {
                sql: 'SELECT * FROM maaltijd WHERE ID = ?',
                values: [maaltijdid],
                timeout: 2000
            };

            const query = {
                sql: 'DELETE FROM maaltijd WHERE ID = ?',
                values: maaltijdid,
                timeout: 2000
            };


            console.log('QUERY: ' + queryUser.sql);

            db.query(queryStudenthouse, (error, rows, fields) => {
                if (rows.length === 0) {
                    res.status(404).send({
                        "message": "Niet gevonden (huisId bestaat niet)",
                        "code": 404,
                        "date": Date()
                    });
                }else{
                    db.query(queryMeal, (error, rows) => {
                        if (rows.length === 0) {
                            res.status(404).send({
                                "message": "Niet gevonden (maaltijdId bestaat niet)",
                                "code": 404,
                                "date": Date()
                            });
                        }else{
                            db.query(queryUser, (error, rows, fields) => {
                                console.log(payload.id);
                                if (rows[0].UserID === payload.id) {
                                    const deelnemersquery = { 
                                        sql: 'Delete from deelnemers where Userid = ? AND StudentenhuisID =? AND MaaltijdID =?',
                                        values: [payload.id,id,maaltijdid],
                                        timeout: 2000
                                    };
                                
                                    console.log('QUERY: ' + query.sql);
                                
                                    db.query( deelnemersquery, (error, rows, fields) => {
                                        db.query(query, (error, rows, fields) => {
                                            if (error) {
                                                res.status(412).send({
                                                    "message": "Een of meer properties in de request body ontbreken of zijn foutief",
                                                    "code": 412,
                                                    "date": Date()
                                                });
                                            } else {
                                                res.status(200).send({
    
                                                });
                                            }
                                        });
                                    });
                                   
                                } else {
                                    res.status(409).send({
                                        "Message" : "Conflict (Gebruiker mag deze data niet wijzigen)",
                                        "Datetime" : Date
                                    });
                                }
                            });
                        }
                    });
                }
            });

        });
    }
}