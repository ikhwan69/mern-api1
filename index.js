const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path')  // untuk mengatasi error pemanggilan image dari server
const env = require('dotenv');

const server = express();
const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');

//Menyimpan  upload image
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images'); // dimana folder image di simpan
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

// Menyaring format images jpg, png, jpeg
const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg'
    ){
        cb(null, true)
    } else {
        cb(null, false);
    }
}

server.use(bodyParser.json()) // yang akan diterima type JSON
// untuk mengatasi error pemanggilan image dari server
server.use('/images', express.static(path.join(__dirname, 'images')))
server.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

server.use('/v1/auth', authRoutes )
server.use('/v1/blog', blogRoutes )

server.use((error, req, res, next) => {
   const status = error.errorStatus || 500;
   const message = error.message;
   const data = error.data;
   res.status(status).json({message: message, data: data});
})

env.config()
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@mern-blog.3i3ue.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Databased Connected");
})
.catch(err => console.log(err));

server.listen(process.env.PORT, () => {
    console.log(`Server berjalan di port ${process.env.PORT}`);
    
})
