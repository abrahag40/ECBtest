const mongoose = require('mongoose')

const CarsSchema = new mongoose.Schema({
    description: String,
    make: String,
    model: String,
    estimatedate: String,
    id_: String,
    image: String,
    km: String,
    maintenance: Boolean,
    responsable: String
})

mongoose.model("ECB", CarsSchema)