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
                    ioc: req.body.ioc,
                    description: req.body.description,
                    result: lastAnalysis,
                    whois: whois,
                    timestamp: Date.now()
                }

                //guardar datos en DB
                let saveObject = utilsAnalysis.save(data);//JSON.stringify(

                res.send(data);
              });
            

        }else if (req.body.type == "url"){
            //const hashed = nvt.sha256('http://wikionemore.com/');
            const hashed = nvt.sha256(ioc);
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

        try {
            let analysis = await db.InvestigationDetail.findAll({
                where: {
                    id_investigation: req.params.id
                },
                raw: true});
            res.send(JSON.stringify(analysis));
            
        } catch (error) {
            console.log(error);
            
        }

    },
    getById: function(req, res) {

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


    }
    
    
}

