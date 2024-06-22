module.exports = {
    verifyToken: function(req, res, next) {
        // get auth header value
        const bearerHeader = req.headers['authorization'];
        // Separate token from 'Bearer ' header
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        } else {
            res.sendStatus(403);
            // res.json({message: 'Login required'})
        }
    } 

}