const express = require('express');
const router = express.Router();
const productsHandler = require('../handlers/productsHandler.js');
const multer = require('multer');
const path = require('path');

const upload = multer({
  storage: multer.diskStorage({ 
      destination(req, file, done) { 
          done(null, 'images/'); 
      },
      filename(req, file, done) { 
          const ext = path.extname(file.originalname); 
          done(null, path.basename(file.originalname, ext) + Date.now() + ext); 
      }
  }),
  limits: { fileSize: 1 * 1024 * 1024 } 
});

router.get('/list', productsHandler.list);
router.get('/category/:productClass', productsHandler.productClass);
router.get('/registration', productsHandler.registration);
router.post('/registrationProcess',upload.single('productImg'), productsHandler.registrationProcess);
router.get('/:productNum', productsHandler.productNum);
router.get('/:productNum/delete', productsHandler.deletewrite);

module.exports = router;


