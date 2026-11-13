// utils/ApiHatasi.js - Özel hata sınıfı 

class ApiHatasi extends Error {
    constructor(mesaj, durum = 500) {
        super(mesaj);
        this.durum = durum;
    }
}

module.exports = ApiHatasi;