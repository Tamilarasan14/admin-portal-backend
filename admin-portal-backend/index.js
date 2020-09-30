// Imports
const restify = require('restify');
const cookieParser = require('restify-cookies');
const {pgPool, pgClient} = require('./src/dbconnect.js');
const loggerObj = require('./src/logger');
const CONFIG = require('config').props;


const logger = loggerObj.logger

// Create server
const server = restify.createServer({
    "name": "admin-portal-backend"
});

var cors = require('cors');

//parses query string to req.query
server.use(restify.plugins.queryParser());
//parses POST request body to req.body
server.use(restify.plugins.bodyParser());
//use the restify-cookies plugin
server.use(cookieParser.parse);

server.use(cors());

//export the server, for the tests to run.
//unsure if js supports private exports or if this is bad in general
module.exports = {'server': server};

//setup the CRUD routes for itemattribute
//require('./test/namelookup.js').toRegister(registerFunction);
// require('./utility/namelookup.js').toRegister(registerFunction);

//register logger service
loggerObj.toRegisterLogger(registerFunction);

// Init routes
//server.get('/hello', withAuth, hello);
registerFunction('get', '/api/hello', hello);
registerFunction('head', '/api/hello', hello);
registerFunction('get', '/api/health', health);
registerFunction('head', '/api/health', health);

/* Spec:
 * httpVerb: which verb to use. eg 'GET', 'POST', ...
 * ...args: arguments to the server['httpVerb'] call
 */
function registerFunction(httpVerb, ...args) {
    //invalid httpVerb logic
    if (!['get', 'post', 'put', 'head', 'del'].includes(httpVerb)) {
        throw "httpVerb is invalid";
    }

    //if args len > 2, it includes auth middleware
    auth = (args.length > 2);
    let loggedCallback = (callback) => {
        return (req, res, next) => {
            if (auth) {
                if (!req.user) {
                    logger.error('req.user is not set in authenticated route');
                } else {
                    logger.info('user: ' + req.user);
                }
            }
            logger.info('entered ' + args[0]);
            if (JSON.stringify(req.params) !== '{}') {
                logger.info('req.params: ' + JSON.stringify(req.params));
            }
            callback(req, res, next);
        }
    }
    args.push(loggedCallback(args.pop()));
    server[httpVerb](...args);
};

// Listen
 server.listen(CONFIG.appPort, async function() {
    logger.info(server.name + ' listening at ' + server.url);
    try {
        logger.info("Loaded name lookups.");
    } catch (err) {
        logger.info("Error loading name lookups:" + err);
    }
});

// Handlers
function hello(req, res, next) {
    logger.info("Entered hello");
    res.status(200);
    res.send('Hello, World!');
    next();
}

function health(req, res, next) {
    logger.info("Entered health");
    res.status(200);
    res.send('OK');
    next();
}