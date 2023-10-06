const { createHash } = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
function sha256(content) {
    return createHash('sha256').update(content).digest('hex');
}

const hashPassword = (password) => {
    return sha256(password + process.env.PASSWORD_SECRET);
};
module.exports = hashPassword;
