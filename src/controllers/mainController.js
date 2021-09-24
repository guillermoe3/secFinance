const mainModel = require('../models/mainModel')
const nvt = require("node-virustotal");
const defaultTimedInstance = nvt.makeAPI();
const theSameKey = defaultTimedInstance.setKey('3154df46b6cd5db1c4d1d57137850102624f51b1cd47b999fb109754d6cc9c35');


let mainController = {
    index: function (req, res) {
        res.render("home");
    },
    analysis: function (req, res) {
        res.render("analysis");
    },
    check: function (req, res) {
        
        const theSameObject = defaultTimedInstance.ipLookup('8.8.8.8', function(err, res){
        if (err) {
            console.log('Well, crap.');
            console.log(err);
            return;
        }
        console.log(JSON.stringify(res));
        return;
       
    });

            }

}

module.exports = mainController;