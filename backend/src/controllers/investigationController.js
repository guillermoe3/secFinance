const dotEnv = require("dotenv").config();
const db = require("../database/models"); 



module.exports = {
    investigations: function (req, res) {
        res.render("investigations");
    },
    create: async function (req, res) {
        //let checked = req.body.ispublic;
        console.log(req.body)
        console.log("está en create")
        
        try {
        const objCreate = await db.Investigation.create({
            id_analyst: 0,
            id_user: req.body.id_user, 
            closed: false, 
            description: req.body.description,
            likes: "",
            dislikes: "",
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
    }, 

    getAll: async function (req, res) {
        try {
            let investigation = await db.Investigation.findAll({raw: true});
            res.send(JSON.stringify(investigation));
            
        } catch (error) {
            console.log(error);
            
        }

    }, 
    getById: async function (req, res) {
        try {
            let investigation = await db.Investigation.findAll({
                where: {
                    id_investigation: req.params.id
                },
                raw: true});
            res.send(JSON.stringify(investigation));
            
        } catch (error) {
            console.log(error);
            
        }

    }, 
    getByUserId: async function (req, res) {
        try {
            let investigation = await db.Investigation.findAll({
                where: {
                    id_user: req.params.user
                },
                raw: true});
            res.send(JSON.stringify(investigation));
            
        } catch (error) {
            console.log(error);
            
        }

    }, 
    update: async function (req, res) {

        console.log(req.body)

        try {

            let updated  = await db.Investigation.update({
                closed: req.body.closed, 
                description: req.body.description,
                isPublic: req.body.ispublic,
                isShared: req.body.isShared, 
                title: req.body.title,
                validated: req.body.validated
    
            },{
                where: {id_investigation: req.params.id}
            })
    
           console.log(updated);
           res.send("ok");
            
        } catch (error) {

            console.log("error")
            
        }



    }, 

    delete: async function (req, res) {


        try {
            let deleted = await db.InvestigationDetail.destroy({
                where: {id_investigationDetail: req.params.id}
            });
            console.log(deleted);
            if (deleted != 0){
                res.sendStatus(200);
            } else res.sendStatus(500);
            
        } catch (error) {
            console.log(error);
        }
    }, 

    isClosed : async function (req, res){

        try {

            let investigation = await db.Investigation.findAll({
                where: {
                    id_investigation: req.params.id
                },
                raw: true});

            if(investigation[0].closed == 1){
                res.send(true);
            } else res.send(false);

        
        } catch (error) {

            console.log(error)
            
        }

    }, 


    
  
}