const formidable = require('formidable');
const path = require('path');
const handleUploadImage = async (req) => {
    const form = formidable({
        uploadDir: path.resolve('uploads'), // luu file upload vao duong dan thu muc chi dinh
        // path.resolve('uploads'):  thu-muc-chua-project/uploads (Twitter-clone/uploads)
        maxFiles: 4, // chi cho upload toi da 4 file 1 lan
        keepExtensions: true, //giu lai duoi file extension (png, jpeg,pdf,..)
        maxFileSize: 300 * 1024, // 300KB
        maxTotalFileSize: 300 * 1024 * 4,
        filter: function ({ name, originalFilename, mimetype }) {
            const valid = name === 'image' && Boolean(mimetype?.includes('image'));
            if (!valid) {
                form.emit('error', new Error('file type is not valid'));
            }
            return valid;
        },
    });
    console.log('oken bae');
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            if (!Boolean(files.image)) {
                return reject(new Error('file is empty'));
            }
            resolve(files);
        });
    });
};
exports.handleUploadImage = handleUploadImage;
