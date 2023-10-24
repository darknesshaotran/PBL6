const dotenv = require('dotenv');
dotenv.config();
const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client, S3 } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    },
});

const uploadFileByS3 = ({ fileName, filePath, ContentType = 'image/jpeg' }) => {
    const parallelUploads3 = new Upload({
        client: s3,
        params: {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: fs.readFileSync(filePath),
            ContentType: ContentType,
        },
        // OPTIONAL
        tags: [
            /*...*/
        ], // optional tags
        queueSize: 4, // optional concurrency configuration
        partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
        leavePartsOnError: false, // optional manually handle dropped parts
    });
    return parallelUploads3.done();
};
exports.uploadFileByS3 = uploadFileByS3;
