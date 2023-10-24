// var formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { uploadFileByS3 } = require('./s3');

const handleUploadImage = async (req) => {
    const formidable = (await import('formidable')).default;
    const form = formidable({
        multiples: true,
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
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            if (!Boolean(files.image)) {
                return reject(new Error('file is empty'));
            }
            if (Array.isArray(files.image)) {
                resolve(files.image);
            }
            resolve([files.image]);
        });
    });
};

const upLoadSingleImage = async (datas) => {
    const data = datas[0];
    const newName = data.newFilename.split('.')[0] + '.jpg';
    const newPath = path.resolve('uploads/temp/') + `/` + newName;
    await sharp(data.filepath).jpeg({ quality: 80 }).toFile(newPath);
    fs.unlinkSync(data.filepath);
    fs.unlinkSync(newPath);
    const s3Result = await uploadFileByS3({
        fileName: newName,
        filePath: newPath,
    });
    return {
        url: s3Result.Location,
    };
};
const uploadMultiImage = async (data) => {
    const results = Promise.all(
        data.map(async (file) => {
            const newName = file.newFilename.split('.')[0] + '.jpg';
            await sharp(file.filepath)
                .jpeg({ quality: 80 })
                .toFile(path.resolve('uploads/temp/') + `/` + newName);
            fs.unlinkSync(file.filepath);
            const s3Result = await uploadFileByS3({
                fileName: newName,
                filePath: path.resolve('uploads/temp/') + `/` + newName,
            });
            return {
                url: s3Result.Location,
            };
        }),
    );

    return results;
};

exports.handleUploadImage = handleUploadImage;
exports.upLoadSingleImage = upLoadSingleImage;
exports.uploadMultiImage = uploadMultiImage;
