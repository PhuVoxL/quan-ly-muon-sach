const express = require('express');
const router = express.Router();
const theoDoiMuonSachController = require('../controllers/theoDoiMuonSach.controller');

router.get('/', theoDoiMuonSachController.findAll);
router.post('/', theoDoiMuonSachController.create);

module.exports = router;