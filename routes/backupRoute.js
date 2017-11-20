var express = require('express')
var router = express.Router()
var fs = require('fs');

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
    fs.writeFileSync(settingsJSON.resultFilePath, "");
    
    folderName.forEach(function(dirName)
    {
        var siteData = {}
        siteData.regexList = []
        siteData.Name = dirName

        fileRegex = eval("settingsJSON." + dirName);
        fs.appendFileSync(settingsJSON.resultFilePath,"Site : " + fileRegex)

        var path = dirPath + dirName + "\\";
        fs.readdir(path, function(err, filenames)
        {
            if (err)
            {
                onError(err);
                return;
            }

            fileRegex.forEach(function(fileReg)
            {
                siteData.regexList.push({regex: fileReg, date: ''})

                filenames.forEach(function(filename)
                { 
                    if(filename.match(fileReg) !== null) 
                    {
                        stats = fs.lstatSync(path + filename);
                        dates.push(stats.birthtime);
                    }
                });

                var maxDate = new Date(Math.max.apply(null,dates))
                siteData.regexList[siteData.regexList.length - 1].date = maxDate
          });          

          sitesArray.push(siteData)       

          fs.appendFileSync(settingsJSON.resultFilePath,"\r\n" + folderName[folderName.indexOf(dirName)] + " : " + maxDate);
        });
        
    });

    console.log('Newly Created Site Array.')
    console.log(sitesArray)

    //JSON.parse()

    return res.status(200).send(JSON.stringify(sitesArray))
})

function readFile () {

}

module.exports = router