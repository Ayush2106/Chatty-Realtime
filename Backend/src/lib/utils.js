import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
    //generate jwt token
    const token = jwt.sign({userId} ,process.env.JWT_SECRET, {expiresIn:'7d'})
   
    //send jwt token as cookie to user specially in http cookie
    res.cookie("jwt", token ,{
        maxAge: 7*24*60*60*1000, //  7d in milisecond
        httpOnly: true, //prevent xss attck
        sameSite: "strict", // CSRF attack cross site request  forgery attack
        secure: process.env.NODE_ENV !== "development"
    })
    return token ;
}