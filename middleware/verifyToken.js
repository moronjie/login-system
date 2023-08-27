const jwt = require("jsonwebtoken")
const User = require("../model/User")

const verifyToken = async (req, res, next) => {
    try {
        const cookieHeader = req.headers.cookie
        const token = cookieHeader.split("=")[1]
        const decode = jwt.verify(token, process.env.SECRETTOKENKEY)
        if(!decode) return res.status(401).json({"msg": "you are not authorized"})

        const user = await User.findById(decode.id)
        !user && res.status().json({"msg": "user not authorized"})
        req.user = user

        next() 
    } catch (err) {
        res.status(500).json({"msg": err.message})
    }
}

module.exports = verifyToken