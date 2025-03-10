# Natural Chatbot API

Chatbot sederhana berbasis **Node.js** dan **Natural.js** yang mampu memahami teks dan merespons sesuai kategori yang telah dilatih menggunakan dataset JSON.

## 🚀 Fitur

- Klasifikasi teks dengan **Naive Bayes Classifier**
- Data training dan respons chatbot disimpan dalam file JSON
- API sederhana berbasis **Express.js**

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

Tambahkan file berikut:

1. **trainingData.json** – Data training untuk klasifikasi teks.

```json
[
  { "text": "halo", "category": "sapaan" },
  { "text": "siapa kamu?", "category": "identitas" }
]
```

2. **responses.json** – Balasan chatbot berdasarkan kategori.

```json
{
  "sapaan": { "reply": "Halo! Apa kabar?" },
  "identitas": { "reply": "Saya adalah chatbot berbasis Natural.js!" },
  "default": { "reply": "Maaf, saya tidak mengerti." }
}
```

## 🚀 Menjalankan API

```sh
npm start
```

API akan berjalan di `http://localhost:3000`

## 📡 Endpoint API

### 1. Kirim Pesan ke Chatbot

**Endpoint:** `POST /chat`

**Request:**

```json
{
  "message": "halo"
}
```

**Response:**

```json
{
  "reply": "Halo! Apa kabar?"
}
```

## 🤝 Kontribusi

Pull request sangat diterima! Silakan fork dan kembangkan fitur baru.

## 📜 Lisensi

Proyek ini menggunakan lisensi **MIT**.
