const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

console.log('Se anda ejecutando el index')

app.listen(config.PORT, () => logger.info(`Server running on port ${config.PORT}`))