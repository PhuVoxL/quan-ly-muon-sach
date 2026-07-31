const express = require('express');
const router = express.Router();
const theoDoiMuonSachController = require('../controllers/theoDoiMuonSach.controller');

router.get('/', theoDoiMuonSachController.findAll);
router.post('/', theoDoiMuonSachController.create);

router.put('/:id', theoDoiMuonSachController.update);
router.delete('/:id', theoDoiMuonSachController.delete);

module.exports = router;