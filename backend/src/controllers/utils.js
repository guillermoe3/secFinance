//const mainModel = require('../models/mainModel')
const db = require("../database/models")



//let analysisController = 
module.exports = {

    save: async function(ioc){
        try {
            
            ioc = JSON.parse(ioc);
            console.log("ESTO ES IOC:" +ioc.ioc);
           let obj =  await db.InvestigationDetail.create({
                id_investigation: 1,
                description: ioc.description,
                ioc: JSON.stringify(ioc.ioc),
                result: JSON.stringify(ioc.result)

            });
            console.log("El Objeto guardado es:"+obj)
            return obj;//res.render("Analysis", {});//aca van los iocs para una investigación
            
        } catch (error) {
            console.log(error);
            
        }


    }


}