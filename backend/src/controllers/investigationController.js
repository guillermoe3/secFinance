const dotEnv = require("dotenv").config();
const db = require("../database/models"); 



module.exports = {
    investigations: function (req, res) {
        res.render("investigations");
    },
    create: async function (req, res) {
        //let checked = req.body.ispublic;
        console.log(req.body)
        
        try {
        const objCreate = await db.Investigation.create({
            id_analyst: 1,
            id_user: 1, 
            closed: false, 
            description: req.body.description,
            likes: "ninguno",
            dislikes: "ninguno",
            date_creation: Date.now(),
            isPublic: req.body.ispublic ? true : false, 
            isShared: true, 
            title: req.body.title,
            validated: false
            
            });
        //console.log(db.Investigation.id_investigation); 
        //return res.redirect("analysis", );

        return res.send(JSON.stringify(objCreate))
            
        } catch (error) {
            console.log(error);
            
        }
    }
  
}