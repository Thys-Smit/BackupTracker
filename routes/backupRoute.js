var express = require('express')
var router = express.Router()
var fs = require('fs')
var tableify = require('tableify')
var moment = require('moment')

var sitesArray = []
var settingsJSON = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
var dirPath = settingsJSON.directoryPath;
var folderName = settingsJSON.folderNames;
var fileRegex = [];
var dates = [];
var maxDate = [];
var header = [];
var currDate = null;

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

        var regexVal = {Regex: '', Date: ''}

        fileRegex.forEach(function(fileReg)
        {

            var path = dirPath + dirName + "\\";
            fs.readdirSync(path).forEach(function(fileName)
            {
            
                if (fileName.match(fileReg) !== null)
                {
                    stats = fs.lstatSync(path + fileName);
                    if (stats.birthtime > currDate || currDate === null)
                    {
                        regexVal.Regex = fileReg                    
                        regexVal.Date = moment(stats.birthtime).format('YYYY/MM/DD')
                        currDate = stats.birthtime
                    }   
                    
                }

              
            });
            if (regexVal.Date.length > 0){
                siteData.Result.push(regexVal)
                dates = []
                currDate = null;
                regexVal = {Regex: '', Date: ''}
            }
        });
          
        

        sitesArray.push(siteData)
    });

    var html = tableify(sitesArray)
    sitesArray = [];

    return html
}

module.exports = router