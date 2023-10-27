const { wrapController } = require('../utils/handle');
const { uploadImage } = require('../utils/fileHandle');
const FormdataValidator = async (req, res, next) => {
    const { urls, fields } = await uploadImage(req);
    const Fields = JSON.parse(JSON.stringify(fields));
    req.formdata = { urls, Fields };
    next();
};

exports.FormdataValidator = wrapController(FormdataValidator);
