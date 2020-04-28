const express = require('express');
const bp = require('body-parser');
const path = require('path');

const app = express();

//body-parser middleware
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));
app.use('/images', express.static(path.join("backend/images")));


//For enabling CORS
app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", 
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );

    next();
});

module.exports = app;