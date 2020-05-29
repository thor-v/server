const express = require('express');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');
const Camera = require('./Camera');
const cors = require('cors');
const {unlink} = require('fs-extra');

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime()+path.extname(file.originalname));
    }
});
const upload = multer({storage});

const app = express();
require('./database');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', async (req, res) => {
    try{
        const camera = await Camera.find();
        res.status(200).json(camera);
    } catch(err){
        res.status(500).send(err);
    }
});

app.get('/images/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const camera = await Camera.findById(id)
        res.status(200).json(camera);
    } catch(err){
        res.status(500).send(err);
    }
});

app.post('/add', upload.single('imageUrl'), async (req, res) => {
    const {title, price} = req.body;
    const {filename} = req.file;
    const newCamera = new Camera({
        title,
        price: Number(price)
    });        
    newCamera.imageUrl = '/'+filename;
    await newCamera.save();
    // console.log(newCamera);
    res.status(200).json({msg:'Guardado'});
});

app.put('/add/:id', upload.single('imageUrl'), async (req, res) => {
    try{
        const {id} = req.params;
        const {title, price} = req.body;
        if(req.file) {
            const updCamera = {
                title,
                price: Number(price)
            };
            const photo = req.file;
            // console.log(req.file);
            updCamera.imageUrl = '/'+photo.filename;
            const camera = await Camera.findByIdAndUpdate(id,updCamera);
            if(camera.imageUrl === '/category.jpg'){
                res.json({msg: 'Actualizado los datos con foto 1 sin foto'});
            } else {
                await unlink(path.resolve('./src/uploads'+camera.imageUrl));
                res.json({msg: 'Actualizado los datos con foto 1 con foto'});
            }
            // res.status(200).json({msg:'Guardado'});
        } else {
            const updCamera = {
                title,
                price: Number(price)
            };
            const camera = await Camera.findByIdAndUpdate(id,updCamera);
            res.status(200).json({msg:'Actualizado solo los datos.'});
        }
        // await newCamera.save();
    } catch(err){
        res.status(500).send(err);
    }
});

app.delete('/delete/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const camera = await Camera.findByIdAndDelete(id);
        await unlink(path.resolve('./src/uploads'+camera.imageUrl));
        res.json({msg: 'Imagen Eliminada.'});
    }catch(err){
        res.status(500).send(err);
    }
});

app.use(express.static(path.join(__dirname,'uploads')));

app.listen(4000, () => {
    console.log('Server on start.');
    console.log(__dirname);
});