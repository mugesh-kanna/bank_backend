const db = require('../config/database');


class Common {
    // check if empty
    empty = (objectName) => {
        if(objectName === 'undefined' || objectName === 'null'){
            return true;
        }
        
        return Object.keys(objectName || {}).length === 0
    }

    // remove null in object funciton 

    Objfilter = (obj) => {

        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
                delete obj[propName];
            }
        }
        return obj
    }

// string convention
    res =(r)=>{
        r.map(object => {

            Object.keys(object).forEach((obj) => {
                if(typeof object[obj] === "number" ) {
                    object[obj]=object[obj].toString();
                }else if(Object.prototype.toString.call(object[obj]) === "[object Date]"){
                    object[obj].setHours(object[obj].getHours() + 5);
                    object[obj].setMinutes(object[obj].getMinutes() + 30);
                    const dateTimeInParts = object[obj].toISOString().split( "T" ); // 
                    const date = dateTimeInParts[ 0 ]; // date
                    const time = dateTimeInParts[ 1 ]; // time
                  
                 object[obj]=date;
                }
                
            })
            
          });
          return r;
    }



    //insert
    InsertData = async (data, tbl_name) => {

        let result = {};
  
            try {
                const id = await db(tbl_name).insert(data);
                result.id = id[0];
                result.data = '1';
                return result;
            } catch (error) {
                console.log(error);
                result.message = error.sqlMessage;
                result.data = '3';
                return result;
            }

        

    }

    //update
    UpdateData = async (data, tbl_name) => {

        let result = {};
        let updated_status;

            try {
                updated_status = await db(tbl_name).where({
                    id: data.id
                }).update(data);
                // console.log(updated_status,
                //   'updated status');
                result.id = data.id;
                result.data = '2';
                return result;
            } catch (error) {
                result.message = error.sqlMessage;
                result.data = '3';
                return result;

            }

    }

    // generate random number 
    mt_rand = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //check duplicate 

    CheckDuplicate = (data, tbl_name) => {
    
        let arr_data=[];
   
        for (const [key, value] of Object.entries(data)) {
            let t= `${key} = '${value}'`;
            arr_data.push(t);
          }
let condition= arr_data.join(' and ');
 
    
        let sql = `select id from ${tbl_name} where ${condition}`;
    console.log(sql);
    // return false;
        return db(sql);
    
    }



} //end

module.exports = new Common;