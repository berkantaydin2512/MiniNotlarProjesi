const express = require('express');
const router = express.Router();
const notlar  = require('../data/notlar');
const {notDogrula, notKismiDogrula} = require('../middleware/dogrula');
const ApiHatasi = require("../utils/ApiHatasi")



router.get('/', (req, res) => {
    const {
        sayfa = 1,
        limit = 5,
        etiket,
        ara,
        siralama = 'tarih'
    } = req.query;

    const sayfaNo = Math.max(1, Number(sayfa))
    const limitNo = Math.min(20, Math.max(1, Number(limit)))


    // 1. Filtrele

    let sonuc = etiket
    ? notlar.filter(not => not.etiket === etiket)
    : [...notlar];


    if(ara){
        const kucuk = ara.toLowerCase();
        sonuc = sonuc.filter(not => 
            not.baslik.toLowerCase().includes(kucuk) || 
            not.icerik.toLowerCase().includes(kucuk)
        );
    }

    // 2. Sırala

    if(siralama ==='baslik') {
      sonuc.sort((a,b) => a.baslik.localeCompare(b.baslik, 'tr'))
    
    } else {
       sonuc.sort((a,b) => new Date(b.tarih) - new Date(a.tarih)) 
    }

    // 3.Toplam

    const toplam = sonuc.length
    const toplamSayfa = Math.max(1, Math.ceil(toplam/ limitNo));


    // 4. Dilimle

    const baslangıc = (sayfaNo - 1) * limitNo;
    const data = sonuc.slice(baslangıc, baslangıc + limitNo);
  
    res.json({
        basarili : true,
        sayfa: sayfaNo,
        limit: limitNo,
        toplam,
        toplamSayfa,
        oncekiSayfa: sayfaNo >1 ? sayfaNo -1 : null,
        sonrakiSayfa: sayfaNo < toplamSayfa ? sayfaNo +1 : null,
        data
    })

});


    // ÖZEL ROUTE: etiket için

router.get('/etiket/:etiket',(req,res) => {
    const {etiket} = req.params;

    const sonuc = notlar.filter(
        n => n.etiket.toLowerCase() === etiket.toLowerCase()
    );

    res.json ({
        basarili: true,
        etiket,
        adet: sonuc.length,
        data:sonuc
    })


})   


// Get notlar için
router.get("/:id", (req,res,next)=> {
    try{
        const id = Number(req.params.id);
        if(isNaN(id)) {
            throw new ApiHatasi("Id sayı olmalıdır",400)

        }

        const not = notlar.find(n => n.id === id);
        if(!not)  {
            throw new ApiHatasi(`${id}'li not bulunamadı.`,404);
        }
        res.json({basarili: true,
            data: not
        })

    }catch(err){
        next(err); //Hata middleware'ine gönder.

    }
});

router.post("/",notDogrula, (req,res)=> {
    const {baslik, icerik, etiket="genel"} = req.body;
    const simdikiZaman = new Date().toISOString();

    const yeniNot = {
        id: notlar.length +1,
        baslik: baslik.trim(),
        icerik: icerik.trim(),
        etiket,
        tarih: simdikiZaman,
        guncellendi: simdikiZaman
    };

    notlar.push(yeniNot);

    res.status(201).json({
        basarili: true,
        mesaj: "Not oluşturuldu",
        data: yeniNot
    })


});

router.put("/:id",notDogrula, (req,res) => {
    const id = Number(req.params.id);
    const index = notlar.findIndex(n => n.id === id);

    if(index === -1) {
        return res.status(404).json({hata:"Not bulunamadı"});

    }

    notlar[index] = {
        ...notlar[index],
        ...req.body,
        id: notlar[index].id,
        tarih: notlar[index].tarih,
        guncellendi: new Date().toISOString()


    };
    
    res.json( {basarili: true,
        data: notlar[index]
    })
});


router.patch("/:id", notKismiDogrula, (req,res)=> {
    const id = Number(req.params.id);
    const not = notlar.find(n => n.id === id);

    if(!not) {
        return res.status(404).json({hata: "Not bulunamadı"});
    }

    const {baslik, icerik, etiket} = req.body;

    if(baslik!== undefined) not.baslik = baslik.trim();
    if(icerik!== undefined) not.icerik = icerik.trim();
    if(etiket!== undefined) not.etiket = etiket;

    not.guncellendi = new Date().toISOString();

    res.json({basarili: true,
        data: not
    });

    
});



router.delete("/:id", (req,res)=> {
    const id = Number(req.params.id);
    const index = notlar.findIndex(n => n.id === id);

    if(index === -1) {
        return res.status(404).json({ hata: "Not bulunamadı!"});
    }

    const silinen = notlar.splice(index, 1)[0];

    res.json({
        basarili: true,
        mesaj: "Not silindi!",
        silinen
    });

});

module.exports = router;
