let prefix = process.env.NODE_ENV === 'development' ? 'dev.' : ''

exports.API_ROOT = `https://${prefix}api.bethel.io`
exports.DASHBOARD_ROOT = `http://${prefix}my.bethel.io`
