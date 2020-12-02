const express = require('express');

const app = express();
const router = express.Router();

router.use('/products', (req, res, next) => {
    // console.log('url : ',req.originalUrl);
    // console.log('method : ',req.method);
    res.json({name: "Ikhwanul Rahman", email: "ikhwanrahman76@gmail.com"});
    next();
})

router.use('/price', (req, res, next) => {
    res.json({price: 3000});
    next();
})

router.get('/customer', (req, res, next) => {
    res.json({title:"Customer"});
    next();
})

app.use('/', router)

// GET '/users' ===> [{name: ikhwan}]
app.listen(4000);