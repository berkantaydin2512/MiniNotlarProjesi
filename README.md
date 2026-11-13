# MiniNotlarProjesi — Kurulum ve Kullanım Notları

## 1. Proje Hakkında

MiniNotlarProjesi, not kayıtları üzerinde CRUD (Create, Read, Update, Delete) işlemleri gerçekleştirmek için hazırlanmış bir Node.js projesidir. Postman üzerinden listeleme, filtreleme, arama, sıralama, tek kayıt görüntüleme, oluşturma, güncelleme ve silme senaryoları test edilebilir.

## 2. Gereksinimler ve İndirme Bağlantıları

Projeyi çalıştırmadan önce aşağıdaki araçları bilgisayarınıza kurun:

- **Node.js (LTS):** https://nodejs.org/
  - Node.js kurulumu npm paket yöneticisini de beraberinde getirir.
- **Visual Studio Code (isteğe bağlı):** https://code.visualstudio.com/
- **Postman (API testleri için):** https://www.postman.com/downloads/

Node.js indirme sayfasında işletim sisteminize uygun **LTS** sürümünü seçin. Kurulum sihirbazında varsayılan seçenekleri kullanabilirsiniz. Kurulum tamamlandıktan sonra terminali yeniden açın.

## 3. Terminalden Kurulum ve Çalıştırma

Aşağıdaki komutları proje klasöründe, yani `package.json` dosyasının bulunduğu dizinde sırayla çalıştırın.

### 3.1. Node.js ve npm kurulumunu doğrulama

```bash
node -v
npm -v
```

Komutlar sürüm numarası döndürüyorsa Node.js ve npm kullanıma hazırdır. Komut bulunamadı hatası alırsanız Node.js'i yukarıdaki resmî bağlantıdan yeniden kurup terminali kapatıp açın.

### 3.2. Proje klasörüne geçme

Örnek klasör yolu aşağıdaki gibidir; kendi bilgisayarınızdaki proje konumuna göre değiştirin:

```bash
cd "C:/.../NotlarMiniProje"
```

### 3.3. Proje bağımlılıklarını indirme

`package.json` dosyasında tanımlanmış paketleri indirmek için:

```bash
npm install
```

Bu komut gerekli paketleri `node_modules` klasörüne kurar. Projede `package-lock.json` bulunduğundan npm, kilit dosyasındaki sürümleri esas alır.

### 3.4. Sunucuyu başlatma

Node.js'in güncel sürümlerinde yerleşik izleme özelliğiyle uygulamayı başlatmak için:

```bash
node --watch app.js
```

Sunucu başarıyla başladığında terminalde uygulamanın çalıştığına ilişkin mesaj görüntülenir. Terminal penceresini açık tutun. `--watch` seçeneği, izlenen proje dosyalarında değişiklik olduğunda uygulamayı otomatik yeniden başlatır.

> `node --watch` seçeneği desteklenmiyorsa Node.js sürümünüzü güncel LTS sürümüne yükseltin. Uygulamanın kullandığı port ve başlangıç mesajı `app.js` dosyasındaki yapılandırmaya bağlıdır.

## 4. Postman ile Test

Örnek temel adres:

```text
http://localhost:PORT/notlar
```

`PORT` yerine `app.js` dosyasında tanımlanan portu yazın. `/notlar` yolu farklıysa `app.js` içindeki route tanımına göre güncelleyin.

| İşlem                 | HTTP   | Örnek yol                | Açıklama                                      |
| --------------------- | ------ | ------------------------ | --------------------------------------------- |
| Tüm notları listele   | GET    | `/notlar`                | Bütün notları getirir.                        |
| Sayfalama ve limit    | GET    | `/notlar?page=1&limit=5` | Sonuçları sayfalara böler.                    |
| Etikete göre filtrele | GET    | `/notlar?etiket=...`     | Belirli etikete sahip notları getirir.        |
| Metin arama           | GET    | `/notlar?search=...`     | Not içeriğinde arama yapar.                   |
| Başlığa göre sıralama | GET    | `/notlar?sort=baslik`    | Başlığa göre sıralama senaryosudur.           |
| Etiket yolu           | GET    | `/notlar/etiket/:etiket` | Etikete ait notları getirir.                  |
| Tek not               | GET    | `/notlar/:id`            | ID ile tek notu getirir.                      |
| Not oluştur           | POST   | `/notlar`                | Yeni not ekler.                               |
| Notu güncelle         | PUT    | `/notlar/:id`            | Notun tamamını günceller.                     |
| Notu kısmen güncelle  | PATCH  | `/notlar/:id`            | Yalnızca gönderilen alanı/alanları günceller. |
| Notu sil              | DELETE | `/notlar/:id`            | ID ile notu siler.                            |

### Örnek POST / PUT gövdesi

Alan adlarını `data/notlar.js` ve `routes/notlar.js` dosyalarındaki gerçek veri modeline göre uyarlayın:

```json
{
  "baslik": "Örnek not",
  "icerik": "Bu bir deneme notudur.",
  "etiket": "Genel"
}
```

Postman'de **Body → raw → JSON** seçin ve `Content-Type: application/json` başlığını gönderin.

## 5. Beklenen Hata Senaryoları

Postman test listesinde aşağıdaki doğrulama senaryoları yer almaktadır:

- Geçersiz ID biçimi: `400 Bad Request`
- Kayıt bulunamaması: `404 Not Found`
- Geçersiz not verisi: `400 Bad Request`
- Boş PATCH gövdesi: `400 Bad Request`

Başarılı isteklerin yanıt kodları ve JSON yanıt biçimi uygulamadaki route ve middleware tanımlarına bağlıdır.

## 6. Klasör Yapısı

```text
proje/
├── data/
│   └── notlar.js          # Not verileri
├── middleware/
│   ├── dogrula.js         # İstek/veri doğrulama
│   └── logger.js          # İstek kayıt/loglama
├── node_modules/          # npm install ile oluşur
├── routes/
│   └── notlar.js          # Not API uç noktaları
├── utils/
│   └── ApiHatasi.js       # API hata yardımcı yapısı
├── app.js                 # Uygulama giriş noktası
├── package.json           # Proje ve bağımlılık bilgileri
└── package-lock.json      # Bağımlılık sürüm kilidi
```

## 7. Sorun Giderme

- **`node` veya `npm` tanınmıyor:** Node.js kurulumunu ve PATH ayarını kontrol edin; terminali yeniden açın.
- **`node --watch` desteklenmiyor:** Node.js'in güncel LTS sürümünü kurun.
- **`Cannot find module`:** Proje kök dizininde `npm install` çalıştırın.
- **404 yanıtı:** Postman URL yolunu ve `app.js` içindeki route önekini kontrol edin.
- **Port kullanımda:** Uygulamanın port ayarını değiştirin veya portu kullanan diğer uygulamayı kapatın.

## 8. Geliştirici Notu

Bu doküman, sağlanan proje klasör yapısı ve Postman test senaryolarına göre hazırlanmıştır. Kesin port, route öneki ve veri alanları için `app.js`, `routes/notlar.js`, `data/notlar.js` ve `package.json` dosyaları esas alınmalıdır.
