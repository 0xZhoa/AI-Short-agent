def get_script_prompt(topic: str, language: str, platform: str, duration: str, style: str, angle_title: str, angle_hook: str, angle_description: str, word_count: int | None = None) -> str:
    style_str = style if style else "menarik, cepat, dan informatif"
    word_count_instruction = f"\n- Target Jumlah Kata: sekitar {word_count} kata" if word_count else ""
    word_count_rule = f"\n8. **WAJIB MENGIKUTI TARGET JUMLAH KATA.** Naskah harus memiliki panjang sekitar {word_count} kata (toleransi +/- 10% kata)." if word_count else ""
    
    return f"""Kamu adalah pembuat naskah video pendek profesional untuk {platform}.
Tugas Anda adalah menulis naskah (script) lengkap berdurasi {duration} berdasarkan sudut pandang (angle) terpilih berikut:

Topik: {topic}
Bahasa: {language}
Platform: {platform}
Durasi: {duration}
Gaya Konten: {style_str}{word_count_instruction}

Detail Angle Terpilih:
- Judul Angle: {angle_title}
- Hook 2 Detik Pertama: {angle_hook}
- Deskripsi Konsep: {angle_description}

ATURAN UTAMA (WAJIB DIPATUHI):
1. **TOPIK ADALAH SUMBER KEBENARAN UTAMA.** Seluruh isi naskah HARUS berkaitan langsung dengan topik "{topic}". Jangan pernah mengganti atau menyimpang dari topik ini.
2. **JANGAN memperkenalkan tokoh terkenal, tim olahraga, acara/event, atau contoh/analogi yang TIDAK disebutkan secara eksplisit dalam topik.** Tetap fokus sepenuhnya pada topik yang diberikan.
3. **SETIAP PARAGRAF harus tetap terhubung langsung dengan topik asli "{topic}".** Jangan menyisipkan cerita sampingan, analogi yang tidak relevan, atau fakta yang tidak ada hubungannya dengan topik.

ATURAN NASKAH:
1. Harus menggunakan bahasa {language} yang natural, ramah, dan asyik didengar (tidak formal/kaku).
2. Harus menyertakan hook yang sangat kuat di 2 detik pertama sesuai detail angle di atas.
3. Alur naskah harus cepat (fast-paced), padat, dan minim jeda kosong (no dead air).
4. JANGAN membuat fakta palsu (avoid fake facts). Pastikan data/informasi akurat.
5. JANGAN menuliskan instruksi yang melanggar hak cipta (jangan sarankan cuplikan footage berlisensi, sarankan gambar/video AI, visual buatan sendiri, atau stok video bebas royalti).
6. Berikan Call to Action (CTA) ringan di bagian akhir video (misal: ajak penonton untuk komen, like, share, atau subscribe).
7. Tulis naskah dalam format monolog narasi utuh yang siap dibaca oleh Voice Over (VO). Jangan masukkan petunjuk adegan/visual di dalam teks naskah ini (visual akan dibuat di storyboard terpisah).{word_count_rule}

Kembalikan respon hanya dalam format JSON object berikut, tanpa teks pengantar atau penutup apapun:
{{
  "content": "Isi lengkap naskah narasi video pendek di sini"
}}
"""
