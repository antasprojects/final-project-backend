const jwt = require('jsonwebtoken');

function authenticator(req, res, next) {
    const token = req.headers['authorization'];
    console.log('Token Received:', token);

    if (token) {
        jwt.verify(token.split(' ')[1], process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error('Token Verification Error:', err);
                res.status(403).json({ error: 'Invalid token' });
            } else {
                console.log('Decoded Token:', decoded);
                req.user_id = decoded.user_id;  // Attach the user_id to the request object
                next();  // Proceed to the next middleware or route handler
            }
        });
    } else {  
        res.status(403).json({ error: 'Missing token' });
    }
}

module.exports = authenticator;
