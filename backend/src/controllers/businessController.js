const db = require("../database/models")


module.exports = {

    create: async function (req, res) {

        console.log(req.body)
        try {

            let business = await db.Business.create({
                active: 0,
                name: req.body.name,
                razonsocial: req.body.razonsocial,
            });

           res.send(JSON.stringify(business));

            
        } catch (error) {
            console.log(error);
            
        }
        
    }, 
    getAll: async function (req, res){
        try {

            let business = await db.Business.findAll({raw:true});
            
            res.send(JSON.stringify(business));
            
        } catch (error) {
            console.log(error)
            
        }
    }, 

    getNameById : async function (req, res){
        
        console.log(req.body)
       
        try {
            let business = await db.Business.findAll({
                where: {
                    id_business : req.params.id
                },raw:true});
            
                res.send(business)
        
        } catch (error) {

            console.log(error)
            
        }
    }



}