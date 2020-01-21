const jwt = require("jsonwebtoken")

module.exports = function(req, res, next){
const token = req.header("token")
if(!token) return res.status(401).json({message : "authentication error"})

try{
    const decoded = jwt.verify(token, "secret")
    req.user = decoded.user 
    next()
}
catch (e){
console.error(e)
res.status(500).json({message : "invalid token"})
}
}