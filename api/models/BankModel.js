const db = require('../config/database');
const db2 = require('../config/database');
const common = require("../utlis/common");
const Sres = common.res;

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
        let reason = data?.reason;
        try {
            delete data?.id;
            if(status == '1'){
                let sql = "UPDATE customer_management SET isactive = ? WHERE id = ?";
                let params = [0, id];
                const result = await db(sql, params);
                result.data = '2';
            }
            else if(status == '2' || status == '3'){
                let curDate = new Date();
                let sql = "UPDATE customer_management SET approve_sts = ?, approve_date = ?, reason = ? WHERE id = ?";
                let params = [status == '2' ? 1 : 2, curDate, reason, id];
                const result = await db(sql, params);
                result.data = (status == '2') ? '4' : '5';
                let getsql = `Select * from customer_management WHERE isactive = 1 and id = ${id}`;
                let customerDet = await db2(getsql);
                let getData = customerDet[0];
                let mobile = (getData.mobileNumber).toString();
                result.fullName = getData.fullName;
                result.email = getData.email;
                result.customer_id = getData.customer_id;
                if(status == '2'){
                    const first4Digits = mobile.slice(0, 4);
                    // Get the year from the DOB (assuming DOB is in YYYY-MM-DD format)
                    const yearOfBirth = new Date(getData.dateOfBirth).getFullYear();
                    // Combine the first 4 digits of the phone number with the year of birth
                    const password = first4Digits + '@' + yearOfBirth;

                    let insertsql = `INSERT INTO users (email, password) VALUES (?, ?)`;
                    let insertparams = [getData.customer_id, password];
                    let insertres = await db(insertsql, insertparams);
                    result.password = password;
                }
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
                    let inserId = result.insertId;
                    let uptsql = "UPDATE customer_management SET customer_id = ? WHERE id = ?";
                    let uptparams = [(10000 + inserId), inserId];
                    await db(uptsql, uptparams);
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
                    result.data = '3';
                    return result;
                }
            }   
        } catch (error) {
            const result = {};
            result.data = '6';
            return result;
        }
    }

    customerDet = () => {
        let sql = `Select * from customer_management WHERE isactive = 1`;
        return db(sql);
    }

    customerDetbyId(id) {
        let sql = `Select * from customer_management WHERE isactive = 1 and customer_id = ${id}`;
        return db(sql);
    }

    juristicPerUpt = async (data, tbl_name) => {
        let id = data?.id;
        let status = data?.status;
        let reason = data?.reason;
        try {
            delete data?.id;
            if(status == '1'){
                let sql = "UPDATE juristic_person_details SET isactive = ? WHERE id = ?";
                let params = [0, id];
                const result = await db(sql, params);
                result.data = '2';
                return result;
            }
            else if(status == '2' || status == '3'){
                let curDate = new Date();
                let sql = "UPDATE juristic_person_details SET approve_sts = ?, approve_date = ?, reason = ? WHERE id = ?";
                let params = [status == '2' ? 1 : 2, curDate, reason, id];
                const result = await db(sql, params);
                result.data = (status == '2') ? '4' : '5';
                let getsql = `Select * from juristic_person_details WHERE isactive = 1 and id = ${id}`;
                let customerDet = await db2(getsql);
                let getData = customerDet[0];
                let mobile = (getData.mobileNumber).toString();
                result.fullName = getData.fullName;
                result.email = getData.email;
                result.customer_id = getData.customer_id;
                if(status == '2'){
                    const first4Digits = mobile.slice(0, 4);
                    // Get the year from the DOB (assuming DOB is in YYYY-MM-DD format)
                    const yearOfBirth = new Date(getData.dateOfBirth).getFullYear();
                    // Combine the first 4 digits of the phone number with the year of birth
                    const password = first4Digits + '@' + yearOfBirth;

                    let insertsql = `INSERT INTO users (email, password) VALUES (?, ?)`;
                    let insertparams = [getData.customer_id, password];
                    let insertres = await db(insertsql, insertparams);
                    result.password = password;
                }
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
                    let inserId = result.insertId;
                    let uptsql = "UPDATE juristic_person_details SET customer_id = ? WHERE id = ?";
                    let uptparams = [(100000 + inserId), inserId];
                    await db(uptsql, uptparams);
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
                    result.data = '3';
                    return result;
                }
            }    
        } catch (error) {
            const result = {};
            result.data = '6';
            return result;
        }
    }

    juristicPerDet = () => {
        let sql = `Select * from juristic_person_details WHERE isactive = 1`;
        return db(sql);
    }

    juristicPerDetbyId(id) {
        let sql = `Select * from juristic_person_details WHERE isactive = 1 and customer_id = ${id}`;
        return db(sql);
    }

    loanReqUpt = async (data, tbl_name) => {
        let id = data?.id;
        let status = data?.status;
        let reason = data?.reason;
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
                let curDate = new Date();
                let sql = "UPDATE loan_request_details SET approve_sts = ?, approve_date = ?, reason = ? WHERE id = ?";
                let params = [status == '2' ? 1 : 2, curDate, reason, id];
                const result = await db(sql, params);
                result.data = (status == '2') ? '4' : '5';
                return result;
            }
            else{
                if (!id) {
                    // Insert new data if no id is present
                    let sql = `INSERT INTO ${tbl_name} 
                        (customer_type, customer_id, fullName, email, gender, mobileNumber, dateOfBirth, streetAddress, 
                        streetAddress2, city, state, postalCode, profilePhoto, 
                        companyName, industryType, designation, incomePerMonth, cardNo, citizen_document, passport, passport_upload, 
                        household_registration, registration_document, government_issued, government_issued_doc, idNo, bank_statement_doc,
                        loanType, loanTenure, loanAmount, purpose, collateral) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
                    let params = [
                        data.customer_type, data.customer_id, data.fullName, data.email, data.gender, data.mobileNumber, data.dateOfBirth, data.streetAddress,
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
        let sql = `SELECT a.id, a.customer_type, case when a.customer_type = 1 then b.customer_id else c.customer_id end as customer_id, 
        case when a.customer_type = 1 then b.fullName else c.fullName end as fullName, 
        case when a.customer_type = 1 then b.email else c.email end as email, 
        case when a.customer_type = 1 then b.gender else c.gender end as gender, 
        case when a.customer_type = 1 then b.mobileNumber else c.mobileNumber end as mobileNumber, 
        case when a.customer_type = 1 then b.dateOfBirth else c.dateOfBirth end as dateOfBirth, 
        case when a.customer_type = 1 then b.streetAddress else c.streetAddress end as streetAddress, 
        case when a.customer_type = 1 then b.streetAddress2 else c.streetAddress2 end as streetAddress2, 
        case when a.customer_type = 1 then b.city else c.city end as city, 
        case when a.customer_type = 1 then b.state else c.state end as state, 
        case when a.customer_type = 1 then b.postalCode else c.postalCode end as postalCode, 
        case when a.customer_type = 1 then b.profilePhoto else c.profilePhoto end as profilePhoto, 
        case when a.customer_type = 1 then b.companyName else c.companyName end as companyName, 
        case when a.customer_type = 1 then b.industryType else c.industryType end as industryType, 
        case when a.customer_type = 1 then b.designation else c.designation end as designation, 
        case when a.customer_type = 1 then b.incomePerMonth else c.incomePerMonth end as incomePerMonth, 
        case when a.customer_type = 1 then b.cardNo else c.cardNo end as cardNo, 
        case when a.customer_type = 1 then b.citizen_document else c.citizen_document end as citizen_document, 
        case when a.customer_type = 1 then b.passport else c.passport end as passport, 
        case when a.customer_type = 1 then b.passport_upload else c.passport_upload end as passport_upload, 
        case when a.customer_type = 1 then b.household_registration else c.household_registration end as household_registration, 
        case when a.customer_type = 1 then b.registration_document else c.registration_document end as registration_document, 
        case when a.customer_type = 1 then b.government_issued else c.government_issued end as government_issued, 
        case when a.customer_type = 1 then b.government_issued_doc else c.government_issued_doc end as government_issued_doc, 
        case when a.customer_type = 1 then b.idNo else c.idNo end as idNo, 
        case when a.customer_type = 1 then b.bank_statement_doc else c.bank_statement_doc end as bank_statement_doc,
        a.loanType, a.loanTenure, a.loanAmount, a.purpose, a.collateral, a.approve_sts, a.approve_date, a.reason
        from loan_request_details a
        left join customer_management b on b.customer_id = a.customer_id
        left join juristic_person_details c on c.customer_id = a.customer_id
        WHERE a.isactive = 1;`;
        return db(sql);
    }

    creditCardReqUpt = async (data, tbl_name) => {
        let id = data?.id;
        let status = data?.status;
        let reason = data?.reason;
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
                let curDate = new Date();
                let sql = "UPDATE creditcard_request_details SET approve_sts = ?, approve_date = ?, reason = ? WHERE id = ?";
                let params = [status == '2' ? 1 : 2, curDate, reason, id];
                const result = await db(sql, params);
                result.data = (status == '2') ? '4' : '5';
                return result;
            }
            else{
                if (!id) {
                    // Insert new data if no id is present
                    let sql = `INSERT INTO ${tbl_name} 
                        (customer_type, customer_id, fullName, email, gender, mobileNumber, dateOfBirth, streetAddress, streetAddress2, city, state, postalCode, 
                        profilePhoto, 
                        companyName, industryType, designation, incomePerMonth, cardNo, citizen_document, passport, passport_upload, 
                        household_registration, registration_document, government_issued, government_issued_doc, idNo, bank_statement_doc,
                        annualIncome, creditLimit, creditCardPurpose) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
                    let params = [
                        data.customer_type, data.customer_id, data.fullName, data.email, data.gender, data.mobileNumber, data.dateOfBirth, data.streetAddress,
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
        let sql = `SELECT a.id, a.customer_type, case when a.customer_type = 1 then b.customer_id else c.customer_id end as customer_id, 
        case when a.customer_type = 1 then b.fullName else c.fullName end as fullName, 
        case when a.customer_type = 1 then b.email else c.email end as email, 
        case when a.customer_type = 1 then b.gender else c.gender end as gender, 
        case when a.customer_type = 1 then b.mobileNumber else c.mobileNumber end as mobileNumber, 
        case when a.customer_type = 1 then b.dateOfBirth else c.dateOfBirth end as dateOfBirth, 
        case when a.customer_type = 1 then b.streetAddress else c.streetAddress end as streetAddress, 
        case when a.customer_type = 1 then b.streetAddress2 else c.streetAddress2 end as streetAddress2, 
        case when a.customer_type = 1 then b.city else c.city end as city, 
        case when a.customer_type = 1 then b.state else c.state end as state, 
        case when a.customer_type = 1 then b.postalCode else c.postalCode end as postalCode, 
        case when a.customer_type = 1 then b.profilePhoto else c.profilePhoto end as profilePhoto, 
        case when a.customer_type = 1 then b.companyName else c.companyName end as companyName, 
        case when a.customer_type = 1 then b.industryType else c.industryType end as industryType, 
        case when a.customer_type = 1 then b.designation else c.designation end as designation, 
        case when a.customer_type = 1 then b.incomePerMonth else c.incomePerMonth end as incomePerMonth, 
        case when a.customer_type = 1 then b.cardNo else c.cardNo end as cardNo, 
        case when a.customer_type = 1 then b.citizen_document else c.citizen_document end as citizen_document, 
        case when a.customer_type = 1 then b.passport else c.passport end as passport, 
        case when a.customer_type = 1 then b.passport_upload else c.passport_upload end as passport_upload, 
        case when a.customer_type = 1 then b.household_registration else c.household_registration end as household_registration, 
        case when a.customer_type = 1 then b.registration_document else c.registration_document end as registration_document, 
        case when a.customer_type = 1 then b.government_issued else c.government_issued end as government_issued, 
        case when a.customer_type = 1 then b.government_issued_doc else c.government_issued_doc end as government_issued_doc, 
        case when a.customer_type = 1 then b.idNo else c.idNo end as idNo, 
        case when a.customer_type = 1 then b.bank_statement_doc else c.bank_statement_doc end as bank_statement_doc,
        a.annualIncome, a.creditLimit, a.creditCardPurpose, a.approve_sts, a.approve_date, a.reason
        from creditcard_request_details a
        left join customer_management b on b.customer_id = a.customer_id
        left join juristic_person_details c on c.customer_id = a.customer_id
        WHERE a.isactive = 1;`;
        return db(sql);
    }
    
}

module.exports = new BankModel;