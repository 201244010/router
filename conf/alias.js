
const { resolve } = require('../utils');


module.exports = {
    "~" : resolve('src'),
    "h5": resolve('src/H5'),
    "styles" : resolve('src/assets/styles'),
    "common" : resolve('src/assets/common'),
    "intl" : resolve('src/i18n/intl'),
    "pub" : resolve('src/pub')
};
