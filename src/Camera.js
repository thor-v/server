const {Schema, model} = require('mongoose')
const CameraSchema = new Schema({
    title: String,
    price: Number,
    imageUrl: String
});

// CameraSchema.methods.setImgUrl = function setImgUrl(filename){
//     this.imageUrl = 'http://192.168.0.4:4000/'+filename;
// }

module.exports = model('Camera', CameraSchema);