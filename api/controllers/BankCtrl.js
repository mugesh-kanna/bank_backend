const dotenv = require('dotenv');
dotenv.config();

const BankModel = require("../models/BankModel");

const common = require("../utlis/common");
const Sres = common.res;
const nodemailer = require("nodemailer");
const AWS = require('aws-sdk');

class BankCtrl {
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
            res.status(200).json({
                dataStatus: false,
                status: 200,
                message: error.message
            });
        }

    }

    AddContact = async (req, res, next) => {
        const records = req.body.records;
        let result;
        let resp;
        const data = {
            'id': records.id,
            'name': records.name,
            'phone': records.phone,
            'email': records.email
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

        } else {
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
            'email': records.email,
            'password': records.password,
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

        } else {
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
            'email': records.email,
            'url': records.url
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'velantechsolution@gmail.com',
                pass: 'forohlhpcqedeppy',
            },
        });

        let filter_data = common.Objfilter(data);
        result = await BankModel.GetUserId(filter_data);
        if (result.length > 0) {
            let id = result[0]['id'];
            // let url = 'http://localhost:4200/forgot-password?id=' + id;
            let url = filter_data.url + '?id=' + id;
            try {
                const { to, subject, text, html } = req.body;
                const responseEmail = await transporter.sendMail({
                    from: 'velantechsolution@gmail.com',
                    to: filter_data.email,
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
            } catch (err) {
                res.status(200).json({
                    // err,
                    dataStatus: false,
                    status: 200,
                    message: 'Mail Sent Unsuccessfully'
                });
            }
        }
        else {
            res.status(200).json({
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
            'email': records.email,
            'password': records.password,
            'id': records.id
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

        } else {
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
        if (resp == '1' || resp == '3') {
            if (resp == '1') {
                let email = data.email;
                let subject = 'Acknowledgment of Customer Details Submission';
                let name = data.fullName;
                let html = `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Customer Details Acknowledgement</title>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        background-color: #f4f4f4;
                                        margin: 0;
                                        padding: 0;
                                    }
                                    .container {
                                        max-width: 800px;
                                        margin: 20px auto;
                                        background-color: #ffffff;
                                        padding: 20px;
                                        border-radius: 8px;
                                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                    }
                                    h1 {
                                        color: #333;
                                        font-size: 24px;
                                    }
                                    p {
                                        font-size: 16px;
                                        color: #555;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <h1>Acknowledgement of Customer Details Submission</h1>
                                    
                                    <p>Dear ${name},</p>
                                    
                                    <p>Thank you for submitting your details. We have successfully received the application. We will review your details and get back to you shortly.</p>
                                </div>
                            </body>
                            </html>
                            `;
                this.sendEmail(email, subject, html);
            }
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Saved Successfully'
            });
        }
        else if (resp == '2') {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Deleted Successfully'
            });
        }
        else if (resp == '4') {
            let email = result.email;
            let subject = 'Acknowledgment of Customer Details Approved';
            let name = result.fullName;
            let html = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Acknowledgment of Customer Details Approved</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                }
                                .container {
                                    max-width: 800px;
                                    margin: 20px auto;
                                    background-color: #ffffff;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                h1 {
                                    color: #333;
                                    font-size: 24px;
                                }
                                p {
                                    font-size: 16px;
                                    color: #555;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>Acknowledgment of Customer Details Approved</h1>
                                
                                <p>Dear ${name},</p>

                                <p>We are excited to inform you that your application has been successfully reviewed and <strong>approved</strong>!</p>
        
                                <p>Here are the key details of your approved application:</p>
                                
                                <ul>
                                    <li><strong>Customer ID:</strong> ${result.customer_id}</li>
                                    <li><strong>Password:</strong> ${result.password}</li>
                                </ul>

                                <p>Please use your Cutomer ID and Password to access the portal. Thank You.</p>
                                
                            </div>
                        </body>
                        </html>
                        `;
            this.sendEmail(email, subject, html);
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Approved Successfully'
            });
        }
        else if (resp == '5') {
            let email = result.email;
            let subject = 'Acknowledgment of Customer Details Rejected';
            let name = result.fullName;
            let html = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Acknowledgment of Customer Details Rejected</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                }
                                .container {
                                    max-width: 800px;
                                    margin: 20px auto;
                                    background-color: #ffffff;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                h1 {
                                    color: #333;
                                    font-size: 24px;
                                }
                                p {
                                    font-size: 16px;
                                    color: #555;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>Acknowledgment of Customer Details Rejected</h1>
                                
                                <p>Dear ${name},</p>

                                <p>We regret to inform you that your application has been reviewed and <strong>rejected</strong>!</p>
        
                                <p>We understand this may be disappointing.</p>
                                
                                <p>If you have any questions or would like further clarification regarding the decision, please do not hesitate to reach out to our support team at velantechsolution@gmail.com.</p>

                                <p>Thank you for your interest, and we encourage you to apply again in the future.</p>
                                
                            </div>
                        </body>
                        </html>
                        `;
            this.sendEmail(email, subject, html);
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Rejected Successfully'
            });
        }
        else {
            res.status(200).json({
                dataStatus: false,
                status: 200,
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
            res.status(200).json({
                dataStatus: false,
                status: 200,
                message: error.message
            });
        }

    }

    customerDetbyId = async (req, res, next) => {
        try {

            const id = req.query.id;

            const result = await BankModel.customerDetbyId(id);

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
            res.status(200).json({
                dataStatus: false,
                status: 200,
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
        if (resp == '1' || resp == '3') {
            if (resp == '1') {
                let email = data.email;
                let subject = 'Acknowledgment of Juristic Person Details Submission';
                let name = data.fullName;
                let html = `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Juristic Person Details Acknowledgement</title>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        background-color: #f4f4f4;
                                        margin: 0;
                                        padding: 0;
                                    }
                                    .container {
                                        max-width: 800px;
                                        margin: 20px auto;
                                        background-color: #ffffff;
                                        padding: 20px;
                                        border-radius: 8px;
                                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                    }
                                    h1 {
                                        color: #333;
                                        font-size: 24px;
                                    }
                                    p {
                                        font-size: 16px;
                                        color: #555;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <h1>Acknowledgement of Juristic Person Details Submission</h1>
                                    
                                    <p>Dear ${name},</p>
                                    
                                    <p>Thank you for submitting your details. We have successfully received the application. We will review your details and get back to you shortly.</p>
                                </div>
                            </body>
                            </html>
                            `;
                this.sendEmail(email, subject, html);
            }
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Saved Successfully'
            });
        }
        else if (resp == '2') {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Deleted Successfully'
            });
        }
        else if (resp == '4') {
            let email = result.email;
            let subject = 'Acknowledgment of Juristic Person Details Approved';
            let name = result.fullName;
            let html = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Acknowledgment of Juristic Person Details Approved</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                }
                                .container {
                                    max-width: 800px;
                                    margin: 20px auto;
                                    background-color: #ffffff;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                h1 {
                                    color: #333;
                                    font-size: 24px;
                                }
                                p {
                                    font-size: 16px;
                                    color: #555;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>Acknowledgment of Juristic Person Details Approved</h1>
                                
                                <p>Dear ${name},</p>

                                <p>We are excited to inform you that your application has been successfully reviewed and <strong>approved</strong>!</p>
        
                                <p>Here are the key details of your approved application:</p>
                                
                                <ul>
                                    <li><strong>Customer ID:</strong> ${result.customer_id}</li>
                                    <li><strong>Password:</strong> ${result.password}</li>
                                </ul>

                                <p>Please use your Cutomer ID and Password to access the portal. Thank You.</p>
                                
                            </div>
                        </body>
                        </html>
                        `;
            this.sendEmail(email, subject, html);
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Approved Successfully'
            });
        }
        else if (resp == '5') {
            let email = result.email;
            let subject = 'Acknowledgment of Juristic Person Details Rejected';
            let name = result.fullName;
            let html = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Acknowledgment of Juristic Person Details Rejected</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                }
                                .container {
                                    max-width: 800px;
                                    margin: 20px auto;
                                    background-color: #ffffff;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                h1 {
                                    color: #333;
                                    font-size: 24px;
                                }
                                p {
                                    font-size: 16px;
                                    color: #555;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>Acknowledgment of Juristic Person Details Rejected</h1>
                                
                                <p>Dear ${name},</p>

                                <p>We regret to inform you that your application has been reviewed and <strong>rejected</strong>!</p>
        
                                <p>We understand this may be disappointing.</p>
                                
                                <p>If you have any questions or would like further clarification regarding the decision, please do not hesitate to reach out to our support team at velantechsolution@gmail.com.</p>

                                <p>Thank you for your interest, and we encourage you to apply again in the future.</p>
                                
                            </div>
                        </body>
                        </html>
                        `;
            this.sendEmail(email, subject, html);
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Rejected Successfully'
            });
        }
        else {
            res.status(200).json({
                dataStatus: false,
                status: 200,
                message: 'Unable to Update'
            });
        }
    }

    juristicPerDet = async (req, res, next) => {
        try {

            const result = await BankModel.juristicPerDet();

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
            res.status(200).json({
                dataStatus: false,
                status: 200,
                message: error.message
            });
        }
    }

    juristicPerDetbyId = async (req, res, next) => {
        try {

            const id = req.query.id;

            const result = await BankModel.juristicPerDetbyId(id);

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
            res.status(200).json({
                dataStatus: false,
                status: 200,
                message: error.message
            });
        }

    }

    loanReqUpt = async (req, res, next) => {
        const records = req.body.records;
        let result;
        let resp;
        const data = records;
        const tbl_name = 'loan_request_details';
        // let filter_data = common.Objfilter(data);
        result = await BankModel.loanReqUpt(data, tbl_name);

        resp = result.data;
        if (resp == '1') {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Saved Successfully'
            });

        }
        else if (resp == '2') {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Deleted Successfully'
            });
        }
        else if (resp == '4') {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Approved Successfully'
            });
        }
        else if (resp == '5') {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Rejected Successfully'
            });
        }
        else {
            res.status(200).json({
                dataStatus: false,
                status: 200,
                message: 'Unable to Update'
            });
        }
    }

    loanReqDet = async (req, res, next) => {
        try {

            const result = await BankModel.loanReqDet();

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
            res.status(200).json({
                dataStatus: false,
                status: 200,
                message: error.message
            });
        }
    }

    creditCardReqUpt = async (req, res, next) => {
        const records = req.body.records;
        let result;
        let resp;
        const data = records;
        const tbl_name = 'creditcard_request_details';
        // let filter_data = common.Objfilter(data);
        result = await BankModel.creditCardReqUpt(data, tbl_name);

        resp = result.data;
        if (resp == '1') {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Saved Successfully'
            });

        }
        else if (resp == '2') {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Deleted Successfully'
            });
        }
        else if (resp == '4') {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Approved Successfully'
            });
        }
        else if (resp == '5') {
            res.status(200).json({
                dataStatus: true,
                status: 200,
                message: 'Rejected Successfully'
            });
        }
        else {
            res.status(200).json({
                dataStatus: false,
                status: 200,
                message: 'Unable to Update'
            });
        }
    }

    creditCardReqDet = async (req, res, next) => {
        try {

            const result = await BankModel.creditCardReqDet();

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
            res.status(200).json({
                dataStatus: false,
                status: 200,
                message: error.message
            });
        }
    }

    upload = async (req, res, next) => {

        const s3 = new AWS.S3({
            accessKeyId: 'AKIAZAI4HHM4UJASQLX7',
            secretAccessKey: 'yX6/SbU75NEhXmUVWvsak0UgUuoCBCqgaowWFskm',
            region: 'ap-south-1', // Replace with your desired region
            bucketName: 'bankingbackend' // Replace with your bucket name
        });
        const records = req.body;
        const filename = req.headers['x-filename'];

        try {
            // const originalFileName = records.file.originalname;
            const params = {
                Bucket: s3.config.bucketName,
                Key: filename,
                Body: records
            };

            const uploadResult = await s3.upload(params).promise();

            res.status(200).json({ dataStatus: true, message: 'File uploaded successfully!', data: uploadResult });
        } catch (error) {
            console.error(error);
            res.status(200).json({ dataStatus: false, error: 'Error uploading file' });
        }
    }

    sendEmail = async (email, subject, html) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'velantechsolution@gmail.com',
                pass: 'forohlhpcqedeppy',
            },
        });

        try {
            const responseEmail = await transporter.sendMail({
                from: 'velantechsolution@gmail.com',
                to: email,
                subject: subject,
                // text: 'Hello ',
                html: html,
            });
            // res.status(200).json({
            //     // responseEmail,
            //     dataStatus: true,
            //     status: 200,
            //     message: 'Mail Sent Successfully'
            // });
        } catch (err) {
            // res.status(200).json({
            //     // err,
            //     dataStatus: false,
            //     status: 200,
            //     message: 'Mail Sent Unsuccessfully'
            // });
        }
    }
}

module.exports = new BankCtrl;