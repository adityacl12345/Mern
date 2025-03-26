const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require("cors");

const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const commentsRoutes = require('./routes/comments-routes');

const app = express();

app.use(bodyParser.json());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/comments', commentsRoutes);

app.use('/api/places', placesRoutes);

app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if(req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if(res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occured!'});
});

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vox37vq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        app.listen(process.env.PORT || 5000);
    })
    .catch(err => {
        console.log(err);
    });


/* fs.writeFile('userName.txt', 'Name: ' + Name, (err) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log('Wrote File!')
});

app.use((req, res, next) => {
    let body = '';
    req.on('end', () => {
        const userName = body.split('=')[1];
        if(userName) {
            req.body = {name: userName};
        }
        next(); 
    });
    req.on('data', (chunk) => {
        body+=chunk;
    });
});

const server = http.createServer((req,res)=>{
    console.log('Incoming Request...');
    console.log(req.method, req.url);

    if(req.method === 'POST') {
        let body = '';
        req.on('end',()=>{
            res.end('<h1>Got the Post Request.</h1>')
        });
        req.on('data',(chunk)=>{
            body+=chunk;
        });

    } else {
        res.setHeader('content-type','text/html')
        res.end('<form method="POST"><input type="text" name="username"/><button type="submit">Create User</button></form>');
    }
}); 
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/user', (req, res, next) => {
    res.send('<h1>User: ' + req.body.username + '</h1>'); 
});

app.get('/', (req, res, next) => {
    res.send('<form action="/user" method="POST"><input type="text" name="username"/><button type="submit">Create User</button></form>')
});


*/