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
    investigations: function (req, res) {
        res.render("investigations");
    },
    analysis: function (req, res) {
        res.render("analysis");
    },
    create: async function (req, res) {
        //let checked = req.body.ispublic;
        console.log(req.body)
        
        try {
        const objCreate = await db.Investigation.create({
            id_analyst: 1,
            id_user: 1, 
            closed: false, 
            description: req.body.description,
            likes: "ninguno",
            dislikes: "ninguno",
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
    check2: function (req, res) {

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
    check: function (req, res) {

        //console.log(req.body)

        let ioc = req.body.ioc;
        console.log(ioc+" "+req.body.select);

        if(req.body.select == "ip"){
            //console.log(process.env)

            const theSameObject = defaultTimedInstance.ipLookup(ioc, function(err, value){
                if (err) {
                  console.log('Well, crap.');

                  console.log(err);
                  return;
                }

                let datos = JSON.parse(value);
                let whois = datos.data.attributes.whois//.split("\n");
                console.log(datos.data);
    
                const str = whois;
                const toObject = (str) => {
                  const json = str.replace(/([^\:]+)\:([^\n]+)\n/g, (_, p1, p2) => {
                    return `"${p1.replace(/\s+/g, '')}":"${p2.trim()}",`;
                  });
                  return JSON.parse(`{${json.slice(0, -1)}}`);
                };
                //console.log(toObject(str));
    
                let whoisInfo = toObject(whois);

                console.log("esto es whoisInfo"+JSON.stringify(whoisInfo));

                let whoIs2 = {
                    organization: whoisInfo.Organization,
                    cidr: whoisInfo.CIDR,
                    country: whoisInfo.Country,
                    city: whoisInfo.City,
                    address: whoisInfo.Address,
                    description: whoisInfo.descr
                }
                //console.log(whoIs2);
               
                //res.send(value);
                let objResp = {
                   reputation: datos.data.attributes.reputation, 
                    //resultado: Object.values(datos.data.attributes.last_analysis_stats), 
                    whois: JSON.stringify(whoIs2)//JSON.stringify(whoisInfo)//datos.data.attributes.whois
    
                }
                let obj = {
                    description: req.body.description,
                    ioc: ioc,
                    result: objResp
                }
                //el metodo create de sequelize te devuelve el objeto guardado1!!!!!
               let hola2 =  utilsAnalysis.save(JSON.stringify(obj));
               console.log(hola2);

                const asd = async function (){

                    try {
                        let lastRow = await db.InvestigationDetail.findOne({
                            order: [ [ 'id_investigationDetail ', 'DESC' ]],
                            });
                        console.log("Ultimo registro :"+lastRow);
                        
                    } catch (error) {
                        
                    }
                   
                }

                asd();

               
               //console.log(objResp);
               //console.log(Object.values(datos.data.attributes.last_analysis_stats));
                //res.send(objResp);
                
                res.render("analysis", {result: objResp});
               
              });


        
        
        
        
        
        
        
        
            } else if (req.body.type == "url"){

        
        } else if (req.body.select == "type"){
                //'wikionemore.com'
            const theSameObject = defaultTimedInstance.domainCommentLookup(ioc, function(err, value){
                if (err) {
                  console.log('Well, crap.');
                  console.log(err);
                  return;
                }
                
                let datos = JSON.parse(value);
                let objResp = {
                    reputation: datos.data[0].attributes.text, 
                     resultado: Object.values(datos.data.attributes.last_analysis_stats), 
                     whois: JSON.stringify(whoisInfo)//datos.data.attributes.whois
     
                 }
                console.log(objResp);

                 res.render("analysis", {result: objResp});
                // console.log(datos.data[0]);
                 //console.log(typeof datos.data)
                //res.send(datos.data[0].attributes.text);
               
              });

        }else if (req.body.type == "hash"){
            //08a542fe7f8450d2c66b5e428872860d584bc5be714a50293a10aef415310fe8

        }

       
         
        
    
    },
 
    
}


/*
    ch3ck: function(dato, type) {
        console.log(dato)
        let ioc = dato;
        console.log(ioc+" "+type);

            const theSameObject = defaultTimedInstance.ipLookup(ioc, function(err, value){
                if (err) {
                  console.log('Well, crap.');
                  console.log(err);
                  return;
                }

                console.log(value)
               
                let datos = JSON.parse(value);
                let whois = datos.data.attributes.whois//.split("\n");
    
                const str = whois;
                const toObject = (str) => {
                  const json = str.replace(/([^\:]+)\:([^\n]+)\n/g, (_, p1, p2) => {
                    return `"${p1.replace(/\s+/g, '')}":"${p2.trim()}",`;
                  });
                  return JSON.parse(`{${json.slice(0, -1)}}`);
                };
                //console.log(toObject(str));
    
                let whoisInfo = toObject(whois);
                let whoIs2 = {
                    organization: whoisInfo.Organization,
                    cidr: whoisInfo.CIDR,
                    country: whoisInfo.Country,
                    city: whoisInfo.City,
                    address: whoisInfo.Address,
                    description: whoisInfo.descr
                }
                console.log(whoIs2);
               
                //res.send(value);
                let objResp = {
                   reputation: datos.data.attributes.reputation, 
                    resultado: Object.values(datos.data.attributes.last_analysis_stats), 
                    whois: JSON.stringify(whoIs2)//JSON.stringify(whoisInfo)//datos.data.attributes.whois
    
                }

                return objResp;

               
              });
              return "hola";
            },
    save3: async function(ioc){
        try {
           let obj =  await db.InvestigationDetail.create({
                id_investigation: 1,
                description: ioc.description,
                ioc: ioc.ioc,
                result: ioc.result

            });
            return obj;//res.render("Analysis", {});//aca van los iocs para una investigación
            
        } catch (error) {
            console.log(error);
            
        }


    }, */