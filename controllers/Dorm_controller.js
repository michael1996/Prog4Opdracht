"use strict";

const Dorm = require('../model/Dorm')
const assert = require('assert')
const db = require('../db/db_connector')
const auth =  require('../auth/authentication');

module.exports = {
    createDorm(req,res,next){
        const name = req.body.naam
        const adres = req.body.adres
        var token = (req.header('X-Access-Token')) || '';

        auth.decodeToken(token, (err, payload) => {
            const query = { 
                sql: 'INSERT INTO studentenhuis(Naam,Adres,UserID) VALUES (?, ?,?)',
                values: [name,adres,payload.id],
                timeout: 2000
            };
            console.log('QUERY: ' + query.sql);
            db.query( query, (error, rows, fields) => {
                    if (error) {
                        res.status(412).send({
                            "Message":"Een of meer properties in de request body ontbreken of zijn foutief",
                            "Datetime": Date
                        });
                    } else {
                        console.log(rows.insertId);
                        const query = {
                            sql: 'SELECT * FROM  view_studentenhuis WHERE ID = ?',
                            values: rows.insertId,
                            timeout: 2000
                        };
                        console.log('QUERY: ' + query.sql);
                    
                        db.query( query, (error, rows, fields) => {
                                if (error) {
                                    res.status(500).json(error.toString())
                                } else {
                                    res.status(200).json(rows)
                                }
                            });
                    }
                });

        });

    },
    getDorms(req,res,next){
        const query = {
            sql: 'SELECT * FROM view_studentenhuis',
            timeout: 2000
        };
    
        console.log('QUERY: ' + query.sql);
    
        db.query( query, (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.status(200).json(rows)
                }
            });
    },
    getDorm(req,res,next)
    {
        const id = req.params.id ||'';

        if (id)
        {
            const query = {
                sql: 'SELECT * FROM  view_studentenhuis WHERE ID = ?',
                values: id,
                timeout: 2000
            };
            console.log('QUERY: ' + query.sql);
        
            db.query( query, (error, rows, fields) => {
                    if (rows.length ===0 ) {
                        res.status(404).send({
                            "Message": "Niet gevonden (huisId bestaat niet)",
                            "DateTime" : Date
                        });
                    } else {
                        res.status(200).json(rows)
                    }
                });
        }
        else 
        {
            res.status(404).send({
                "Message": "Niet gevonden (huisId bestaat niet)",
                "DateTime" : Date
            });
        }
    },
    updateDorm(req,res,next)
    {
        const id = req.params.id ||'';
        const name = req.body.naam
        const adres = req.body.adres
        if (id)
        {
            var token = (req.header('X-Access-Token')) || '';
            auth.decodeToken(token, (err, payload) => {
                const query = {
                    sql: 'SELECT * FROM studentenhuis WHERE ID = ?',
                    values: [id],
                    timeout: 2000
                };
                console.log('QUERY: ' + query.sql);
            
                db.query( query, (error, rows, fields) => {
                    console.log(payload.id);
                        if (rows[0].UserID === payload.id) {
                            const query = {
                                sql: 'UPDATE studentenhuis SET Naam = ?, Adres = ? WHERE ID = ?',
                                values: [name,adres,id],
                                timeout: 2000
                            };
                            console.log('QUERY: ' + query.sql);
                        
                            db.query( query, (error, rows, fields) => {
                                    if (error) {
                                        res.status(412).send({
                                            "Message": "Een of meer propertie in de request body ontbreken of zijn foutief",
                                            "Datetime":Date
                                        });
                                    } else {
                                        res.status(200).json(rows)
                                    }
                                });
                        }
                         else {
                             res.status(409).send({
                                 "Message" : "Conflict (Gebruiker mag deze data niet wijzigen)",
                                 "Datetime" : Date
                             });
                        }
                    });
            });
            
            
        }
        else 
        {
            res.status(404).send({
                "Message": "Niet gevonden (huisId bestaat niet)",
                "DateTime" : Date
            });
        }
    },
    deleteDorm(req,res,next)
    {
        const id = req.params.id ||'';
        if (id.length>0)
        {
            var token = (req.header('X-Access-Token')) || '';
            auth.decodeToken(token, (err, payload) => {
                const query = {
                    sql: 'SELECT * FROM studentenhuis WHERE ID = ?',
                    values: id,
                    timeout: 2000
                };
                console.log('QUERY: ' + query.sql);
            
                db.query( query, (error, rows, fields) => {
                    if(rows.length ===0)
                    {
                        res.status(404).send({
                            "Message": "Niet gevonden (huisId bestaat niet)",
                            "DateTime" : Date
                        });
                    }
                    else{
                        if (rows[0].UserID === payload.id) {
                            const querydeelnemers = {
                                sql: 'DELETE FROM deelnemers WHERE StudentenhuisID = ?',
                                values: id,
                                timeout: 2000
                            };
                            console.log('QUERY: ' + querydeelnemers.sql);
                            db.query( querydeelnemers, (error, rows, fields) => {
                                });
                                const querymaaltijd = {
                                    sql: 'DELETE FROM maaltijd WHERE StudentenhuisID = ?',
                                    values: id,
                                    timeout: 2000
                                };
                                console.log('QUERY: ' + querymaaltijd.sql);
                                db.query( querymaaltijd, (error, rows, fields) => {
                                    });
                            const query = {
                                sql: 'DELETE FROM studentenhuis WHERE ID = ?',
                                values: id,
                                timeout: 2000
                            };
                            console.log('QUERY: ' + query.sql);
                            db.query( query, (error, rows, fields) => {
                                    if (error) {
                                        res.status(500).json(error.toString())
                                    } else {
                                        res.status(200).json(rows)
                                    }
                                });
                        }
                         else {
                             res.status(409).send({
                                 "Message" : "Conflict (Gebruiker mag deze data niet wijzigen)",
                                 "Datetime" : Date
                             });
                        }
                    }
                       
                    });
            });
            
        }
        else 
        {
            res.status(404).send({
                "Message": "Niet gevonden (huisId bestaat niet)",
                "DateTime" : Date
            });
        }
    }
}
