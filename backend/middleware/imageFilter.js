// // Middleware to filter image files
// const imageFileFilter = (req, file, cb) => {
//     if (
//       file.mimetype === "image/png" ||
//       file.mimetype === "image/jpg" ||
//       file.mimetype === "image/jpeg"
//     ) {
//       cb(null, true);
//     } else {
//       cb({ message: "Only images allowed!" }, false);
//     }
//   };

//   module.exports = { imageFileFilter };