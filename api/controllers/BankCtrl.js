const dotenv = require('dotenv');
dotenv.config();

const BankModel = require("../models/BankModel");

const common = require("../utlis/common");
const Sres= common.res;
const nodemailer = require("nodemailer");

class BankCtrl{
    All = async (req, res, next) => {
        try {
   
            const result = await BankModel.GetAll();
    
            let data = common.empty(result);
            if (!data) {
                res.status(200).json({
                    dataStatus: true,
                    status: 200,
                    result: Sres(result)
                })
            } else {
                const error = new Error("No Data Found");
                res.status(200).json({
                    dataStatus: false,
                    status: 200,
                    message: error.message
                });

            }

        } catch (error) {
            res.status(500).json({
                dataStatus: false,
                status: 500,
                message: error.message 
            });
        }

    }

    AddContact = async (req, res, next) => {
        const records = req.body.records;
        let result;
        let resp;
        const data = {
            'id':records.id,
            'name':records.name,
            'phone':records.phone,
            'email':records.email
        }

        const tbl_name = 'users';

        let filter_data = common.Objfilter(data);
        result = await BankModel.AddContact(filter_data, tbl_name);
            
        resp = result.data;

        if (resp == '1') {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Inserted Successfully'
            });

        }else {
            res.status(200).json({
                dataStatus: false,
                status: 200,
                message: 'Some error occurred !!!'
            });
        }


    }

    Login = async (req, res, next) => {
        const records = req.body.records;
        let result;
        let resp;
        const data = {
            'email':records.email,
            'password':records.password,
        }

        const tbl_name = 'users';

        let filter_data = common.Objfilter(data);
        result = await BankModel.Login(filter_data, tbl_name);
            
        resp = result;

        if (resp != "") {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Login Successfully'
            });

        }else {
            res.status(200).json({
                dataStatus: false,
                status: 200,
                message: 'Wrong Credentials'
            });
        }
    }

    ForgotPassword = async (req, res, next) => {
        const records = req.body.records;
        let result;
        let resp;
        const data = {
            'email':records.email,
            'url': records.url
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'mugeshkanna030@gmail.com',
              pass: 'nvcdlrnfkgguzdnw',
            },
          });

        let filter_data = common.Objfilter(data);
        result = await BankModel.GetUserId(filter_data);        
        if(result.length > 0){
            let id = result[0]['id'];
            // let url = 'http://localhost:4200/forgot-password?id=' + id;
            let url = filter_data.url + '?id=' + id;
            try{
                const { to, subject, text, html } = req.body;
                  const responseEmail = await transporter.sendMail({
                    from: 'mugeshkanna030@gmail.com',
                    to: 'gmkanna532000@gmail.com',
                    subject: 'Reset Your Password',
                    // text: 'Hello ',
                    html: "<h2>Forgot Your Password?</h2> <h4>That's ok, it happens! Cick on the link below to reset your password.</h4><a href='" + url + "' style='color: blue;'>Reset Your Password</a>",
                  });
                res.status(200).json({ 
                    // responseEmail,
                    dataStatus: true,
                    status: 200,
                    message: 'Mail Sent Successfully'
                });
               }catch(err){
                 res.status(400).json({
                    // err,
                    dataStatus: false,
                    status: 200,
                    message: 'Mail Sent Unsuccessfully'
                });
              }
        }
        else{
            res.status(400).json({
                // err,
                dataStatus: false,
                status: 200,
                message: 'Unable to find the user Email'
            });
        }
    }

    ResetPassword = async (req, res, next) => {
        const records = req.body.records;
        let result;
        let resp;
        const data = {
            'email':records.email,
            'password':records.password,
        }

        const tbl_name = 'users';

        let filter_data = common.Objfilter(data);
        result = await BankModel.ResetPassword(filter_data, tbl_name);
            
        resp = result;

        if (resp == "1") {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Reset Successfully'
            });

        }else {
            res.status(200).json({
                dataStatus: false,
                status: 200,
                message: 'Unable to Reset'
            });
        }
    }

    customerUpt = async (req, res, next) => {
        const records = req.body.records;
        let result;
        let resp;
        const data = records;
        const tbl_name = 'customer_management';
        // let filter_data = common.Objfilter(data);
        result = await BankModel.customerUpt(data, tbl_name);
            
        resp = result.data;
        console.log(result);
        if (resp == '1') {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Saved Successfully'
            });

        }else {
            res.status(404).json({
                dataStatus: false,
                status: 404,
                message: 'Unable to Update'
            });
        }
    }

    customerDet = async (req, res, next) => {
        try {
   
            const result = await BankModel.customerDet();
    
            let data = common.empty(result);
            if (!data) {
                res.status(200).json({
                    dataStatus: true,
                    status: 200,
                    result: Sres(result)
                })
            } else {
                const error = new Error("No Data Found");
                res.status(200).json({
                    dataStatus: false,
                    status: 200,
                    message: error.message
                });

            }

        } catch (error) {
            res.status(500).json({
                dataStatus: false,
                status: 500,
                message: error.message 
            });
        }

    }

    juristicPerUpt = async (req, res, next) => {
        const records = req.body.records;
        let result;
        let resp;
        const data = records;
        const tbl_name = 'juristic_person_details';
        // let filter_data = common.Objfilter(data);
        result = await BankModel.juristicPerUpt(data, tbl_name);
            
        resp = result.data;
        console.log(result);
        if (resp == '1') {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Saved Successfully'
            });

        }else {
            res.status(404).json({
                dataStatus: false,
                status: 404,
                message: 'Unable to Update'
            });
        }
    }
}

module.exports = new BankCtrl;