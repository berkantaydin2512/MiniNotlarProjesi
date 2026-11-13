const express = require('express');
const app = express();

const notlarRouter = require('./routes/notlar.js');
const logger = require("./middleware/logger.js")

const PORT = 3000;

app.use(express.json());
app.use(logger);


app.use('/notlar', notlarRouter);

app.use((req, res) => {
    res.status(404).json({
       hata: 'Endpoint bulunamdı',
       url: req.url
     });
});


app.use((err, req, res, next) => {
const durum = err.durum || 500;
   const mesaj = err.message || 'Sunucu hatası';
   
   console.error(`[${durum}] ${mesaj}`)
   res.status(durum).json(
    { 
        basarili: false,
        hata: mesaj 

    });    
});


app.listen(PORT, ()=> {
    console.log(` Notes API: http://localhost:${PORT}`)
})