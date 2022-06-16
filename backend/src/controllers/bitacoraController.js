const db = require("../database/models")
const Bitacora = require("../database/models/bitacoraModel")

let bitacoraController = {

    getEvents: async function(req, res){

        try {
            const events = await db.Bitacora.findAll();
            res.send(events);
            
        } catch (error) {
            console.log(error)
            
        }
        

    }, 
    createEvent: async function(req, res){

        console.log(req.body)

        try {
            const registry = await db.Bitacora.create({
                date: Date.now(),
                severity: req.body.severity,
                event: req.body.event,
                userEmail : req.body.userEmail

            })
            res.send(registry)
            
        } catch (error) {
            console.log(error)
            
        }
        

    }

}

module.exports = bitacoraController;