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
router.get('/customerDetbyId', auth, BankCtrl.customerDetbyId);
router.post('/juristicPerUpt', auth, BankCtrl.juristicPerUpt);
router.get('/juristicPerDet', auth, BankCtrl.juristicPerDet);
router.get('/juristicPerDetbyId', auth, BankCtrl.juristicPerDetbyId);
router.post('/loanReqUpt', auth, BankCtrl.loanReqUpt);
router.get('/loanReqDet', auth, BankCtrl.loanReqDet);
router.post('/creditCardReqUpt', auth, BankCtrl.creditCardReqUpt);
router.get('/creditCardReqDet', auth, BankCtrl.creditCardReqDet);
router.post('/upload', auth, BankCtrl.upload);
router.get('/dashboardGet', auth, BankCtrl.dashboardGet);

module.exports = router;