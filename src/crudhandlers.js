const {pgPool} = require('./src/dbconnect.js');
const logger = require('./logger').logger;  


module.exports = {
    'getById': getById,
    'postNewRow': postNewRow,
    'deleteById': deleteById,
    'updateById': updateById,
    'getTable': getTable
}

function getById(tablename) {
    return ((req, res, next) => {
        pgPool.query({
            text: 'SELECT * FROM ' + tablename + ' WHERE id = $1',
            values: [req.params.id]
        }, (err, result) => {
            if (err) {
                logger.error('error in getById: ' + err);
                res.send(500);
                next(err);
            } else {
                if (result.rowCount === 0) {
                    res.send(404);
                    next();
                } else {
                    res.contentType = 'json';
                    res.send(200, JSON.parse(JSON.stringify(result.rows[0])));
                    next();
                }
            }
        })
    })
}

//dependency on knowing columns is undesirably tight coupling
function postNewRow(tablename, columns) {
    return ((req, res, next) => {
        let queryColumns = '';
        let queryVals = '';
        let queryValues = [];

        for (column of columns) {
            if (req.body.hasOwnProperty(column)) {
                queryValues.push(req.body[column]);
                queryVals += ('$' + queryValues.length + ', ');
                queryColumns += (column + ', ');
            }
        }

        //strip the final ', ' from queryVals and queryColumns to avoid syntax errors
        queryVals = queryVals.substring(0, queryVals.length - 2);
        queryColumns = queryColumns.substring(0, queryColumns.length - 2);

        let queryText = 'INSERT INTO ' + tablename + ' (' + queryColumns + ') VALUES (' + queryVals + ') RETURNING id';

        pgPool.query({
            text: queryText,
            values: queryValues
        }, (err, result) => {
            if (err) {
                logger.error('error in postNewRow: ' + err);
                res.send(500);
                next(err);
            } else {
                res.contentType = 'json';
                res.send(201, JSON.parse(JSON.stringify(result.rows[0])));
                next();
            }
        })
    });
}

function deleteById(tablename) {
    return ((req, res, next) => {
        pgPool.query({
            text: 'DELETE FROM ' + tablename + ' WHERE id = $1',
            values: [req.params.id]
        }, (err, result) => {
            if (err) {
                logger.error('error in deleteById: ' + err);
                res.send(500);
                next(err);
            } else {
                if (result.rowCount === 0) {
                    res.send(404);
                    next();
                } else {
                    res.send(204);
                    next();
                }
            }
        })
    })
};

function updateById(tablename, columns) {
    return ((req, res, next) => {
        //assume that the request body contains columns to be updated
        let queryText = 'UPDATE ' + tablename + ' SET ';
        let queryValues = [];

        for (column of columns) {
            if (req.body.hasOwnProperty(column)) {
                queryValues.push(req.body[column]);
                queryText += (column + ' = $' + queryValues.length + ', ');
            }
        }

        //strip the final ', ' off queryText to avoid syntax errors
        queryText = queryText.substring(0, queryText.length - 2);
        
        queryValues.push(req.params.id);
        queryText += ' WHERE id = $' + queryValues.length;

        pgPool.query({
            text: queryText,
            values: queryValues
        }, (err, result) => {
            if (err) {
                logger.error('error in updateById: ' + err);
                res.send(500);
                next(err);
            } else {
                if (result.rowCount === 0) {
                    //if the id did not match, send 405 error: cannot update nonexistent id
                    res.send(405);
                    next();
                } else {
                    res.send(204);
                    next();
                }
            }
        })
    })
}

function getTable(tablename) {
    return ((req, res, next) => {
        pgPool.query({
            text: 'SELECT * FROM ' + tablename
        }, (err, result) => {
            if (err) {
                logger.error('error in getTable: ' + err);
                res.send(500);
                next(err);
            } else {
                res.contentType = 'json';
                res.send(200, JSON.parse(JSON.stringify(result.rows)));
                next();
            }
        })
    })
}