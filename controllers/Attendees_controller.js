"use strict";

const assert = require('assert')
const db = require('../db/db_connector')
const auth =  require('../auth/authentication');

module.exports = {
    createAttendees(req,res,next){
        var token = (req.header('X-Access-Token')) || '';
        const maaltijdid = req.params.maaltijdid ||'';
        const id = req.params.id ||'';
        if(id && maaltijdid)
        {
            auth.decodeToken(token, (err, payload) => {
                const query = {
                    sql: 'SELECT * FROM deelnemers WHERE StudentenhuisID = ? and MaaltijdID=? and UserID =?' ,
                    values: [id,maaltijdid,payload.id],
                    timeout: 2000
                };
                console.log('QUERY: ' + query.sql);
            
                db.query( query, (error, rows, fields) => {
                        if (rows.length>0) {
                            res.status(409).send({
                                "Message":"Conflict (Gebruiker is al aangemeld)"
                            });
                        } else {
                            const query = { 
                                sql: 'INSERT INTO deelnemers(UserID,StudentenhuisID,MaaltijdID) VALUES (?, ?,?)',
                                values: [payload.id,id,maaltijdid],
                                timeout: 2000
                            };
                        
                            console.log('QUERY: ' + query.sql);
                        
                            db.query( query, (error, rows, fields) => {
                                    if (error) {
                                        res.status(404).send({
                                            "Message":"Niet gevonden (huisId of maaltijdId bestaat niet)"
                                        });
                                    } else {
                                        res.status(200).json(rows)
                        
                                    }
                                });
                        }
                    });

    
            });
        }
        else{
            res.status(404).send({
                "Message":"Niet gevonden (huisId of maaltijdId bestaat niet)"
        });
    }
    },
    getAttendees(req,res,next)
    {
        const id = req.params.id ||'';
        const maaltijdid= req.params.maaltijdid||'';
        const query = {
            sql: 'SELECT * FROM view_deelnemers WHERE StudentenhuisID = ? and MaaltijdID=?' ,
            values: [id,maaltijdid],
            timeout: 2000
        };
        console.log('QUERY: ' + query.sql);
    
        db.query( query, (error, rows, fields) => {
                if (error) {
                    res.status(404).send({
                        "Message": "Niet gevonden (huisId of maaltijdId bestaat niet)"
                    });
                } else {
                    res.status(200).json(rows)
                }
            });
    },
    deleteAttendees(req,res,next){
        var token = (req.header('X-Access-Token')) || '';
        const maaltijdid = req.params.maaltijdid ||'';
        const id = req.params.id ||'';
        auth.decodeToken(token, (err, payload) => {
            const query = {
                sql: 'SELECT * FROM deelnemers WHERE StudentenhuisID = ? and MaaltijdID=? and UserID =?' ,
                values: [id,maaltijdid,payload.id],
                timeout: 2000
            };
            console.log('QUERY: ' + query.sql);
        
            db.query( query, (error, rows, fields) => {
                    if (rows.length>0) {
                        const query = { 
                            sql: 'Delete from deelnemers where Userid = ? AND StudentenhuisID =? AND MaaltijdID =?',
                            values: [payload.id,id,maaltijdid],
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
                    } else {
                        res.status(409).send({
                            "Message": "Conflict (Gebruiker mag deze data niet verwijderen)"
                        });
                    }
                });


        });
    }
}