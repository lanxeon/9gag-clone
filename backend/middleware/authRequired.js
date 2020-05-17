
module.exports = (req, res, next) => {

    if(!req.isAuthenticated) {
        // console.log("gonna throw authentication error here");
        res.status(401).json({
            message: "Please log in first!"
        });
    }
    else 
        next();
}
