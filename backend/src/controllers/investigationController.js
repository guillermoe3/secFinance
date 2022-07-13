const dotEnv = require("dotenv").config();
const { response } = require("express");
const db = require("../database/models"); 
const analysisController = require("./analysisController")



module.exports = {
    investigations: function (req, res) {
        res.render("investigations");
    },
    create: async function (req, res) {
        //let checked = req.body.ispublic;
        console.log(req.body)
        console.log("está en create")
        
        try {
        const objCreate = await db.Investigation.create({
            id_analyst: 0,
            id_user: req.body.id_user, 
            closed: false, 
            description: req.body.description,
            likes: "",
            dislikes: "",
            date_creation: Date.now(),
            isPublic: req.body.ispublic ? true : false, 
            isShared: true, 
            title: req.body.title,
            validated: false, 
            comments : "",
            review: 0
            
            });
        //console.log(db.Investigation.id_investigation); 
        //return res.redirect("analysis", );

        return res.send(JSON.stringify(objCreate))
            
        } catch (error) {
            console.log(error);
            
        }
    }, 

    getAll: async function (req, res) {
        try {
            let investigation = await db.Investigation.findAll({raw: true});
            res.send(JSON.stringify(investigation));
            
        } catch (error) {
            console.log(error);
            
        }

    }, 
    getById: async function (req, res) {
        try {
            let investigation = await db.Investigation.findAll({
                where: {
                    id_investigation: req.params.id
                },
                raw: true});
            res.send(JSON.stringify(investigation));
            
        } catch (error) {
            console.log(error);
            
        }

    }, 
    
    getByUserId: async function (req, res) {
        try {
            let investigation = await db.Investigation.findAll({
                where: {
                    id_user: req.params.user
                },
                raw: true});
            res.send(JSON.stringify(investigation));
            
        } catch (error) {
            console.log(error);
            
        }

    }, 
    update: async function (req, res) {

        //console.log(req.body)

        try {

            let updated  = await db.Investigation.update({
                closed: req.body.closed, 
                id_analyst: req.body.id_analyst, 
                description: req.body.description,
                isPublic: req.body.ispublic,
                isShared: req.body.isShared, 
                title: req.body.title,
                validated: req.body.validated,
                review : req.body.review, 
                comments : req.body.comments
    
            },{
                where: {id_investigation: req.params.id}
            })
    
           console.log(updated);
           res.send("ok");
            
        } catch (error) {

            console.log("error")
            
        }



    }, 

    delete: async function (req, res) {


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

    isClosed : async function (req, res){

        try {

            let investigation = await db.Investigation.findAll({
                where: {
                    id_investigation: req.params.id
                },
                raw: true});

            if(investigation[0].closed == 1){
                res.send(true);
            } else res.send(false);

        
        } catch (error) {

            console.log(error)
            
        }

    }, 

    isRequested : async function(req, res){
      
        try {
            let investigation = await db.Investigation.findAll({
                where: {
                    id_investigation: req.params.id
                },
                raw: true});

                if(investigation[0].review == "1"){
                    res.send(true);
                } else res.send(false);
            
        } catch (error) {
            console.log(error)
            
        }
    }, 
    isValidated : async function(req, res){
      
        try {
            let investigation = await db.Investigation.findAll({
                where: {
                    id_investigation: req.params.id
                },
                raw: true});

                if(investigation[0].validated == "1"){
                    res.send(true);
                } else res.send(false);
            
        } catch (error) {
            console.log(error)
            
        }
    }, 
    toReview : async function(req, res){
        try {

            let investigations = await db.Investigation.findAll({
                where: {
                    review: "1"
                },
                raw: true
            })

            res.send(investigations)
            
        } catch (error) {
            
            console.log(error)
        }
    }, 
    myReviews : async function(req, res){
        try {

            let investigations = await db.Investigation.findAll({
                where: {
                    id_analyst: req.params.id
                },
                raw: true
            })

            res.send(investigations)
            
        } catch (error) {
            
            console.log(error)
        }
    },

    isCommented: async function (req, res){
        try {

            let comment = await db.Investigation.findAll({
                where: {
                    id_investigation: req.params.id
                },
                raw: true});

                if (comment[0].comments != ""){
                    //console.log(comment[0].comments)
                    let commentObj = {
                        comment: comment[0].comments,
                    }
                    console.log(commentObj)

                    res.send(JSON.stringify(commentObj))
                } else res.send("")
            
        } catch (error) {

            console.log(error)
            
        }
    }, 
    getStatistics : async function (req, res){
        let id = req.params.id;

        let analysis = await analysisController.getAllbyInvestigationID(id);
    
        let malicious = await analysisController.getMaliciousIocs(id);

        let total = analysis.length;
        let mal = malicious[0].length;
        
        
        let infoIoc = JSON.parse(malicious[1].result);

        let stats = {
            "totalCount": analysis.length,
            "maliciousCount": malicious[0].length,
            "percentThreat" : `%${(mal*100)/total}`,
            "mostVotedMalicious": malicious[1].ioc,
            "cantMalicious": `${infoIoc.malicious}`
        
        }
        res.send(stats)

    }
    


    
  
}