## 🚀 Chatbot PT Minergo Visi Maxima

🚀 Fitur

- Klasifikasi teks dengan **Naive Bayes Classifier**
- Data training dan respons chatbot disimpan dalam file JSON
- API sederhana berbasis **Express.js**

## 📌 Fitur Utama

✅ Multi-turn Conversation - Bisa menangani percakapan berlanjut berdasarkan konteks.
✅ Auto-Learning - Chatbot otomatis belajar dari pertanyaan baru yang ditambahkan tanpa restart server.
✅ Database MySQL - Semua data disimpan di database, termasuk training data dan pertanyaan tidak dikenali.
✅ Penyimpanan Pertanyaan Tidak Dikenali - Admin dapat melihat pertanyaan yang tidak dikenali untuk memperbaiki chatbot.
✅ Dukungan Multi-Bahasa (ID & EN) - Dapat mendeteksi bahasa pengguna dan merespons dengan bahasa yang sesuai.

## 📌 Instalasi

Pastikan Anda telah menginstal **Node.js** di sistem Anda.

```sh
# Clone repository
git clone https://github.com/ferryops/natural-chatbot-api.git
cd natural-chatbot-api

# Install dependencies
pnpm install
```

## 🔧 Konfigurasi

1. **Buat file .env** di root proyek dan isi dengan konfigurasi database:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=chatbot_db

2. **Setup Database MySQL** – Buka MySQL dan jalankan perintah berikut:
   CREATE DATABASE chatbot_db;
   USE chatbot_db;

   -- Tabel untuk menyimpan data training
   CREATE TABLE training_data (
   id INT AUTO_INCREMENT PRIMARY KEY,
   text VARCHAR(255) NOT NULL,
   category VARCHAR(100) NOT NULL
   );

   -- Tabel untuk menyimpan pertanyaan yang tidak dikenali
   CREATE TABLE unknown_queries (
   id INT AUTO_INCREMENT PRIMARY KEY,
   message TEXT NOT NULL,
   timestamp DATETIME DEFAULT CURRENT_TIMESTAMP

);

## 🚀 Menjalankan API

```sh
# Run in production mode
pnpm start

# Run in development mode
pnpm dev
```

API akan berjalan di `http://localhost:3000`

## 📡 Endpoint API

1. **Chatbot Query** - Endpoint: POST /chat\*\*

**Request**

```json
{
  {
    "message": "Apa visi dan misi perusahaan?"
  }
}
```

**Responses**

```json
{
  "response": {
    "reply": "Visi kami adalah menjadi pemimpin dalam inovasi teknologi pertambangan berkelanjutan...",
    "prompts": [
      "Bagaimana cara kerja solusi AI?",
      "Apa manfaat teknologi pertambangan?"
    ]
  }
}
```

2. **Menambahkan Data Training** -POST /admin/add-training-data
   **Request**

**Request**

```json
{
  {
    "text": "Bagaimana cara kerja MhaulProx?",
    "category": "cara_kerja_mhaulprox"
  }
}
```

**Responses**

```json
{
  {
    "message": "Pertanyaan berhasil ditambahkan dan chatbot telah dilatih ulang!"
  }
}
```

3. **Melihat Pertanyaan Tidak Dikenali** - Endpoint: GET /admin/unknown-queries

   **Responses**

```json
{
  {
    "message": "Log pertanyaan tidak dikenali telah dihapus."
  }
}
```

## 🛠 Teknologi yang Digunakan

Node.js (Backend)

Express.js (API)

Natural.js (NLP)

MySQL (Database)

dotenv (Environment Variables)

## 📌 To-Do List (Pengembangan Selanjutnya)

✅ Integrasi dengan Telegram Bot
✅ Dashboard Admin untuk Mengelola Data Training
✅ Fitur Logging & Analytics
✅ Integrasi dengan WhatsApp API (Jika Dibutuhkan)
