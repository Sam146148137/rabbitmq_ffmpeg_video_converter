const {Schema, model} = require('mongoose');

const Convert = new Schema({
    source: {
        type: String,
        required: true,
    },

    converted: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        default: 'not started',
    },
})

module.exports = model('Converts' , Convert);
