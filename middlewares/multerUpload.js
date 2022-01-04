const multer = require('multer');
const moment = require('moment');

exports.upload = multer({
    // Use storage to store the files
    storage: multer.diskStorage ( {
        destination: (req, file, cb) => {
            cb(null, './audioFiles');
        },
        filename: function (req, file, callback) {
            const date = moment().format();
            callback(null, `${date}-${file.originalname}`);
        }
    })
});