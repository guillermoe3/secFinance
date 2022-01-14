
const nvt = require("node-virustotal");
const defaultTimedInstance = nvt.makeAPI();
const theSameKey = defaultTimedInstance.setKey("x");


let mainController = {
    index: function (req, res) {
        res.render("index");
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