const db = require("../database/models")


module.exports = {
    index: function (req, res) {
        res.render("alerts");
        
    }, 
    create: async function (req, res) {
        try {

            let alert = db.Alert.create({
                category: req.body.category,
                description: req.body.description
            });

            return res.redirect("alertDetail");

            
        } catch (error) {
            console.log(error);
            
        }
        
    }


}