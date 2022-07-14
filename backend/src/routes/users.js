const express = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/VerifyToken.js");
const refreshToken = require("../controllers/RefreshToken.js");

const router = express.Router();
//verifyToken, 
router.get('/users', userController.getUsers);

router.get('/users/:id', userController.userById);

router.get('/user/:id', userController.getUserById);

router.post('/usersEmail', userController.userByEmail);
 
router.post('/users', userController.register);

router.post('/login', userController.login);

//router.get('/token', refreshToken);


router.delete('/logout', userController.logout);


 
module.exports = router;