module.exports = {
    props: {
        host : process.env.DB_HOST || 'localhost',
        port : process.env.DB_PORT || 5432,
        database : process.env.DB_NAME || 'admin-backend',
        user : process.env.DB_CREDENTIAL_USER || 'postgres',
        password : process.env.DB_CREDENTIAL_PW || 'postgres',
        enableSSL : process.env.ENABLE_SSL || false,
        secret: process.env.ED_REST_AUTH_SECRET || 'verybaddefaultsecret',
        auth_length: process.env.ED_REST_AUTH_EXPIRATION || '1d',
        prod : process.env.DEPLOY_ENV || false,
        loggingLevel : process.env.LOGGINGLEVEL || 'info',
        appPort: process.env.APPPORT || 8080,
        refresh : process.env.REFRESH_JWT || true,
        refresh_percentage : process.env.REFRESH_JWT_PERCENTAGE || 25, //value 0-100, value of 25 means token with 1h expiration is refreshed after 45 minutes
    },
    loggerProps:{
        console_level: 'warn',
        console_format: 'json'
    }
}