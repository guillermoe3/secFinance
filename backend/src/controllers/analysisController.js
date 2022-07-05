const dotEnv = require("dotenv").config();
const db = require("../database/models"); 
const nvt = require("node-virustotal");
const defaultTimedInstance = nvt.makeAPI(10000);
const vt_api = process.env.TOKEN_VT;
const theSameKey = defaultTimedInstance.setKey(vt_api);
const utilsAnalysis = require("./utilsAnalysis")


//let analysisController = 
module.exports = {
    index: function (req, res) {
        res.render("index");
        
    },
    analysis: function (req, res) {
        res.render("analysis");
    },
    check: function (req, res) {

        console.log(req.body)

        //req.body recibo el type, ioc, y notes. 
        let ioc = req.body.ioc;
        if(req.body.type == "ip"){
            
            const theSameObject = defaultTimedInstance.ipLookup(ioc, function(err, value){
                if (err) {
                  console.log('Well, crap.');
                  console.log(err);
                  return;
                }
               
                let datos = JSON.parse(value);
                let lastAnalysis = datos.data.attributes.last_analysis_stats;
               
                let whoisData = datos.data.attributes.whois
                //parse WhoisData
                const str = whoisData;
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
                //Armo json para devolver al front y guardar en DB.
                let data = {
                    id_investigador : req.body.id_investigador,
                    ioc: req.body.ioc,
                    description: req.body.description,
                    result: lastAnalysis,
                    whois: whois,
                    timestamp: Date.now(),
                    type: "ip",
                }

                //guardar datos en DB
                let saveObject = utilsAnalysis.save(data);//JSON.stringify(

                res.send(data);
              });
            

        }else if (req.body.type == "url"){
            //const hashed = nvt.sha256('http://wikionemore.com/');
            console.log("este es el ioc" + ioc)
            const hashed = nvt.sha256(ioc);
            console.log("este es el ioc hashed" + hashed)
            const theSameObject = defaultTimedInstance.urlLookup(hashed, function(err, value){
                if (err) {
                  console.log('Well, crap.');
                  console.log(err);
                  return;
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
                    ioc: req.body.ioc,
                    description: req.body.description,
                    result: lastAnalysis,
                    whois: whois,
                    type: "url",
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
                    ioc: req.body.ioc,
                    description: req.body.description,
                    result: lastAnalysis,
                    whois: whois,
                    type: "hash",
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
                    ioc: req.body.ioc,
                    description: req.body.description,
                    result: lastAnalysis,
                    whois: whois,
                    type: "domain",
                    timestamp: Date.now()
                }
                 //guardar datos en DB
                let saveObject = utilsAnalysis.save(data);
                
                res.send(data);

              });
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

                 for (i=0; i < invs.length;i++){
                     analysis.push(await utilsAnalysis.getAnalysisByInvestigationId(invs[i] ));
                 }

                 let result = await utilsAnalysis.getTop3Analysis(analysis);
                 let filtrado = result.filter( dato => dato.ioc !== ioc)
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

                    results = utilsAnalysis.getIpsWithSameRange(partialIoc, maliciousIocs);

                    res.send(results)
                    //console.log(results)

                } else if (type == "url"){
                    console.log("Es una url")
                } else if (type == "hash"){
                    console.log("Es un hash")
                }



                res.send("objeto no existe");

            }

            
   
        } catch (error) {
            res.send(false);
            
        }
        
    }
    
    
}

