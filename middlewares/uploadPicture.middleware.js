const { okResponse } = require('generic-response');

const multer = require('multer');
const cloudinary = require('@/configs/cloudinary.config');

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image');

const uploadImage = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    try {
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: 'auto',
      });

      const response = okResponse({ imageUrl: result.secure_url });
      return return res.status(response.status.code).json(response);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  });
};

module.exports = uploadImage;
