const path = require('path');
const url = require('url');
const fs = require('fs');

// Multer
const multer = require('multer');

// Jimp
const jimp = require('jimp');

// Custom helper
const { uniqueFileName } = require('./custom');

const upload = (fields, mimeTypes = [], folder = '') => {
    return multer({
        storage: multer.diskStorage({
            destination: ((req, file, cb) => {
                let dirPath = 'public/uploads';
                if (file.fieldname == 'avatar') {
                    dirPath += '/profile';
                } else {
                    dirPath += `/${folder}`;
                }

                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                cb(null, dirPath);
            }),
            filename: ((req, file, cb) => {
                let fileName = uniqueFileName(file.fieldname);
                fileName += path.extname(url.parse(file.originalname).pathname);

                cb(null, fileName);
            })
        }),
        fileFilter: (req, file, cb) => {
            if (mimeTypes.includes(file.mimetype) || mimeTypes.length === 0) {
                cb(null, true);
            } else {
                // cb('Wrong file type!', null);
                req.fileValidationError = 'Wrong file type!';
                return cb(null, false, req.fileValidationError);
            }
        },
        limits: { fieldSize: '50MB' }
    }).fields(fields);
}

const thumbnail = async (imagePath, destination, filename, width = 256, height = jimp.AUTO, n = 60) => {
    try {
        const image = await jimp.read(imagePath);
        image.resize(width, height); // resize the image. Jimp.AUTO can be passed as one of the values.
        image.quality(n); // set the quality of saved JPEG, 0 - 100
        // image.mask(src, x, y); // masks the image with another Jimp image at x, y using average pixel value

        let newImagePath = destination + '/thumb/';
        if (!fs.existsSync(newImagePath)) {
            fs.mkdirSync(newImagePath);
        }
        newImagePath += filename;
        await image.writeAsync(newImagePath); // save to final destination path
        return newImagePath;
    } catch (error) {
        console.error({ error });
    }
}

module.exports = {
    upload,
    thumbnail
};