const db = require('../config/database');

class BankModel{
    GetAll = () => {
        let sql = `Select * from users`;
        console.log(sql);
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

    GetUserId = async (data, tbl_name) => {
        let result = {};
        try {
            let sql = "SELECT * from users WHERE email = '" + data.email + "'";
            console.log(sql);
            return db(sql);
        } catch (error) {
            result.message = error.sqlMessage;
            result = '';
            return result;
        }
    }

    ResetPassword = async (data, tbl_name) => {
        let result = {};
        try {
            let sql = "UPDATE users set password = '" + data.password + "' WHERE email = '" + data.email + "'";
            return 1;
        } catch (error) {
            result.message = error.sqlMessage;
            result = '';
            return result;
        }
    }

    customerUpt = async (data, tbl_name) => {
        let id = data?.id;
        try {
            delete data?.id;
            if (!id) {
                // Insert new data if no id is present
                let sql = `INSERT INTO ${tbl_name} 
                    (fullName, email, gender, mobileNumber, dateOfBirth, streetAddress, streetAddress2, city, state, postalCode, 
                    companyName, industryType, designation, incomePerMonth, cardNo, citizen_document, passport, passport_upload, 
                    household_registration, registration_document, government_issued, government_issued_doc, idNo, bank_statement_doc) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
                let params = [
                    data.fullName, data.email, data.gender, data.mobileNumber, data.dateOfBirth, data.streetAddress,
                    data.streetAddress2, data.city, data.state, data.postalCode, data.companyName, data.industryType,
                    data.designation, data.incomePerMonth, data.cardNo, data.citizen_document, data.passport, data.passport_upload,
                    data.household_registration, data.registration_document, data.government_issued, data.government_issued_doc,
                    data.idNo, data.bank_statement_doc
                ];
                
                console.log(sql, params);
                const result = await db(sql, params);
                result.data = '1';
                return result;
            } else {
                // Update existing record if id exists
                let sql = `UPDATE ${tbl_name} SET 
                    fullName = ?, email = ?, gender = ?, mobileNumber = ?, dateOfBirth = ?, streetAddress = ?, streetAddress2 = ?, 
                    city = ?, state = ?, postalCode = ?, companyName = ?, industryType = ?, designation = ?, incomePerMonth = ?, 
                    cardNo = ?, citizen_document = ?, passport = ?, passport_upload = ?, household_registration = ?, 
                    registration_document = ?, government_issued = ?, government_issued_doc = ?, idNo = ?, bank_statement_doc = ? 
                    WHERE id = ?`;
    
                let params = [
                    data.fullName, data.email, data.gender, data.mobileNumber, data.dateOfBirth, data.streetAddress,
                    data.streetAddress2, data.city, data.state, data.postalCode, data.companyName, data.industryType,
                    data.designation, data.incomePerMonth, data.cardNo, data.citizen_document, data.passport, data.passport_upload,
                    data.household_registration, data.registration_document, data.government_issued, data.government_issued_doc,
                    data.idNo, data.bank_statement_doc, id
                ];
    
                console.log(sql, params);
                const result = await db(sql, params);
                result.data = '1';
                return result;
            }    
        } catch (error) {
            const result = {};
            result.data = '3';
            return result;
        }
    }

    customerDet = () => {
        let sql = `Select * from customer_management`;
        console.log(sql);
        return db(sql);
    }
    
}

module.exports = new BankModel;