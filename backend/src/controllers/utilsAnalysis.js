//const mainModel = require('../models/mainModel')
const db = require("../database/models")
const analysisController = require("./analysisController")
const utilsUrlsAnalysis = require("./utilsUrlsAnalysis")
const { Op } = require("sequelize");




module.exports = {

    save: async function(ioc){
        console.log(ioc)
        try {
            
            //parse -> Con IP falla
           //ioc = JSON.parse(ioc);
            console.log("ESTO ES IOC:" +ioc.ioc);
           let obj =  await db.InvestigationDetail.create({
                id_investigation: ioc.id_investigation,
                description: ioc.description,
                ioc: ioc.ioc,
                result: JSON.stringify(ioc.result),
                whois: JSON.stringify(ioc.whois),
                timestamp: ioc.timestamp,
                type: ioc.type, 
                info: ioc.info,

            });
            console.log("El Objeto guardado es:"+obj)
            //console.log(obj)
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

        console.log("--------------------------------------------entro a getAnalysisByInvestigationId")
        

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

            console.log("--------------------------------------------------------entro a getTop3Analysis")
            //console.log(analysis)
    
            let list = [];
            let analysisMalicious = [];
    
            //filtro malicious > 0
    
            for (i=0; i < analysis.length;i++){
    
                let temp = JSON.parse(analysis[i][0].result);
                //console.log(analysis[i][0].ioc)
                //console.log(analysis[i][0].description)
                //console.log("es malicious?")
                if (temp.malicious > 0){
                    
                    //console.log(temp.malicious)
                    analysisMalicious.push(analysis[i][0]);
                }
    
              
            }

            //console.log(analysisMalicious)
    
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

    getParcialIp: function(ip){
       let array = ip.split(".")

       let partialArray = [];
       partialArray.push(array[0], array[1])

       //console.log(partialArray)
       return(partialArray);
    }, 

    getIocByTypeAndMalicious: async function(type){

        let iocs = await db.InvestigationDetail.findAll({
            where: {
                type: type,
            },
            raw: true});

            let iocsMalicious = [];
    
            //filtro malicious > 0
    
            for (i=0; i < iocs.length;i++){
    
                let temp = JSON.parse(iocs[i].result);

                if (temp.malicious > 0){
                    iocsMalicious.push(iocs[i]);
                }
    
              
            }


            return(iocsMalicious);

    },
    
    getIocByIDAndMalicious: async function(id){

        let iocs = await db.InvestigationDetail.findAll({
            where: {
                id_investigation: id
            },
            raw: true});

            let iocsMalicious = [];
            let mostMalicious = iocs[0];
            let tempMost = "";
    
            //filtro malicious > 0
    
            for (i=0; i < iocs.length;i++){
    
                let temp = JSON.parse(iocs[i].result);
                

                if (temp.malicious > 0){
                    
                    let tempMost = JSON.parse(mostMalicious.result)
                   
                    if (temp.malicious > tempMost.malicious)
                    {
                        mostMalicious = iocs[i];
                    }
                    
                    iocsMalicious.push(iocs[i]);
                }
    
              
            }

            console.log("mostMalicious es")
            console.log(mostMalicious)
            
            let result = [iocsMalicious, mostMalicious]

            //return (iocsMalicious);
            return result;

    },
    getIpsWithSameRange: async function (partial, iocs){
        
        let result = [];
        console.log("getIpsWithSameRange")

        try {

            //partial es la parte que quiero comparar
            //iocs es el array de objetos. acá hay que pasar a array el parametro info y compararlo con partial
            let partialIoc = [];

            for(i=0;i<iocs.length;i++){
                partialIoc = Object.values(JSON.parse(iocs[i].info))
                

                if (JSON.stringify(partial) === JSON.stringify(partialIoc)){
                    result.push({
                        ioc: iocs[i].ioc})
                }
            }

            let resultSinRepetidos = result.filter((item,index)=>{
                return result.indexOf(item) === index;
              })

            return resultSinRepetidos;

            //partial es la parte que quiero comparar
            //iocs es el array de objetos. acá hay que pasar a array el parametro info y compararlo con partial
/*
            for(i=0;i<iocs.length;i++){

               console.log(iocs[i].ioc)

                console.log(await this.getParcialIp(iocs[i].ioc));
                let temp = JSON.stringify(await this.getParcialIp(iocs[i].ioc))
                
                if ( temp === JSON.stringify(partial)){
                   console.log(i)
                    result.push(iocs[i].ioc)
                }
                //si este parcial es igual al partial del parametro, guardar en un nuevo array.
    
            }

            //remuevo repetidos

            let resultSinRepetidos = result.filter((item,index)=>{
                return result.indexOf(item) === index;
              })

            return resultSinRepetidos;
            */
        } catch (error) {
            console.log(error)
            
        }



        
    }, 
    getCategoryFromUrl: function (description){

        console.log("entro a getCategoryFromUrl")

        descriptionArray = [];
        let keywords = ["malware", "command and control", "botnets", "botnet", "compromised website", "encrypted", "keylogger", "malicious", "phishing",
                            "spyware", "mobile", "hacking", "security", "facebook", "youtube", "exploit", "suspicious", "sospechoso", "binario", "troyano", "bancario", "galicia", "macro",
                        "uala", "ripio", "fintech", "atm", "exe", "js", "vbs", "rar"]

        descriptionArray = description.split(" ");

        //console.log(descriptionArray);
        //console.log(keywords)


        //buscar palabras

        let matchedKeyboard = [];

        for (i=0; i<descriptionArray.length;i++){
            //console.log(descriptionArray[i])
            for (j=0;j<keywords.length;j++){

                if(descriptionArray[i] == keywords[j]){
                    //console.log("Encontré una que se repite y es "+descriptionArray[i])
                    matchedKeyboard.push(descriptionArray[i])
                }

            }
        }

        //console.log(matchedKeyboard)
        return (matchedKeyboard);
    }, 
    maliciousIocsWithMatchedKeyword: function (maliciousIocsWithKeywords, matchedKeyword){
        console.log("entro")

        // for y preguntar si la categoria del ioc demaliciousIocsWithKeywords tiene algun matchedKeyword

        //console.log(maliciousIocsWithKeywords)
        //console.log(matchedKeyword)

        let keywordInUrlIoc = [];
        let hola = [];
        //console.log(maliciousIocsWithKeywords.length)

        let temp = ""
        for (i=0;i<maliciousIocsWithKeywords.length;i++){

            temp = maliciousIocsWithKeywords[i][0];

            keywordInUrlIoc = utilsUrlsAnalysis.getCategoryFromUrl(maliciousIocsWithKeywords[i][1]);

            const found = matchedKeyword.some(r => 
                keywordInUrlIoc.includes(r));
   
           // console.log(temp)
           // console.log(keywordInUrlIoc)
            //console.log(found)

            if (found){
                console.log("entro al if")
                hola.push(temp.toString())
            }
            
            

        }
        //console.log(hola)

        return (hola);
        //console.log(maliciousIocsWithKeywords[2])
    },

    getUrlsRelated: function (maliciousIocs, matchedKeyword){
    

        let result = [];
        let temp = [];

        for (i=0;i<maliciousIocs.length;i++){
            temp = Object.values((JSON.parse(maliciousIocs[i].info)))
            //console.log(temp[0])

            if(temp[0] == matchedKeyword ){
                result.push({ioc: maliciousIocs[i].ioc})

            }
        }
        

        return (result)
    
        /*
        let maliciousIocsWithKeywords =[];
        let result = [];

        let PATTERN = 'Forcepoint ThreatSeeker';
        let filtrado = [];

        //console.log(maliciousIocs.length)

        for (i=0;i<maliciousIocs.length;i++){
           
            let categoriesArray = Object.entries(JSON.parse(maliciousIocs[i].whois).categories)
                    filtrado = categoriesArray.filter(function (str) { return str.includes(PATTERN); });
                    if (filtrado.length >= 1){
                        maliciousIocsWithKeywords.push([maliciousIocs[i].ioc, filtrado[0][1]])
                    }
                    
        }
        result = this.maliciousIocsWithMatchedKeyword(maliciousIocsWithKeywords, matchedKeyword)
        
        */
        
        
    },

    //this.getParcialIpToObject(req.body.ioc)
    getParcialIpToObject : function (ip){

        console.log('------------------------------entro a getParcialIpToObject ')
        let partial = this.getParcialIp(ip)
       // console.log(partial)

        let ipObj = {
            '1': partial[0],
            '2': partial[1]
        }

        return JSON.stringify(ipObj);
    }, 

    getHashes : function (matchedKeyword, maliciousIocs){

        //recorrer maliciousIocs y buscar la subcadena matchedKeyword en info de cada maliciousIocs

        let result = [];

        let malioc = "";
        let key = "";

        for (i=0;i < maliciousIocs.length;i++ ){
            //console.log((maliciousIocs[i].info).toLowerCase());
            //console.log("matchedKeyword")
            //console.log((matchedKeyword[0]).toLowerCase())

            malioc = (maliciousIocs[i].info).toLowerCase();
            console.log(malioc)
            key = (matchedKeyword[0]).toLowerCase();
            console.log(key)

            console.log(malioc.indexOf(key));

            if (malioc.indexOf(key) != -1){
                result.push({
                    ioc: maliciousIocs[i].ioc
                })
            }
            
            //console.log(maliciousIocs[i].info.indexOf(matchedKeyword[0]));
        }

        return result;

    },
    getAll: async function() {

        try {
            let analysis = await db.InvestigationDetail.findAll(
                {
                    raw: true
                });
            return analysis;
            
        } catch (error) {
            console.log(error);
            
        }

    },


}