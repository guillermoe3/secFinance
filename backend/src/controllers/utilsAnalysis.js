//const mainModel = require('../models/mainModel')
const db = require("../database/models")
const analysisController = require("./analysisController")
const { Op } = require("sequelize");



//let analysisController = 
module.exports = {

    save: async function(ioc){
        try {
            
           // ioc = JSON.parse(ioc);
            console.log("ESTO ES IOC:" +ioc.ioc);
           let obj =  await db.InvestigationDetail.create({
                id_investigador: ioc.id_investigador,
                description: ioc.description,
                ioc: ioc.ioc,
                result: JSON.stringify(ioc.result),
                whois: JSON.stringify(ioc.whois),
                timestamp: ioc.timestamp

            });
            console.log("El Objeto guardado es:"+obj)
            return obj;//res.render("Analysis", {});//aca van los iocs para una investigación
            
        } catch (error) {
            console.log(error);
            
        }


    }, 
    getIdFromObjects: function(objs){

        try {

            let invs = [];

            
           
            for (let i=0; i < objs.length; i++){
                //console.log("i es "+i)
      
             // console.log(objs[i].id_investigation)
              invs.push(objs[i].id_investigation);
              //getTop3forinvestigation

      
            }

            return invs;

           // console.log(invs)
            
        } catch (error) {
            console.log(error)
            
        }
       

    },
    
    getAnalysisByInvestigationId: async function(id) {

        console.log("entro a getAnalysisByInvestigationId")
        

        try {
            let analysis = await db.InvestigationDetail.findAll({
                where: {
                    id_investigation: id
                    
                },
                raw: true});
            //console.log(analysis)

            //totalAnalysis.push(analysis);

            return(analysis);
            
        } catch (error) {
            console.log(error);
            
        }

    },

    
    
    getTop3Analysis: async function(analysis) {


        try {

            console.log("entro a getTop3Analysis")
            //console.log(analysis)
    
            let list = [];
            let analysisMalicious = [];
    
            //filtro malicious > 0
    
            for (i=0; i < analysis.length;i++){
    
                let temp = JSON.parse(analysis[i][0].result);
                if (temp.malicious > 0){
                    analysisMalicious.push(analysis[i][0]);
                }
    
              
            }
    
            const randomElement1 = analysisMalicious[Math.floor(Math.random() * analysisMalicious.length)];
            const randomElement2 = analysisMalicious[Math.floor(Math.random() * analysisMalicious.length)];
            const randomElement3 = analysisMalicious[Math.floor(Math.random() * analysisMalicious.length)];
            
            list.push(randomElement1, randomElement2, randomElement3)
    
            //console.log(list)
           
            return(list);
            
        } catch (error) {
            console.log(error);
            
        }

    },


}