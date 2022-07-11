//const mainModel = require('../models/mainModel')
const db = require("../database/models")
const analysisController = require("./analysisController")
const { Op } = require("sequelize");




module.exports = {

  
    getCategoryFromUrl: function (description){

        console.log("zzzzzzzzzzz entro a getCategoryFromUrl de utilsUrlsAnalysis")

        descriptionArray = [];
        let keywords = ["malware", "command and control", "botnets", "botnet", "compromised website", "encrypted", "keylogger", "malicious", "phishing",
                            "spyware", "mobile", "hacking", "security", "facebook", "youtube", "exploits", "suspicious", "bot", "domain", "web infraestructure"]

        descriptionArray = description.split(" ");

       // console.log(descriptionArray);
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
    }


}