const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('./model')

var cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 5000;

const ECB_model = mongoose.model("ECB")

const mongoUri = "mongodb+srv://abrahag40:My2fViVMaBRPwcG@cluster0.fleig.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("connected", () => {
    console.log("--connected to mongo--")
})

mongoose.connection.on("error", () => {
    console.log("error", err)
})

app.get('/', (req, res) => {
    ECB_model.find({}).then(data => {
        res.send(data)
    }).catch(error => log(error))
})

app.post('/send-data', (req, res) => {
    const send = new ECB_model({
        description: req.body.description,
        make: req.body.make,
        model: req.body.model,
        estimatedate: req.body.estimatedate,
        id: req.body.id,
        image: req.body.image,
        km: req.body.km,
        maintenance: req.body.maintenance,
        responsable: String
    })
    send.save()
        .then(data => {
            console.log(data);
            res.send("--success--")
        }).catch(error => log(error))
})

app.post('/delete', (req,res) => {
    ECB_model.findByIdAndRemove(req.body.id)
    .then(data => {
        console.log(data)
        res.send("deleted")
    }).catch(error => log(error))
})

app.post('/upload', (req, res) => {
    ECB_model.findByIdAndUpdate(req.body.id, {
        description: req.body.description,
        make: req.body.make,
        model: req.body.model,
        estimatedate: req.body.estimatedate,
        id: req.body.id,
        image: req.body.image,
        km: req.body.km,
        maintenance: req.body.maintenance,
        responsable: String
    }).then(data => {
        console.log(data);
        res.send("Updated")
    }).catch(err => console.log(err))
})

app.listen(3001, () => {
    console.log("server running")
})