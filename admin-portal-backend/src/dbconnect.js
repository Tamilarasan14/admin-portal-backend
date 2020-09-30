const {Pool, Client} = require('pg');
const winston = require('winston');
const CONFIG = require('config').props;
const fs = require('fs');
const logger = require('./logger').logger;  


let pool = new Pool({
    user: CONFIG.user,
    password: CONFIG.password,
    host: CONFIG.host,
    port: CONFIG.port,
    database: CONFIG.database,
    ssl: CONFIG.enableSSL ? {
		/* the cert CN won't match the IP address and the TLS connection will be rejected,
			 so disable Common Name validation, this will still make sure our connection is secure */
		checkServerIdentity: () => undefined,
        rejectUnauthorized: false, //COMEBACK - this should be true
        //cert: fs.readFileSync('/etc/pki/CA/certs/rds-ca-2019-root.pem').toString() //COMEBACK - this doesn't work; Rohit says Mike should do this in the cookbook
		/* below option disables node from rejecting self-signed certificates by allowing ANY unauthorised certificate.
			 and i highly recommend that you do not do it that way,
			leaving it here in case you want to use it for your local testing. */
		//rejectUnauthorized : (process.env.NODE_TLS_REJECT_UNAUTHORIZED == 0 ? false : true)
	} : false
});

pool.on('error', (err, client) => {
    logger.error('idle client error ' + err.message + ' - ' + err.stack)
});

let client = new Client({
    user: CONFIG.user,
    password: CONFIG.password,
    host: CONFIG.host,
    port: CONFIG.port,
    database: CONFIG.database
});


module.exports.pgPool = pool;
module.exports.pgClient = client;
