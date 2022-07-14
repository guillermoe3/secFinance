const db = require("../database/models")


module.exports = {
    getAll: async function(req, res){
        try {

            let alerts = await db.Alert.findAll(
                {raw: true});
           
                res.send(alerts)
            
        } catch (error) {
            console.log(error)
            
        }
    }, 
    create: async function (req, res) {
        try {

            let alert = await db.Alert.create({
                category: req.body.category,
                titulo: req.body.titulo,
                id_user: req.body.id_user,
                severity: req.body.severity,
                body1: req.body.body1, 
                body2: req.body.body2,
                business: req.body.business
                
            });

            //console.log(alert)
            res.send(alert)

            
        } catch (error) {
            console.log(error);
            
        }
        
    }, 

    getAlertsByIdBusiness: async function (req, res){
       try {

        let id = req.params.id;

        //obtengo el valor de business de la alertas

        let alerts = await db.Alert.findAll({
            raw: true});

        if (id == "999"){
            res.send(alerts)
        }
        //console.log(alerts)

        let alertsById=[];
        
        let temp="";
        let arrayTemp = [];
        for (i=0;i<alerts.length;i++){

            temp = JSON.parse(alerts[i].business);
            arrayTemp = Object.values(temp);

           //console.log(temp)
            //console.log(arrayTemp)
            //si el id está dentro de arrayTemp, push a alertsById

            if ((arrayTemp.indexOf(id) != -1) || (arrayTemp.indexOf("300") != -1)){
                alertsById.push(alerts[i])
            }

         
        }

        //console.log(alertsById.length)

        res.send(alertsById)
           
       } catch (error) {

        console.log(error)
           
       } 
    }


}