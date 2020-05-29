const moongose = require('mongoose');
moongose.connect('mongodb://localhost:27017/camera',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(db => console.log('DB is connected'))
.catch(err => console.error(err));