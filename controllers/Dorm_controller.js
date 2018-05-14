const Dorm = require('../model/Dorm')
const assert = require('assert')
const db = require('../db/db_connector')
const auth =  require('../auth/authentication');

module.exports = {
    createDorm(req,res,next){
        assert(req.body.naam, 'firstname must be provided')
        assert(req.body.adres, 'lastname must be provided')
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
                        res.status(500).json(error.toString())
                    } else {
                        res.status(200).json(rows)
        
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
                    if (error) {
                        res.status(500).json(error.toString())
                    } else {
                        res.status(200).json(rows)
                    }
                });
        }
        else 
        {
            this.getDorms;
        }
    },
    updateDorm(req,res,next)
    {
        const id = req.params.id ||'';
        assert(req.body.naam, 'firstname must be provided')
        assert(req.body.adres, 'lastname must be provided')
        const name = req.body.naam
        const adres = req.body.adres
        if (id)
        {
            const query = {
                sql: 'UPDATE studentenhuis SET Naam = ?, Adres = ? WHERE ID = ?',
                values: [name,adres,id],
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
        else 
        {
            //error handling als er geen id gegeven is 
        }
    },
    deleteDorm(req,res,next)
    {
        const id = req.params.id ||'';
        if (id)
        {
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
        else 
        {
            //error handling als er geen id gegeven is 
        }
    }
}
