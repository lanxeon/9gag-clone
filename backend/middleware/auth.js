const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const tokenData = jwt.verify(token, "8d7043d23c8bf0a9b6ac01253749d34d");
        req.isAuthenticated = true;
        req.userData = { email: tokenData.email, userId: tokenData.userId, username: tokenData.username, userDp: tokenData.userDp };
        next();
    }
    catch(err) {
        req.isAuthenticated = false;
        next();
    }
} 