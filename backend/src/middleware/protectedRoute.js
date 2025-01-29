const jwt = require('jsonwebtoken');

const protectedRoute = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token)
        return res.status(401).json({ message: "You are not authenticated" })
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded) {
            return res.status(401).json({ message: "Invalid token" })
        }
        req.userId = decoded.userId;
        next();
    } catch(e) {
        return res.status(400).json({ message: "Invalid token" })
    }

}

module.exports = protectedRoute;