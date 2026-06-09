def get_metadata_prompt(topic: str, niche: str, language: str, script_content: str) -> str:
    niche_str = niche if niche else "umum"
    
    return f"""Kamu adalah pakar SEO YouTube dan TikTok profesional.
Tugas Anda adalah membuat metadata publikasi yang dioptimalkan untuk video pendek dari proyek berikut:

Topik: {topic}
Niche: {niche_str}
Bahasa: {language}

Naskah Video:
\"\"\"
{script_content}
\"\"\"

ATURAN UTAMA (WAJIB DIPATUHI):
1. **TOPIK ADALAH SUMBER KEBENARAN UTAMA.** Seluruh metadata (judul, deskripsi, tag, komentar) HARUS berkaitan langsung dengan topik "{topic}". Niche hanyalah konteks ringan atau gaya pendukung. Jika niche bertentangan dengan topik, PRIORITASKAN TOPIK dan abaikan niche yang bertentangan.
2. **JANGAN memperkenalkan tokoh terkenal, tim olahraga, acara/event, atau referensi yang TIDAK disebutkan secara eksplisit dalam topik atau naskah.** Tag dan judul harus mencerminkan topik asli.

ATURAN METADATA:
1. **Titles**: Hasilkan 5 pilihan judul video pendek yang menarik (click-worthy), memiliki rasa penasaran tinggi, menggunakan bahasa {language}, dan di bawah 70 karakter. Judul harus mencerminkan topik "{topic}", bukan topik lain.
2. **Description**: Buat 1 deskripsi video pendek yang ringkas, dioptimalkan untuk SEO, memuat kata kunci penting dari topik, serta sertakan 3-5 hashtag populer yang relevan dengan topik.
3. **Tags**: Hasilkan 6 sampai 10 tag/kata kunci relevan (dalam bahasa {language} atau istilah global) untuk membantu algoritma mengelompokkan video. Tag harus terkait langsung dengan topik.
4. **Pinned Comments**: Buat 3 ide komentar pertama (pinned comment) yang bisa disematkan di kolom komentar untuk memancing interaksi atau diskusi dari penonton (misalnya memberikan pertanyaan menarik atau CTA tambahan). Komentar harus relevan dengan topik.

Kembalikan respon hanya dalam format JSON object berikut, tanpa teks pengantar atau penutup apapun:
{{
  "titles": [
    "Pilihan judul 1",
    "Pilihan judul 2",
    "Pilihan judul 3",
    "Pilihan judul 4",
    "Pilihan judul 5"
  ],
  "description": "Deskripsi video lengkap di sini beserta hashtag",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "pinned_comments": [
    "Ide komentar tersemat 1",
    "Ide komentar tersemat 2",
    "Ide komentar tersemat 3"
  ]
}}
"""
