def get_storyboard_prompt(topic: str, style: str, script_content: str, image_reference: str | None = None) -> str:
    style_str = style if style else "menarik dan informatif"
    image_ref_instruction = f"\nReferensi Gambar/Gaya Visual: {image_reference}" if image_reference else ""
    image_ref_rule = f"\n4. **REFERENSI GAMBAR (IMAGE REFERENCE):** Semua `image_prompt` dan `video_prompt` HARUS menggunakan/merujuk ke gaya visual, deskripsi, atau referensi gambar berikut: '{image_reference}' agar konsisten secara visual." if image_reference else ""
    
    return f"""Kamu adalah sutradara visual dan prompt engineer profesional.
Tugas Anda adalah membagi naskah (script) video pendek berikut menjadi beberapa adegan storyboard visual yang terperinci.

Topik: {topic}
Gaya Visual: {style_str}{image_ref_instruction}

Naskah Video:
\"\"\"
{script_content}
\"\"\"

ATURAN UTAMA (WAJIB DIPATUHI):
1. **TOPIK ADALAH SUMBER KEBENARAN UTAMA.** Seluruh visual dan deskripsi storyboard HARUS berkaitan langsung dengan topik "{topic}". Jangan pernah mengganti atau menyimpang dari topik ini.
2. **JANGAN memperkenalkan tokoh terkenal, tim olahraga, acara/event, atau contoh visual yang TIDAK disebutkan secara eksplisit dalam topik atau naskah.** Visual harus menggambarkan isi naskah secara akurat.
3. Image prompt dan video prompt harus mencerminkan topik asli, bukan topik lain yang tidak relevan.

ATURAN STORYBOARD:
1. **WAJIB: Bagi naskah menjadi adegan-adegan pendek dengan durasi MAKSIMUM 5 detik per adegan (contoh: "0-3s", "3-5s"). Durasi tiap adegan TIDAK BOLEH melebihi 5 detik.**
2. Total durasi seluruh adegan harus sesuai dengan total durasi naskah (biasanya 45-60 detik).
3. Untuk setiap adegan, tentukan:
   - `scene_number`: Nomor adegan secara berurutan (mulai dari 1).
   - `duration`: Rentang waktu adegan (contoh: "0-3s", "3-5s").
   - `voice_over`: Potongan teks dari naskah yang dibacakan pada adegan tersebut. Seluruh teks naskah harus terbagi habis ke adegan-adegan.
   - `visual`: Deskripsi detail apa yang terlihat di layar. JANGAN menyarankan cuplikan footage berlisensi/hak cipta. Sarankan visual orisinal, visual buatan AI, animasi sederhana, teks grafis, atau video bebas royalti.
   - `image_prompt`: Prompt teks ke gambar (Text-to-Image) dalam bahasa Inggris yang spesifik dan detail untuk menghasilkan visual adegan tersebut (misalnya untuk Midjourney, DALL-E, atau Stable Diffusion).
   - `video_prompt`: Prompt teks ke video (Text-to-Video) dalam bahasa Inggris untuk generator video AI (seperti Runway Gen-2, Sora, Pika).
4. Prompt gambar dan video harus ditulis dalam bahasa Inggris demi kompatibilitas generator AI saat ini.{image_ref_rule}

Kembalikan respon hanya dalam format JSON array yang valid seperti di bawah ini, tanpa teks pengantar atau penutup apapun:
[
  {{
    "scene_number": 1,
    "duration": "0-3s",
    "voice_over": "Kalimat naskah untuk adegan ini",
    "visual": "Deskripsi visual orisinal/bebas hak cipta",
    "image_prompt": "Highly detailed 3D render, cinematic lighting, photorealistic style...",
    "video_prompt": "Cinematic camera panning, hyperrealistic detail, 4k..."
  }}
]
"""
