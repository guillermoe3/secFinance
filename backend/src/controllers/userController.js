const db = require("../database/models")
const { resolveNaptr } = require("dns");
const bcrypt = require('bcryptjs');
const Users = require("../database/models/UserModel")
const jwt = require("jsonwebtoken")



let userController = {

    getUsers: async function (req, res) {
        try {
            const users = await db.Users.findAll({
                attributes:['id_usuario','name','email']
            });
            res.json(users);
        } catch (error) {
            console.log(error);
        }
    }, 
    userById: async function (req, res) {
        try {
            const user = await db.Users.findByPk(req.params.id)
            res.send(user);
            
        } catch (error) {
            console.log(error)
            
        }
    },
    userByEmail: async function (req, res) {
        try {
            const user = await db.Users.findOne({
                where : {
                    email: req.body.email
                }
            })
            res.send(user);
            
        } catch (error) {
            console.log(error)
            
        }
    },
    register: async function (req, res) {
        console.log(req.body);
        
        const { name, lastname, email, password, confPassword } = req.body;
        if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        try {
            await db.Users.create({
                name: name,
                lastname: lastname,
                email: email,
                password: hashPassword
            });
            res.json({msg: "Registration Successful"});
        } catch (error) {
            console.log(error);
        }
    },

    login : async function (req, res) {
        console.log(req.body)
        try {
            const user = await db.Users.findAll({
                    where:
                    {
                        email: req.body.email
                    }
            });

            const match = await bcrypt.compare(req.body.password, user[0].password);

            if(!match) return res.status(400).json({msg: "Wrong Password"});
            const userId = user[0].id_usuario;
            const name = user[0].name;
            const email = user[0].email;
            const role = user[0].role;
            const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '15s'
            });
            
            const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
                expiresIn: '1d'
            });
            await db.Users.update({refresh_token: refreshToken},{
                    where:
                    {
                        id_usuario: userId
                    }
            });
            res.cookie('refreshToken', refreshToken,{
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            res.json({email, role, accessToken });
        } 
        
        catch (error) {
            console.log(error)
            res.status(404).json({msg:"Email not found or password incorrect"});
        }
    }, 
    logout : async function (req, res) {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204);
        const user = await db.Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(204);
        const userId = user[0].id_usuario;
        await db.Users.update({refresh_token: null},{
            where:{
                id_usuario: userId
            }
        });
        res.clearCookie('refreshToken');
        return res.sendStatus(200);
    }

}

module.exports = userController;
