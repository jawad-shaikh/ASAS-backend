const path = require('path');
const multer = require('multer');

// user-profile
const userProfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/user-profiles');
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const finalFilename = `${file.fieldname}-${Date.now()}${fileExt}`;
    cb(null, finalFilename);
  },
});

const userProfileFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG files are allowed!'), false);
  }
};

// activity-thumbnails
const activityThumbnailsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/activity-thumbnails');
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const finalFilename = `${file.fieldname}-${Date.now()}${fileExt}`;
    cb(null, finalFilename);
  },
});

const activityThumbnailsFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG files are allowed!'), false);
  }
};

// proof-of-payment
const proofOfPaymentsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/proof-of-payment');
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const finalFilename = `${file.fieldname}-${Date.now()}${fileExt}`;
    cb(null, finalFilename);
  },
});

const proofOfPaymentsFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG files are allowed!'), false);
  }
};

module.exports = {
  userProfileMiddleware: [userProfileStorage, userProfileFileFilter],
  activityThumbnailMiddleware: [activityThumbnailsStorage, activityThumbnailsFileFilter],
  proofOfPaymentMiddleware: [proofOfPaymentsStorage, proofOfPaymentsFileFilter],
};
