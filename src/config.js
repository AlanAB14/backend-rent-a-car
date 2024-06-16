const dotenv = require('dotenv');
dotenv.config();

// Exportar variables
module.exports.PORT = 3000;
module.exports.DB_USER = 'root';
module.exports.DB_PASSWORD = '';
module.exports.DB_HOST = 'localhost';
module.exports.DB_DATABASE = 'rent_a_car';
module.exports.DB_PORT = 3306;

// module.exports.PORT = 3001;
// module.exports.DB_USER =  'nfdzgkds_admin';
// module.exports.DB_PASSWORD =  'S)QA$n,F-L4N';
// module.exports.DB_HOST =  '167.250.5.63';
// module.exports.DB_DATABASE =  'nfdzgkds_dvl';
// module.exports.DB_PORT =  3306;

module.exports.SECRET_KEY = 'TokenRAC';