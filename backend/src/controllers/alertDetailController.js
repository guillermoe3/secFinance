const db = require("../database/models")


module.exports = {
    index: function (req, res) {
        res.render("alertDetail");
        
    }, 
    create: async function (req, res) {
        try {

            let alert = await db.AlertDetail.create({
                //category: req.body.category,
                description: req.body.description
            });

            let alertas = await db.AlertDetail.findAll();

            return res.render("alertDetail", {alertas: alertas})//res.send(JSON.stringify(alertas));//

            
        } catch (error) {
            console.log(error);
            
        }
        
    }

}