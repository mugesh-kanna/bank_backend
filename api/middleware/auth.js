const jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {
//   const token =req.headers["token"];
//   const authorization =req.headers["authorization"];

//   if (!token) {
//     return res.status(200).json({
//       status: false,
//       error: 'Token required!'
//   });
//   }

//   if(authorization !== 'EMIS_web@2019_api'){
//     return res.status(200).json({
//       status: false,
//       error: 'Access denied!'
//   });

//   }

//   try {
//     const decoded = jwt.verify(token,'ingDLMRuGe9UKHRNjs7cYckS2yul4lc3');
//     req.tokenDetails = decoded;
//     // console.log(decoded);
//   } catch (err) {
//     return res.status(401).send(err);
//   }
  return next();
};

module.exports = verifytoken;