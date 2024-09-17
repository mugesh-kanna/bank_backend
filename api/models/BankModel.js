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
            let sql = "UPDATE users set password = '" + data.password + "' WHERE id = '" + data.id + "'";
            let result = await db(sql);
            return result.affectedRows;
        } catch (error) {
            result.message = error.sqlMessage;
            result = '';
            return result;
        }
    }

    customerUpt = async (data, tbl_name) => {
        let id = data?.id;
        let status = data?.status;
        try {
            delete data?.id;
            if(status == '1'){
                let sql = "UPDATE customer_management SET isactive = ? WHERE id = ?";
                let params = [0, id];
                const result = await db(sql, params);
                result.data = '2';
            }
            else{
                if (!id) {
                    // Insert new data if no id is present
                    let sql = `INSERT INTO ${tbl_name} 
                        (fullName, email, gender, mobileNumber, dateOfBirth, streetAddress, streetAddress2, city, state, postalCode, 
                        profilePhoto, 
                        companyName, industryType, designation, incomePerMonth, cardNo, citizen_document, passport, passport_upload, 
                        household_registration, registration_document, government_issued, government_issued_doc, idNo, bank_statement_doc) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
                    let params = [
                        data.fullName, data.email, data.gender, data.mobileNumber, data.dateOfBirth, data.streetAddress,
                        data.streetAddress2, data.city, data.state, data.postalCode, data.profilePhoto, data.companyName, data.industryType,
                        data.designation, data.incomePerMonth, data.cardNo, data.citizen_document, data.passport, data.passport_upload,
                        data.household_registration, data.registration_document, data.government_issued, data.government_issued_doc,
                        data.idNo, data.bank_statement_doc
                    ];
                    
                    const result = await db(sql, params);
                    result.data = '1';
                    return result;
                } else {
                    // Update existing record if id exists
                    let sql = `UPDATE ${tbl_name} SET 
                        fullName = ?, email = ?, gender = ?, mobileNumber = ?, dateOfBirth = ?, streetAddress = ?, streetAddress2 = ?, 
                        city = ?, state = ?, postalCode = ?, profilePhoto = ?, companyName = ?, industryType = ?, designation = ?, incomePerMonth = ?, 
                        cardNo = ?, citizen_document = ?, passport = ?, passport_upload = ?, household_registration = ?, 
                        registration_document = ?, government_issued = ?, government_issued_doc = ?, idNo = ?, bank_statement_doc = ? 
                        WHERE id = ?`;
        
                    let params = [
                        data.fullName, data.email, data.gender, data.mobileNumber, data.dateOfBirth, data.streetAddress,
                        data.streetAddress2, data.city, data.state, data.postalCode, data.profilePhoto, data.companyName, data.industryType,
                        data.designation, data.incomePerMonth, data.cardNo, data.citizen_document, data.passport, data.passport_upload,
                        data.household_registration, data.registration_document, data.government_issued, data.government_issued_doc,
                        data.idNo, data.bank_statement_doc, id
                    ];
        
                    const result = await db(sql, params);
                    result.data = '1';
                    return result;
                }
            }   
        } catch (error) {
            const result = {};
            result.data = '3';
            return result;
        }
    }

    customerDet = () => {
        let sql = `Select * from customer_management WHERE isactive = 1`;
        return db(sql);
    }

    juristicPerUpt = async (data, tbl_name) => {
        let id = data?.id;
        let status = data?.status;
        try {
            delete data?.id;
            if(status == '1'){
                let sql = "UPDATE juristic_person_details SET isactive = ? WHERE id = ?";
                let params = [0, id];
                const result = await db(sql, params);
                result.data = '2';
                return result;
            }
            else{
                if (!id) {
                    // Insert new data if no id is present
                    let sql = `INSERT INTO ${tbl_name} 
                        (fullName, email, gender, mobileNumber, dateOfBirth, streetAddress, streetAddress2, city, state, postalCode, 
                        profilePhoto, 
                        companyName, industryType, designation, incomePerMonth, cardNo, citizen_document, passport, passport_upload, 
                        household_registration, registration_document, government_issued, government_issued_doc, idNo, bank_statement_doc) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
                    let params = [
                        data.fullName, data.email, data.gender, data.mobileNumber, data.dateOfBirth, data.streetAddress,
                        data.streetAddress2, data.city, data.state, data.postalCode, data.profilePhoto, data.companyName, data.industryType,
                        data.designation, data.incomePerMonth, data.cardNo, data.citizen_document, data.passport, data.passport_upload,
                        data.household_registration, data.registration_document, data.government_issued, data.government_issued_doc,
                        data.idNo, data.bank_statement_doc
                    ];
                    
                    const result = await db(sql, params);
                    result.data = '1';
                    return result;
                } else {
                    // Update existing record if id exists
                    let sql = `UPDATE ${tbl_name} SET 
                        fullName = ?, email = ?, gender = ?, mobileNumber = ?, dateOfBirth = ?, streetAddress = ?, streetAddress2 = ?, 
                        city = ?, state = ?, postalCode = ?, profilePhoto = ?, companyName = ?, industryType = ?, designation = ?, incomePerMonth = ?, 
                        cardNo = ?, citizen_document = ?, passport = ?, passport_upload = ?, household_registration = ?, 
                        registration_document = ?, government_issued = ?, government_issued_doc = ?, idNo = ?, bank_statement_doc = ? 
                        WHERE id = ?`;
        
                    let params = [
                        data.fullName, data.email, data.gender, data.mobileNumber, data.dateOfBirth, data.streetAddress,
                        data.streetAddress2, data.city, data.state, data.postalCode, data.profilePhoto, data.companyName, data.industryType,
                        data.designation, data.incomePerMonth, data.cardNo, data.citizen_document, data.passport, data.passport_upload,
                        data.household_registration, data.registration_document, data.government_issued, data.government_issued_doc,
                        data.idNo, data.bank_statement_doc, id
                    ];
        
                    const result = await db(sql, params);
                    result.data = '1';
                    return result;
                }
            }    
        } catch (error) {
            const result = {};
            result.data = '3';
            return result;
        }
    }

    juristicPerDet = () => {
        let sql = `Select * from juristic_person_details WHERE isactive = 1`;
        return db(sql);
    }

    loanReqUpt = async (data, tbl_name) => {
        let id = data?.id;
        let status = data?.status;
        try {
            delete data?.id;
            if(status == '1'){
                let sql = "UPDATE loan_request_details SET isactive = ? WHERE id = ?";
                let params = [0, id];
                const result = await db(sql, params);
                result.data = '2';
                return result;
            }
            else if(status == '2' || status == '3'){
                let sql = "UPDATE loan_request_details SET approve_sts = ? WHERE id = ?";
                let params = [status == '2' ? 1 : 2, id];
                const result = await db(sql, params);
                result.data = (status == '2') ? '4' : '5';
                return result;
            }
            else{
                if (!id) {
                    // Insert new data if no id is present
                    let sql = `INSERT INTO ${tbl_name} 
                        (fullName, email, gender, mobileNumber, dateOfBirth, streetAddress, streetAddress2, city, state, postalCode, 
                        profilePhoto, 
                        companyName, industryType, designation, incomePerMonth, cardNo, citizen_document, passport, passport_upload, 
                        household_registration, registration_document, government_issued, government_issued_doc, idNo, bank_statement_doc,
                        loanType, loanTenure, loanAmount, purpose, collateral) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
                    let params = [
                        data.fullName, data.email, data.gender, data.mobileNumber, data.dateOfBirth, data.streetAddress,
                        data.streetAddress2, data.city, data.state, data.postalCode, data.profilePhoto, data.companyName, data.industryType,
                        data.designation, data.incomePerMonth, data.cardNo, data.citizen_document, data.passport, data.passport_upload,
                        data.household_registration, data.registration_document, data.government_issued, data.government_issued_doc,
                        data.idNo, data.bank_statement_doc, data.loanType, data.loanTenure, data.loanAmount, data.purpose, data.collateral
                    ];
                    
                    const result = await db(sql, params);
                    result.data = '1';
                    return result;
                } else {
                    // Update existing record if id exists
                    let sql = `UPDATE ${tbl_name} SET 
                        fullName = ?, email = ?, gender = ?, mobileNumber = ?, dateOfBirth = ?, streetAddress = ?, streetAddress2 = ?, 
                        city = ?, state = ?, postalCode = ?, profilePhoto = ?, companyName = ?, industryType = ?, designation = ?, incomePerMonth = ?, 
                        cardNo = ?, citizen_document = ?, passport = ?, passport_upload = ?, household_registration = ?, 
                        registration_document = ?, government_issued = ?, government_issued_doc = ?, idNo = ?, bank_statement_doc = ?,
                        loanType = ?, loanTenure = ?, loanAmount = ?, purpose = ?, collateral = ?
                        WHERE id = ?`;
        
                    let params = [
                        data.fullName, data.email, data.gender, data.mobileNumber, data.dateOfBirth, data.streetAddress,
                        data.streetAddress2, data.city, data.state, data.postalCode, data.profilePhoto, data.companyName, data.industryType,
                        data.designation, data.incomePerMonth, data.cardNo, data.citizen_document, data.passport, data.passport_upload,
                        data.household_registration, data.registration_document, data.government_issued, data.government_issued_doc,
                        data.idNo, data.bank_statement_doc, data.loanType, data.loanTenure, data.loanAmount, data.purpose, data.collateral, id
                    ];
        
                    const result = await db(sql, params);
                    result.data = '1';
                    return result;
                }
            }    
        } catch (error) {
            const result = {};
            result.data = '3';
            return result;
        }
    }

    loanReqDet = () => {
        let sql = `Select * from loan_request_details WHERE isactive = 1`;
        return db(sql);
    }

    creditCardReqUpt = async (data, tbl_name) => {
        let id = data?.id;
        let status = data?.status;
        try {
            delete data?.id;
            if(status == '1'){
                let sql = "UPDATE creditcard_request_details SET isactive = ? WHERE id = ?";
                let params = [0, id];
                const result = await db(sql, params);
                result.data = '2';
                return result;
            }
            else if(status == '2' || status == '3'){
                let sql = "UPDATE creditcard_request_details SET approve_sts = ? WHERE id = ?";
                let params = [status == '2' ? 1 : 2, id];
                const result = await db(sql, params);
                result.data = (status == '2') ? '4' : '5';
                return result;
            }
            else{
                if (!id) {
                    // Insert new data if no id is present
                    let sql = `INSERT INTO ${tbl_name} 
                        (fullName, email, gender, mobileNumber, dateOfBirth, streetAddress, streetAddress2, city, state, postalCode, 
                        profilePhoto, 
                        companyName, industryType, designation, incomePerMonth, cardNo, citizen_document, passport, passport_upload, 
                        household_registration, registration_document, government_issued, government_issued_doc, idNo, bank_statement_doc,
                        annualIncome, creditLimit, creditCardPurpose) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
                    let params = [
                        data.fullName, data.email, data.gender, data.mobileNumber, data.dateOfBirth, data.streetAddress,
                        data.streetAddress2, data.city, data.state, data.postalCode, data.profilePhoto, data.companyName, data.industryType,
                        data.designation, data.incomePerMonth, data.cardNo, data.citizen_document, data.passport, data.passport_upload,
                        data.household_registration, data.registration_document, data.government_issued, data.government_issued_doc,
                        data.idNo, data.bank_statement_doc, data.annualIncome, data.creditLimit, data.creditCardPurpose
                    ];
                    
                    const result = await db(sql, params);
                    result.data = '1';
                    return result;
                } else {
                    // Update existing record if id exists
                    let sql = `UPDATE ${tbl_name} SET 
                        fullName = ?, email = ?, gender = ?, mobileNumber = ?, dateOfBirth = ?, streetAddress = ?, streetAddress2 = ?, 
                        city = ?, state = ?, postalCode = ?, profilePhoto = ?, companyName = ?, industryType = ?, designation = ?, incomePerMonth = ?, 
                        cardNo = ?, citizen_document = ?, passport = ?, passport_upload = ?, household_registration = ?, 
                        registration_document = ?, government_issued = ?, government_issued_doc = ?, idNo = ?, bank_statement_doc = ?,
                        annualIncome = ?, creditLimit = ?, creditCardPurpose = ?
                        WHERE id = ?`;
        
                    let params = [
                        data.fullName, data.email, data.gender, data.mobileNumber, data.dateOfBirth, data.streetAddress,
                        data.streetAddress2, data.city, data.state, data.postalCode, data.profilePhoto, data.companyName, data.industryType,
                        data.designation, data.incomePerMonth, data.cardNo, data.citizen_document, data.passport, data.passport_upload,
                        data.household_registration, data.registration_document, data.government_issued, data.government_issued_doc,
                        data.idNo, data.bank_statement_doc, data.annualIncome, data.creditLimit, data.creditCardPurpose, id
                    ];
        
                    const result = await db(sql, params);
                    result.data = '1';
                    return result;
                }
            }    
        } catch (error) {
            const result = {};
            result.data = '3';
            return result;
        }
    }

    creditCardReqDet = () => {
        let sql = `Select * from creditcard_request_details WHERE isactive = 1`;
        return db(sql);
    }
    
}

module.exports = new BankModel;