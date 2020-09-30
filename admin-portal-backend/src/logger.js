var winston = require('winston');
const CONFIG = require('config').loggerProps;

const transports = {
  console: new winston.transports.Console({ level: CONFIG.console_level }),
  //file: new winston.transports.File({ filename: 'combined.log', level: 'error' })
};

/**
 * @summary
 * this method is used for creating logger object with configurations using winston
 * 
 * @returns
 * will return the common logger object for all other files
 */
var logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
   transports.console
  ],
});


module.exports = {
    'toRegisterLogger': function (registrar) {
        registrar('put', '/api/loglevel/:level', updateLogLevel);
        
}
}

/** 
 *This method is responsible for changing log level in the runtime
 *@example
 * http://localhost:8080/api/loglevel/info
 */
function updateLogLevel(req, res, next) {
    let level = req.params.level;
    transports.console.level = level;
    res.status(200);
    res.send('Log level updated to: ' + level);
    next();
}

module.exports.logger=logger;