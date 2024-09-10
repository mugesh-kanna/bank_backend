const path = require('path');

const express = require('express');
const auth = require("../middleware/auth");

const BankCtrl = require('../controllers/BankCtrl');

const router = express.Router();

router.get('/getAll', auth, BankCtrl.All);
router.post('/addContact', auth, BankCtrl.AddContact);
router.post('/login', auth, BankCtrl.Login);
router.post('/forgotPassword', auth, BankCtrl.ForgotPassword);
router.post('/resetPassword', auth, BankCtrl.ResetPassword);
router.post('/customerUpt', auth, BankCtrl.customerUpt);
router.get('/customerDet', auth, BankCtrl.customerDet);

module.exports = router;