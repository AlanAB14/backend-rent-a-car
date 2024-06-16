const config = require('./src/config.js');
const app = require('./src/app.js');

const { PORT } = config;

app.listen(PORT);

console.log('Server running on port', PORT);
