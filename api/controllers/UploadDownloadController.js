/**
 * UploadDownloadController
 *
 * @description :: Server-side logic for managing uploaddownloads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require("fs");

module.exports = {


  uploaddb: function (req, res) {
    /*
      title
      text
    */
    var context = {};
    context.status = "error";

    console.log({'req.file': req.file('file'), 'req.file.path': req.file('file').path});

    req.file('file').upload(function (err, uploadedFiles){
    	console.log({'upfile': uploadedFiles[0], 'upfile.path': uploadedFiles[0].fd});
      if (err) throw err;
        fs.readFile(uploadedFiles[0].fd, function (err, data){
          context.data = data; //aqui ta o arquivo lido. Boa sorte, lidinhos <3
          console.log(data);
          context.status = "success";
          return res.json(context);
        });
    });


  },

  downloadDB: function (req, res) {
    /*
      title
      text
    */

    var context = {};
    context.status = "error";
    
    return res.json(context);
  },
};

