const db = require('../config/database');

class BankModel{
    GetAll = () => {
        let sql = `Select * from users`;
        return db(sql);
    }

    AddContact = async (data, tbl_name) => {
        let result = {};
        try {
            let sql = "INSERT INTO " + tbl_name + "(`id`, `name`, `phone`, `email`) VALUES (" + data.id + ",'" + data.name + "'," + data.phone + ",'" + data.email + "')";
            console.log(sql);
            const id = await db(sql);
            result.data = '1';
            return result;
        } catch (error) {
            result.message = error.sqlMessage;
            result.data = '3';
            return result;
        }
    }

    Login = async (data, tbl_name) => {
        let result = {};
        try {
            let sql = "SELECT * from " + tbl_name + " WHERE email = '" + data.email + "' and password = '" + data.password + "'";
            console.log(sql);
            return db(sql);
        } catch (error) {
            result.message = error.sqlMessage;
            result = '';
            return result;
        }
    }
}

module.exports = new BankModel;