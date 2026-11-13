const notDogrula = (req, res, next) => {
    const {baslik, icerik} = req.body;

    const hatalar = [];

    if(!baslik) {
        hatalar.push("Başlık zorunludur");
    } else if(baslik.length < 3) {
        hatalar.push("Başlık en az 3 karakter olmalıdır.");
    } else if(baslik.length > 100) {
        hatalar.push("Başlık en fazla 100 karakter olmalıdır.");
    }

    if(!icerik) {
        hatalar.push("İçerik alanı boş olamaz.");
    } else if(icerik.length < 10) {
        hatalar.push("İçerik en az 10 karakter olmalıdır.");
    }

    if(hatalar.length > 0) {
        return res.status(400).json({ 
            basarili: false,
            hatalar
    });
    }

    next();
};

// PATCH için: en az bir alan zorunludur.
const notKismiDogrula = (req, res, next) => {
    const {baslik, icerik} = req.body ?? {};
    const hatalar = [];

    if(baslik === undefined && icerik === undefined && req.body?.etiket === undefined) {
        hatalar.push("Güncellenecek en az bir alan gönderin!")
    }
    if(baslik !== undefined && (baslik.length < 3 || baslik.length > 100 )) {
         hatalar.push("Başlık 3 ile 100 karakter arasında olmalıdır!")   
    }
    if(icerik !== undefined && icerik.length <10) {
        hatalar.push("İçerik en az 10 karakter olmalaıdır!")
    }


    if(hatalar.length >0)  {
        return res.status(400).json({basarili: false, hatalar});
    }

    next();
};



module.exports = {notDogrula, notKismiDogrula};
