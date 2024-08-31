const path = require('path');

const express = require('express');
const auth = require("../middleware/auth");

const BankCtrl = require('../controllers/BankCtrl');

const router = express.Router();

router.get('/getAll', auth, BankCtrl.All);
router.post('/addContact', auth, BankCtrl.AddContact);
router.post('/login', auth, BankCtrl.Login);

module.exports = router;