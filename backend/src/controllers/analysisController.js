const dotEnv = require("dotenv").config();
const db = require("../database/models"); 
const nvt = require("node-virustotal");
const defaultTimedInstance = nvt.makeAPI(10000);
const vt_api = process.env.TOKEN_VT;
const theSameKey = defaultTimedInstance.setKey(vt_api);
const utilsAnalysis = require("./utilsAnalysis")



module.exports = {
    index: function (req, res) {
        res.render("index");
        
    },
    analysis: function (req, res) {
        res.render("analysis");
    },
    check: function (req, res) {

        console.log(req.body)
        try {
    

        //req.body recibo el type, ioc, y notes. 
        let ioc = req.body.ioc;
        //118.193.41.157
        if(req.body.type == "ip"){
            
            const theSameObject = defaultTimedInstance.ipLookup(ioc, function(err, value){
                if (err) {
                  console.log('Well, crap.');
                  console.log(err);
                  res.send("400")
                  
                  return;
                }
               
                let datos = JSON.parse(value);
                //console.log(value)
                let lastAnalysis = datos.data.attributes.last_analysis_stats;
                
                let whoisData = datos.data.attributes.whois
                //console.log("esto es whoisData")
                //console.log(whoisData)
                



                try {


                let whois = {}
                if (whoisData){

                                    //parse WhoisData
                const str = whoisData;
                console.log(str)
                const toObject = (str) => {
                  const json = str.replace(/([^\:]+)\:([^\n]+)\n/g, (_, p1, p2) => {
                    return `"${p1.replace(/\s+/g, '')}":"${p2.trim()}",`;
                  });
                  return JSON.parse(`{${json.slice(0, -1)}}`);
                };
    
                let whoisInfo = toObject(whoisData);

                let whois = {
                    organization: whoisInfo.Organization,
                    cidr: whoisInfo.CIDR,
                    country: whoisInfo.Country,
                    city: whoisInfo.City,
                    address: whoisInfo.Address,
                    description: whoisInfo.descr
                }

                } 
                
                //Armo json para devolver al front y guardar en DB.
                // info: JSON.stringify(utilsAnalysis.getParcialIp(req.body.ioc))
                let data = {
                    id_investigation : req.body.id_investigation,
                    ioc: req.body.ioc,
                    description: req.body.description,
                    result: lastAnalysis,
                    whois: whois,
                    timestamp: Date.now(),
                    type: "ip",
                    info: utilsAnalysis.getParcialIpToObject(req.body.ioc),
                }

                //guardar datos en DB
                let saveObject = utilsAnalysis.save(data);//JSON.stringify(
                res.send(data);
                    
                } catch (error) {
                    console.log(error)
                    res.send("400")
                    
                }

                
              });
            

        }else if (req.body.type == "url"){
            //const hashed = nvt.sha256('http://wikionemore.com/');
            console.log("este es el ioc" + ioc)
            console.log(ioc.slice(-1))
            if (ioc){
                if (ioc.slice(-1) !== "/"){
                    ioc += "/"
                }
            }
           
            console.log(ioc)
            const hashed = nvt.sha256(ioc);
            console.log("este es el ioc hashed" + hashed)
            const theSameObject = defaultTimedInstance.urlLookup(hashed, function(err, value){
                if (err) {
                  console.log('Well, crap.');
                  console.log(err);
                  //return
                  res.send("400")
                  return
                  ;
                }
               
                let datos = JSON.parse(value);
                let lastAnalysis = datos.data.attributes.last_analysis_stats;
                let headers = datos.data.attributes.last_http_response_headers
                let categories = datos.data.attributes.categories

                let whois = {
                    headers: headers,
                    categories: categories
                }

                let data = {
                    id_investigation: req.body.id_investigation,
                    ioc: req.body.ioc,
                    description: req.body.description,
                    result: lastAnalysis,
                    whois: whois,
                    type: "url",
                    info : JSON.stringify(utilsAnalysis.getCategoryFromUrl(req.body.description)),
                    timestamp: Date.now()
                }
                 //guardar datos en DB
                 let saveObject = utilsAnalysis.save(data);
                
                res.send(data);
              });

        }else if (req.body.type == "hash"){
            //res.send("recibi un hash");
            //08a542fe7f8450d2c66b5e428872860d584bc5be714a50293a10aef415310fe8


            const theSameObject = defaultTimedInstance.fileLookup(ioc, function(err, value){
                if (err) {
                  console.log('Well, crap.');
                  console.log(err);
                  res.send("400")
                  return;
                }
                
                let datos = JSON.parse(value);
                let lastAnalysis = datos.data.attributes.last_analysis_stats;
                let names = datos.data.attributes.names
                let type_description = datos.data.attributes.type_description
                let magic = datos.data.attributes.magic

                let whois = {
                    names: names,
                    type_description: type_description, 
                    magic: magic
                }

                let data = {
                    id_investigation: req.body.id_investigation,
                    ioc: req.body.ioc,
                    description: req.body.description,
                    result: lastAnalysis,
                    whois: whois,
                    type: "hash",
                    info: type_description,
                    timestamp: Date.now()
                }
                 //guardar datos en DB
                let saveObject = utilsAnalysis.save(data);
                
                res.send(data);
              });

        }else if (req.body.type == "domain"){
            
            const theSameObject = defaultTimedInstance.domainLookup(ioc, function(err, value){
                if (err) {
                  console.log('Well, crap.');
                  console.log(err);
                  res.send("400")
                  
                  return;
                }

                let datos = JSON.parse(value);
                let lastAnalysis = datos.data.attributes.last_analysis_stats;
                let registrar = datos.data.attributes.registrar;
                let categories = datos.data.attributes.categories
               
            
                let whois = {
                    registrar: registrar,
                    categories: categories, 
                    
                }

                let data = {
                    id_investigation: req.body.id_investigation,
                    ioc: req.body.ioc,
                    description: req.body.description,
                    result: lastAnalysis,
                    whois: whois,
                    type: "domain",
                    info : (utilsAnalysis.getCategoryFromUrl(req.body.description) ? JSON.stringify(utilsAnalysis.getCategoryFromUrl(req.body.description)) : ""),
                    timestamp: Date.now()
                }
                 //guardar datos en DB
                let saveObject = utilsAnalysis.save(data);
                
                res.send(data);

              });
        }
    
        } 
        catch (error) {
            console.log(error)
            res.send("400")
        }
    
    
    }, 
    getAll: async function(req, res) {

        try {
            let analysis = await db.InvestigationDetail.findAll({raw: true});
            res.send(JSON.stringify(analysis));
            
        } catch (error) {
            console.log(error);
            
        }

    },
    getAllbyInvestigation: async function (req, res) {
        console.log(req.params)
        console.log("entró en getAllbyInvestigation")

        try {
            let analysis = await db.InvestigationDetail.findAll({
                where: {
                    id_investigation: req.params.id
                },
                raw: true});
            console.log(analysis)
            res.send(JSON.stringify(analysis));
            
        } catch (error) {
            console.log(error);
            
        }

    },
    getAllbyInvestigationID: async function (id) {
        
    
        try {
            let analysis = await db.InvestigationDetail.findAll({
                where: {
                    id_investigation: id
                },
                raw: true});
            
            return(analysis);
            
        } catch (error) {
            console.log(error);
            
        }

    },
    update: async function(req, res) {
                
        let updated  = await db.InvestigationDetail.update({
            description: req.body.description
        },{
            where: {id_investigationDetail: req.params.id}
        })

       console.log(updated);
       res.send(updated);

    }, 
    delete: async function(req, res) {


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
    getRelatedObjects: async function(req, res){

        try {

            let description = req.body.description;
            let type = req.body.type;
            let ioc = req.body.ioc;

            let objs = await db.InvestigationDetail.findAll({
                where: {
                    ioc: req.body.ioc
                }
            })

            let invs = [];
            let analysis = [];

            if (objs.length > 0){
                
                console.log("Objeto encontrado!")
               let ioc = objs[0].ioc;
                //console.log(objs.length)
                
                 invs =  utilsAnalysis.getIdFromObjects(objs);
                 //console.log(invs)

                //elimino los repetidos
                 let invsW = invs.filter((item,index)=>{
                    return invs.indexOf(item) === index;
                  })

                  //console.log(invsW)

                 for (i=0; i < invsW.length;i++){
                     analysis.push(await utilsAnalysis.getAnalysisByInvestigationId(invsW[i]));
                 }

                 let result = await utilsAnalysis.getTop3Analysis(analysis);
                 //console.log("esto es resulttttttttttttttttttttttttt")
                 //console.log(result)
                 let filtrado = result.filter((item,index)=>{
                    return result.indexOf(item) === index;
                  })
                 
                 //result.filter( dato => dato.ioc !== ioc)
                 //console.log("esto es filtradooooooooooooooooooooooo")
                 //console.log(filtrado)
                 res.send(filtrado)
            } else 
            {
                console.log("el ioc no existe")
                console.log(objs)


                //filtrar x tipo y dsp por los analysis malicious >0
                //si es ip buscar por rango
                //si es url buscar dominio o donde está hosteado
                //si es malware buscar por palabra clave

                if (type == "ip"){
                    console.log("Es una ip")
                    //console.log(ioc)

                    //obtengo parcial del ioc
                    let partialIoc = [];
                    partialIoc = await utilsAnalysis.getParcialIp(ioc);
                    console.log(partialIoc)

                    //obtengo los ioc ip maliciosos

                    let maliciousIocs = [];

                    maliciousIocs = await utilsAnalysis.getIocByTypeAndMalicious("ip");

                    //console.log(maliciousIocs)

                    //obtengo los partial de esas ioc y comparo con el ioc
                    let results = [];

                    results = await utilsAnalysis.getIpsWithSameRange(partialIoc, maliciousIocs);
                    //console.log("esto es results")
                    //console.log(results)

                    res.send(results)
                    //console.log(results)

                } else if (type == "url"){
                    console.log("Es una url")

                    //filtro por todos los malicious >1

                    maliciousIocs = await utilsAnalysis.getIocByTypeAndMalicious("url");
                    //console.log(maliciousIocs)

                    //obtengo palabra clave de la descripción (si hay muchas obtengo una aleatoria)

                    //filtro obtengo categoria del ioc original

                    let matchedKeyword = [];
                    matchedKeyword = utilsAnalysis.getCategoryFromUrl(description);

                   

                    //filtro las categorias del resto de los iocs filtrados y muestro sugerencias. 

                     //results

                     let result = [];
                    
                     result = utilsAnalysis.getUrlsRelated(maliciousIocs, matchedKeyword)
                        console.log("esto es result")
                        console.log(result)
                    res.send(result)//result

                } else if (type == "hash"){
                    console.log("Es un hash")

                    let maliciousIocs = [];

                    maliciousIocs = await utilsAnalysis.getIocByTypeAndMalicious("hash");

                    let matchedKeyword = [];
                    matchedKeyword = utilsAnalysis.getCategoryFromUrl(description);
                    console.log(matchedKeyword)
                    
                    let results = [];

                    results = await utilsAnalysis.getHashes(matchedKeyword, maliciousIocs);

                    res.send(result)


                }



                res.send("objeto no existe");

            }

            
   
        } catch (error) {
            //ver enviar otro valor
            res.send(false);
            
        }
        
    }, 

    getRelatedObjects2: async function(req, res){

        try {

            let description = req.body.description;
            let type = req.body.type;
            let ioc = req.body.ioc;

            let objs = await db.InvestigationDetail.findAll({
                where: {
                    ioc: req.body.ioc
                }
            })

            let invs = [];
            let analysis = [];

            if (objs.length > 0){
                
                console.log("Objeto encontrado!")
               let ioc = objs[0].ioc;
                //console.log(objs.length)
                
                 invs =  utilsAnalysis.getIdFromObjects(objs);
                 //console.log(invs)


                 for (i=0; i < invs.length;i++){
                     analysis.push(await utilsAnalysis.getAnalysisByInvestigationId(invs[i] ));
                     console.log(i)
                 }

                 let result = await utilsAnalysis.getTop3Analysis(analysis);
                 let filtrado = result.filter( dato => dato.ioc !== ioc)
                 console.log(filtrado)
                 res.send(filtrado)
            } else 
            {
                console.log("el ioc no existe")
                console.log(objs)


                //filtrar x tipo y dsp por los analysis malicious >0
                //si es ip buscar por rango
                //si es url buscar dominio o donde está hosteado
                //si es malware buscar por palabra clave

                if (type == "ip"){
                    console.log("Es una ip")
                    console.log(ioc)

                    //obtengo parcial del ioc
                    let partialIoc = [];
                    partialIoc = await utilsAnalysis.getParcialIp(ioc);
                    console.log(partialIoc)

                    //obtengo los ioc ip maliciosos

                    let maliciousIocs = [];

                    maliciousIocs = await utilsAnalysis.getIocByTypeAndMalicious("ip");

                    //console.log(maliciousIocs.length)

                    //obtengo los partial de esas ioc y comparo con el ioc
                    let results = [];

                    results = await utilsAnalysis.getIpsWithSameRange(partialIoc, maliciousIocs);

                    res.send(results)
                    //console.log(results)

                } else if (type == "url"){
                    console.log("Es una url")

                    //filtro por todos los malicious >1

                    maliciousIocs = await utilsAnalysis.getIocByTypeAndMalicious("url");
                    //console.log(maliciousIocs)

                    //obtengo palabra clave de la descripción (si hay muchas obtengo una aleatoria)

                    //filtro obtengo categoria del ioc original

                    let matchedKeyword = [];
                    matchedKeyword = utilsAnalysis.getCategoryFromUrl(description);

                    console.log("esto es matchedKeywordddddddd")
                    console.log(matchedKeyword)

                    //filtro las categorias del resto de los iocs filtrados y muestro sugerencias. 

                     //results

                     let result = [];
                    
                     result = utilsAnalysis.getUrlsRelated(maliciousIocs, matchedKeyword)

                    res.send(result)

                } else if (type == "hash"){
                    console.log("Es un hash")
                }



                res.send("objeto no existe");

            }

            
   
        } catch (error) {
            res.send(false);
            
        }
        
    }, 

    isindb : async function(req, res){
        console.log('entro en isindb')
        console.log(req.body)
        try {
            let analysis = await db.InvestigationDetail.findOne({
                where: {
                    ioc: req.body.ioc
                },
                raw: true});
            
            console.log("Esto es analysis de isindb")
            console.log(analysis)

            if (analysis){
                //id_investigationDetail: analysis.id_investigationDetail,
                let toSave = {
                    
                    id_investigation: req.body.id_investigation,
                    description : req.body.description,
                    ioc: analysis.ioc,
                    result: JSON.parse(analysis.result),
                    whois: JSON.parse(analysis.whois),
                    type: analysis.type,
                    info: analysis.info
                }
                utilsAnalysis.save(toSave);

                let parsed = {
                    id_investigationDetail: analysis.id_investigationDetail,
                    id_investigation: analysis.id_investigationDetail,
                    result: JSON.parse(analysis.result)
                }
                res.send(parsed);

            } else res.send("400")
            
        } catch (error) {
            console.log(error);
            
        }
    }, 

    getMaliciousIocs : async function(id){
        let results = [];

        //cambiar getIocByTypeAndMalicious por ID de la investigación.

        results = await utilsAnalysis.getIocByIDAndMalicious(id);
 
        return (results)


    },
    getCantByType: async function(req, res){

        try {
            let all = await utilsAnalysis.getAll();
           
            let malicious = 0;
            let suspicious = 0;
            let harmless = 0;
            let undetected = 0;

            for (i=0;i<all.length;i++){
                //console.log(all[i].result)
                let result = JSON.parse(all[i].result)
                console.log(result)

                if (result.malicious > 0){
                    malicious = malicious +1;
                }

                if (result.suspicious > 0){
                    suspicious = suspicious +1;
                }

                if (result.harmless > 0){
                    harmless = harmless +1;
                }

                if (result.undetected > 0){
                    undetected = undetected +1;
                }

                //all[i].result;
            }

            let labels = ["malicious","suspicious",  "harmless", "undetected"]

            let data = [malicious,suspicious,  harmless, undetected]
        

            res.send(JSON.stringify({labels, data}))
        } catch (error) {
            console.log(error)
            
        }

       
    }

    
       

   

    
    
}

