const dotenv = require('dotenv');
dotenv.config();

const BankModel = require("../models/BankModel");

const common = require("../utlis/common");
const Sres= common.res;

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
                    status: 404,
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
        console.log(req);
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
            res.status(404).json({
                dataStatus: true,
                status: 404,
                message: 'Some error occurred !!!'
            });
        }


    }

    Login = async (req, res, next) => {
        console.log(req);
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
            res.status(404).json({
                dataStatus: true,
                status: 404,
                message: 'Wrong Credentials'
            });
        }


    }
}

module.exports = new BankCtrl;