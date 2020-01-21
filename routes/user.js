const express = require("express")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const router = express.Router()

const User = require("../model/User")

/**
 * @method - POST
 * @param - /signup
 * description - User SignUp
 */

 router.post(
     "/signup",
     [
         check("username", "Please enter a valid username").not().isEmpty(),
         check("email", "please enter a valid email").isEmail(),
         check("password", "please enter a valid password").isLength({ min: 6})
     ],
     async (req, res) => {
         const errors = validationResult(req);
         if(!errors.isEmpty()) {
             return res.status(400).json({
                 errors : errors.array()
             })

             const {
                 username,
                 email,
                 password
             } = req.body
             try {
                 let user = await User.findOne({
                     email
                 })
                if (user) {
                    return res.status(400).json({
                        message : "user already exists"
                    })
                }
             user = new User({
                 username,
                 email,
                 password
             })

             const salt = await bcrypt.genSalt(10)
             user.password = await bcrypt.hash(password, salt)

             await user.save()

             const payload = {
                 user : {
                     id : user.id 
                 }
             }

             jwt.sign(
                 payload, "secret", {
                     expiresIn : 3600
                 }, 
                 (err, token) => {
                     if (err) throw err
                     res.status(200).json({
                         token
                     })
                 }

             )

             }
catch (err) {
    console.log(err.message)
    res.status(500).send("error in saving")
}
             }
         }
 )

 router.post("/login", 
 [
     check("email", "please enter a valid email").isEmail(),
     check("password","please enter a valid password").isLength({
         min : 6
     })
 ],
 async (req, res) =>{
     const errors = validationResult(req)

     if(!errors.isEmpty()){
         return res.status(400).json({
             errors : errors.array()
         })
     }

const {email, password} = req.body

try {
    let user = await User.findOne({
        email
    })
    if(!user)
    return res.status(200).json({
        message : "user does not exist"
    })
    
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(400).json({
            message : "wrong password. input the right password "
        })

        const payload = {
            user : {
                id : user.id
            }
        }
        jwt.sign(
            payload, 
            "secret",
            {
                expiresIn : 3600
            }, 
            (err, token) => {
                if(err) throw err
                res.status(400).json({
                    token              
                  })
            }
        )


    }
}catch (e) {
    console.error(e)
    res.status(500).json({
        message : "server error "
    })
}
}
 )

/**
 * method - POST 
 * description - get logged in user
 * @param -/user/me */

 router.get("/me", auth, async(req, res) =>{
     try{
             //request.user is getting fetched from middleware after token authentication 

        const user = await User.findById(req.user.id)
        res.json(user)
     }
     catch (e){
         res.send({message : "error in fetching the user "})

     }
 })


 module.exports = router