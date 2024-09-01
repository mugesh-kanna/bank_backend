const dotenv = require('dotenv');
dotenv.config();
const mysql2 = require('mysql2');


class db {

    constructor() {
      this.db = mysql2.createPool({
        connectionLimit: 10,
        waitForConnections: true,
        multipleStatements: true,
        host: 'banking.clgqgoyei99l.ap-south-1.rds.amazonaws.com',
        user: 'admin',
        password: '0DduswYQppngzOFEt4Ws',
        database: 'banking',
        post: 3306
    });

        this.checkConnection();
        // this.db.connection.end();

        // this.db.connect(err => {
        //   if (err) {
        //     console.error('Error connecting to the database:', err.stack);
        //     return;
        //   }
        //   console.log('Connected to the database.');
        // });
    }

    checkConnection() {
        this.db.getConnection((err) => {
            if (err) {
              //- The server close the connection.
              if (err.code === "PROTOCOL_CONNECTION_LOST") {
                console.error("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
              }
        
              //- Connection in closing
              else if (err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT") {
                console.error("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
              }
        
              //- Fatal error : connection variable must be recreated
              else if (err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
                console.error("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
              }
        
              //- Error because a connection is already being established
              else if (err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE") {
                console.error("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
              }
        
              //- Anything else
              else {
                console.error("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
              }
        
            //   setTimeout(checkConnection, 5000);
            } 
          });
    }

    query = async (sql, values) => {
        return new Promise((resolve, reject) => {
            const callback = (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            }
            // execute will internally call prepare and query
            this.db.query(sql, values, callback);
        }).catch(err => {
            const mysqlErrorList = Object.keys(HttpStatusCodes);
            // convert mysql errors which in the mysqlErrorList list to http status code
            err.status = mysqlErrorList.includes(err.code) ? HttpStatusCodes[err.code] : err.status;

            throw err;
        });
    }


}

// like ENUM
const HttpStatusCodes = Object.freeze({
    ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
    ER_DUP_ENTRY: 409
});


module.exports = new db().query;