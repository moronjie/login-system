const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../model/User")
const verifyToken = require("../middleware/verifyToken")


//register user
router.post("/register", async (req, res) => {
    try {
        const existingUser = await User.findOne({email: req.body.email});
        existingUser && res.status(409).send("user already exist");

        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(req.body.password, salt)

        const user = new User({...req.body, password: hashpassword});

        const newUser = await user.save()
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})

// login user
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        !user && res.status(400).json({"msg": "user not found. Create an account"})

        const comparePassword = await bcrypt.compare(req.body.password, user.password)
        !comparePassword && res.status(403).json({msg: "wrong password"})

        const accessToken = jwt.sign({id: user._id}, process.env.SECRETTOKENKEY, {expiresIn: "1hr"})

        res.cookie("verificationToken", accessToken, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",

        })
        const {password, ...others} = user._doc

        res.status(200).json({others, "accessToken": accessToken})
    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})

//get user
router.get("/", verifyToken, async (req, res) => {
    try {
        const newUser = await User.findById(req.user._id)
        !newUser && res.status(400).json({"msg": "user not found"})

        const {password, ...others} = newUser._doc

        res.status(201).json(others)
    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})


module.exports = router