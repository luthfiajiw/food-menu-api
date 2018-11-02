const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


//set storage
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

let upload = multer({
  storage: storage
})

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('public'))

//Make database
const db = new Datastore({filename: '.data/db.json', autoload: true});

app.get('/', (req, res) => {
  res.send('Berhasil');
})

//Insert data
app.post('/api/data/', upload.single('img'), (req, res, file)=>{

  const data = {
    "name": req.body.name,
    "composition": req.body.composition,
    "price": req.body.price,
    "img": `uploads/${req.file.filename}`
  }
  console.log(data);

  db.insert(data, (err,docs) => {
    if (err) {
      res.send('Error')
      return;
    }
    res.send(docs);
  })
})

//List data
app.get('/api/data/', (req,res) => {
  db.find({}, (err,docs) =>{
    res.send(docs);
  })
})


//Update data
app.put('/api/data/:id', upload.single('img'), (req,res,file) => {
  const data = {
    "name": req.body.name,
    "composition": req.body.composition,
    "price": req.body.price,
    "img": `uploads/${req.file.filename}`
  }

  db.update({_id:req.params.id}, data,{},(err,num) => {
    res.send('Update Completed');
  })
})

//Delete data
app.delete('/api/data/:id', (req,res) => {
  db.remove({_id: req.params.id}, {}, (req,num) => {
    res.send('Delete Success');
  })
})

//Detail data
app.get('/api/data/:id', (req,res) => {
  db.find({_id: req.params.id}, {}, (err,docs) => {
    res.send(docs);
  })
})
//Make port
var listener = app.listen(2002, ()=>{
  console.log('Your app is listening on port : '+listener.address().port);
})
