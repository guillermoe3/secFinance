//const mainModel = require('../models/mainModel')
const nvt = require("node-virustotal");
const defaultTimedInstance = nvt.makeAPI();
const theSameKey = defaultTimedInstance.setKey('3154df46b6cd5db1c4d1d57137850102624f51b1cd47b999fb109754d6cc9c35');


let analysisController = {
    index: function (req, res) {
        res.render("home");
    },
    analysis: function (req, res) {
        res.render("analysis");
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
               
                //res.send(value);
                let objResp = {
                   reputation: datos.data.attributes.reputation, 
                    resultado: Object.values(datos.data.attributes.last_analysis_stats), 
                    whois: JSON.stringify(whoisInfo)//datos.data.attributes.whois
    
                }
               console.log(objResp);
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
                     //resultado: Object.values(datos.data.attributes.last_analysis_stats), 
                     //whois: JSON.stringify(whoisInfo)//datos.data.attributes.whois
     
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

       
         
        
    
    }
}

// {message: 'SALIO TODO BIEN', result: res}
            //console.log(JSON.stringify(res));
            //let datos = JSON.stringify(value);
            //res.send({message: 'SALIO TODO BIEN', result:datos});


module.exports = analysisController;