const dotEnv = require("dotenv").config();
const { response } = require("express");
const { sequelize } = require("../database/models");
const db = require("../database/models"); 
const investigationController = require("./investigationController")



module.exports = {
    
    getAll: async function (req, res) {
        try {
            let investigation = await db.Investigation.findAll({
                attributes: [
                    "id_user",
                    [sequelize.fn("COUNT", sequelize.col("id_investigation")), 
                    "cont_id_investigation"],
                ],
                group: "id_user",
                raw: true, 
                limit: 5});
            return investigation;
            
        } catch (error) {
            console.log(error);
            
        }

    }
    


    
  
}