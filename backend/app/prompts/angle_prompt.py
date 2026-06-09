def get_angle_prompt(topic: str, niche: str = None, language: str = "Indonesian", platform: str = "YouTube Shorts", duration: str = "45-60 seconds", style: str = None) -> str:
    niche_str = niche if niche else "umum"
    style_str = style if style else "menarik, cepat, dan informatif"
    
    return f"""Kamu adalah pakar viral marketing dan pembuat konten kreatif profesional untuk platform {platform}.
Tugas Anda adalah menghasilkan 5 sudut pandang (content angles) yang unik dan berpotensi viral dari topik berikut:

Topik: {topic}
Niche: {niche_str}
Bahasa: {language}
Durasi: {duration}
Gaya Konten: {style_str}

ATURAN UTAMA (WAJIB DIPATUHI):
1. **TOPIK ADALAH SUMBER KEBENARAN UTAMA.** Jangan pernah mengganti, mengabaikan, atau menyimpang dari topik yang diberikan. Niche hanyalah konteks ringan atau gaya pendukung. Jika niche bertentangan dengan topik, PRIORITASKAN TOPIK dan abaikan niche yang bertentangan.
2. **JANGAN memperkenalkan tokoh terkenal, tim olahraga, acara/event, atau contoh yang TIDAK disebutkan secara eksplisit dalam topik.** Jika topik tentang postur tubuh, JANGAN menyebut Messi, Mbappe, Piala Dunia, atau hal-hal sepak bola. Tetap fokus pada topik.
3. Semua 5 angle harus SECARA LANGSUNG menyebutkan atau dengan jelas berhubungan dengan topik "{topic}". Setiap angle harus bisa dipahami sebagai variasi kreatif dari topik tersebut, bukan topik lain.
4. Konten harus disesuaikan untuk format durasi singkat seperti {platform}.
5. Gunakan bahasa {language} yang natural, santai (tidak terlalu kaku/formal).
6. Setiap angle harus memiliki hook (kalimat pembuka dalam 2 detik pertama yang sangat memikat) dan deskripsi singkat konsepnya.
7. Hindari menyarankan visual yang melanggar hak cipta (jangan sarankan cuplikan footage berlisensi, melainkan sarankan grafis sederhana, visual AI, atau rekaman orisinal/bebas royalti).

Kembalikan respon hanya dalam format JSON array yang valid seperti di bawah ini, tanpa teks pengantar atau penutup apapun:
[
  {{
    "title": "Judul angle yang menarik dan langsung terkait topik",
    "hook": "Kalimat pembuka (hook) 2 detik pertama",
    "description": "Penjelasan singkat konsep video dan alur ceritanya, harus tetap fokus pada topik"
  }}
]
"""
