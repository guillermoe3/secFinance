const db = require("../database/models")
const nvt = require("node-virustotal");
const defaultTimedInstance = nvt.makeAPI();
const theSameKey = defaultTimedInstance.setKey('3154df46b6cd5db1c4d1d57137850102624f51b1cd47b999fb109754d6cc9c35');
const utils = require("./utils")


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
        
        try {
        await db.Investigation.create({
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
        return res.redirect("analysis", );
            
        } catch (error) {
            console.log(error);
            
        }
    },
    check: function (req, res) {

        let ioc = req.body.ioc;
        console.log(ioc+" "+req.body.select);

        if(req.body.select == "ip"){

            const theSameObject = defaultTimedInstance.ipLookup(ioc, function(err, value){
                if (err) {
                  console.log('Well, crap.');
                  console.log(err);
                  return;
                }

                //console.log(value)
               
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
               let hola2 =  utils.save(JSON.stringify(obj));
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


        } else if (req.body.select == "url"){

        
        } else if (req.body.select == "domain"){
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

        }else if (req.body.select == "hash"){
            //08a542fe7f8450d2c66b5e428872860d584bc5be714a50293a10aef415310fe8

        }

       
         
        
    
    },
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


    },
    save2: function (req, res) {
        console.log(req.body.ioc);
        let cuatro = this.ch3ck();
        //let hola = ch3ck(req.body.ioc, req.body.select);
        return hola;
        //let ioc = this.ch3ck(req.body.ioc, req.body.select);
        //console.log(ioc);
        /*
        try {
            await db.InvestigationDetail.create({
                id_investigation: 1,
                description: req.body.description,
                ioc: ioc.ioc,
                result: ioc.result

            });
            return res.render("Analysis", {});//aca van los iocs para una investigación
            
        } catch (error) {
            console.log(error);
            
        }
        */
    }
}

// {message: 'SALIO TODO BIEN', result: res}
            //console.log(JSON.stringify(res));
            //let datos = JSON.stringify(value);
            //res.send({message: 'SALIO TODO BIEN', result:datos});


//module.exports = analysisController;