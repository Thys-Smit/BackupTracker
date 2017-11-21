var express = require('express')
var router = express.Router()
var fs = require('fs')
var tableify = require('tableify')
var moment = require('moment')

var sitesArray = []
// var jsonControl = require('jsonfile');
var settingsJSON = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
var dirPath = settingsJSON.directoryPath;
var folderName = settingsJSON.folderNames;
var fileRegex = [];
var dates = [];
var maxDate = [];
var header = [];

// Get all the users.
router.get('/API/backup/', function (req, res) {
    var html = readDirectory()
    return res.status(200).send(html)
})

function readDirectory () {
    folderName.forEach(function(dirName)
    {
        var siteData = {}
        siteData.Result = []
        siteData.Site = dirName

        fileRegex = eval("settingsJSON." + dirName);
        fs.appendFileSync(settingsJSON.resultFilePath,"Site : " + fileRegex)

        var path = dirPath + dirName + "\\";
        fs.readdirSync(path).forEach(function(fileName)
        {
            fileRegex.forEach(function(fileReg)
            {
                if (fileName.match(fileReg) !== null)
                {
                    stats = fs.lstatSync(path + fileName);
                    dates.push(stats.birthtime)
                }
                
                if (dates.length > 0) {
                    var regexVal = {regex: '', dateTest: ''}
                    regexVal.regex = fileReg                    
                    var maxDate = new Date(Math.max.apply(null, dates))
                    regexVal.dateTest = moment(maxDate).format('YYYY MM DD')
                    siteData.Result.push(regexVal)
                    dates = []
                }
          });
        });

        sitesArray.push(siteData)
    });

    var html = tableify(sitesArray)
    sitesArray = [];

    return html
}

module.exports = router