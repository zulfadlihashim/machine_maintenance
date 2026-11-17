// Senarai 5 Watak Mengikut Urutan Aliran Kerja
const URUTAN_WATAK = [
    { id: "operator", tajuk: "1. Operator" },
    { id: "juruteknik", tajuk: "2. Juruteknik Penyelenggaraan" },
    { id: "jurutera", tajuk: "3. Jurutera" },
    { id: "pengurusan", tajuk: "4. Pengurusan" },
    { id: "qc", tajuk: "5. Pegawai QC" }
];

// Bank Soalan Asal (5 Watak x 5 Soalan = 25 Soalan)
const BANK_SOALAN_ASAL = {
    operator: {
        notaSerahan: "SITUASI AWAL: Mesin CNC Milling mengeluarkan bunyi geseran luar biasa dan bacaan suhu spindle meningkat semasa syif pagi.",
        soalan: [
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 1 (Operator): Anda mengesan bunyi berdecit kuat dari bahagian motor utama semasa menghidupkan mesin. Apakah tindakan pertama mengikut SOP keselamatan?",
                pilihan: [
                    "A. Teruskan operasi sehingga waktu rehat untuk mengelakkan kelewatan pengeluaran",
                    "B. Tekan butang henti kecemasan / hentikan mesin dengan selamat dan laporkan kepada penyelia",
                    "C. Buka penutup motor semasa mesin masih berputar untuk melihat punca bunyi",
                    "D. Sembur air penyejuk terus ke arah motor yang panas"
                ],
                jawapanBetul: 1,
                kesanSalah: "Mengabaikan bunyi luar biasa atau membuka pelindung semasa mesin hidup berisiko menyebabkan kerosakan kekal pada bearing dan kemalangan."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 2 (Operator): Sebelum menjalankan pemeriksaan harian (Daily Preventive Maintenance), apakah langkah pengasingan tenaga yang wajib dipatuhi?",
                pilihan: [
                    "A. Memakai sarung tangan kain sahaja",
                    "B. Melaksanakan prosedur LOTO (Lockout / Tagout) pada suis utama",
                    "C. Menurunkan kelajuan spindle ke tahap paling rendah",
                    "D. Membiarkan suis utama hidup supaya lampu bengkel kekal terang"
                ],
                jawapanBetul: 1,
                kesanSalah: "Tanpa LOTO, mesin boleh dihidupkan secara tidak sengaja oleh rakan sekerja semasa pemeriksaan dijalankan."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 3 (Operator): Semasa menyemak aras minyak pelincir (lubrication sight glass), anda mendapati paras minyak berada di bawah garisan minimum. Apakah tindakan anda?",
                pilihan: [
                    "A. Campurkan minyak enjin terpakai untuk mencukupkan paras",
                    "B. Tambah minyak pelincir mengikut gred spesifikasi manual mesin dan rekod dalam senarai semak",
                    "C. Biarkan sahaja kerana minyak masih kelihatan di dasar tangki",
                    "D. Gunakan gris galas untuk menggantikan minyak pelincir"
                ],
                jawapanBetul: 1,
                kesanSalah: "Penggunaan minyak pelincir yang salah gred atau kekurangan pelincir meningkatkan geseran dan merosakkan komponen dalaman."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 4 (Operator): Anda mendapati penapis udara (air filter) pada unit FRL pneumatik dipenuhi habuk logam dan kelembapan. Apakah kesan jika tidak dibersihkan?",
                pilihan: [
                    "A. Tekanan angin menjadi tidak stabil dan merosakkan injap pneumatik",
                    "B. Kelajuan motor elektrik bertambah laju",
                    "C. Penggunaan tenaga elektrik berkurangan secara mendadak",
                    "D. Tiada sebarang kesan pada sistem mekanikal"
                ],
                jawapanBetul: 0,
                kesanSalah: "Kotoran dan air dalam sistem pneumatik menyebabkan injap tersumbat dan silinder berkarat."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 5 (Operator): Setelah melengkapkan senarai semak harian dan mengesahkan kerosakan mekanikal memerlukan pembaikan lanjut, kepada siapakah borang arahan kerja perlu diserahkan?",
                pilihan: [
                    "A. Terus kepada Pegawai QC untuk kelulusan produk",
                    "B. Juruteknik Penyelenggaraan untuk tindakan diagnosis dan pembaikan teknikal",
                    "C. Bahagian kewangan untuk pembelian mesin baharu",
                    "D. Simpan di dalam laci meja sehingga hujung bulan"
                ],
                jawapanBetul: 1,
                kesanSalah: "Kelewatan menyerahkan laporan kepada Juruteknik Penyelenggaraan melambatkan proses pembaikan awal."
            }
        ]
    },
    juruteknik: {
        notaSerahan: "SERAHAN TUGAS: Operator telah menyerahkan senarai semak harian dan laporan bunyi geseran pada bahagian pemacu mesin kepada Juruteknik Penyelenggaraan.",
        soalan: [
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 1 (Juruteknik): Berdasarkan laporan Operator, anda perlu memeriksa ketegangan tali sawat (V-belt) pada sistem pemacu. Alat manakah yang paling tepat digunakan?",
                pilihan: [
                    "A. Angkup vernier (Vernier caliper)",
                    "B. Tolok ketegangan tali sawat (Belt tension gauge)",
                    "C. Mikrometer luar",
                    "D. Tolok perasa (Feeler gauge)"
                ],
                jawapanBetul: 1,
                kesanSalah: "Mengukur ketegangan tali sawat tanpa alat yang tepat menyebabkan tali sawat terlalu tegang (merosakkan bearing) atau tergelincir."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 2 (Juruteknik): Pemeriksaan menggunakan jangka suhu inframerah mendapati suhu perumah bearing mencapai 92°C (melebihi had normal 65°C). Apakah punca paling berkemungkinan?",
                pilihan: [
                    "A. Kekurangan gris pelincir atau kehausan pada bebola bearing",
                    "B. Warna cat pada perumah bearing sudah pudar",
                    "C. Voltan lampu penunjuk terlalu rendah",
                    "D. Meja kerja mesin tidak disapu bersih"
                ],
                jawapanBetul: 0,
                kesanSalah: "Suhu tinggi pada bearing adalah petunjuk jelas kegagalan pelinciran atau kehausan mekanikal yang kritikal."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 3 (Juruteknik): Semasa menanggalkan bearing yang haus daripada aci (shaft), alat manakah yang wajib digunakan bagi mengelakkan aci bengkok atau calar?",
                pilihan: [
                    "A. Tukul besi dan pahat sejuk",
                    "B. Penarik bearing (Bearing puller) yang sesuai saiznya",
                    "C. Pemutar skru mata rata sebagai pengumpil",
                    "D. Playar gabung"
                ],
                jawapanBetul: 1,
                kesanSalah: "Mengetuk bearing secara terus menggunakan tukul merosakkan permukaan aci (shaft) dan meningkatkan kos baik pulih."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 4 (Juruteknik): Selepas menggantikan bearing dan tali sawat baharu, pemeriksaan penjajaran takal (pulley alignment) perlu dibuat menggunakan...",
                pilihan: [
                    "A. Pembaris lurus (Straight edge) atau alat penjajaran laser",
                    "B. Pita pengukur kain",
                    "C. Sesiku L kayu",
                    "D. Anggaran penglihatan mata kasar sahaja"
                ],
                jawapanBetul: 0,
                kesanSalah: "Takal yang tidak sejajar menyebabkan tali sawat cepat haus dan menghasilkan getaran tinggi."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 5 (Juruteknik): Anda mendapati kerosakan bearing ini kerap berulang setiap 2 bulan. Kepada siapakah laporan teknikal ini perlu diserahkan untuk analisis punca akar (RCA)?",
                pilihan: [
                    "A. Jurutera Penyelenggaraan untuk semakan spesifikasi dan jadual PM",
                    "B. Pengawal keselamatan kilang",
                    "C. Operator mesin syif malam sahaja",
                    "D. Pembekal alat tulis"
                ],
                jawapanBetul: 0,
                kesanSalah: "Kerosakan berulang memerlukan analisis kejuruteraan oleh Jurutera untuk mengubah suai pelan penyelenggaraan."
            }
        ]
    },
    jurutera: {
        notaSerahan: "SERAHAN BORANG: Juruteknik telah menyerahkan rekod diagnosis suhu bearing dan kekerapan kerosakan kepada Jurutera untuk analisis kejuruteraan.",
        soalan: [
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 1 (Jurutera): Data menunjukkan bearing rosak setiap 400 jam operasi sedangkan jangka hayat reka bentuk ialah 2,000 jam. Apakah kaedah analisis terbaik untuk mencari punca sebenar?",
                pilihan: [
                    "A. Analisis Punca Akar (Root Cause Analysis - RCA / Fishbone Diagram)",
                    "B. Menukar jenama cat mesin",
                    "C. Mengurangkan waktu bekerja operator",
                    "D. Membuang rekod penyelenggaraan lama"
                ],
                jawapanBetul: 0,
                kesanSalah: "Tanpa RCA, punca sebenar seperti ketidakseimbangan beban atau salah spesifikasi gris tidak dapat diselesaikan."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 2 (Jurutera): Hasil RCA mendapati selang masa pelinciran (greasing interval) terlalu lama untuk beban kerja semasa. Apakah tindakan kejuruteraan yang perlu diambil?",
                pilihan: [
                    "A. Mengemas kini jadual Preventive Maintenance (PM) daripada bulanan kepada mingguan",
                    "B. Mengarahkan operator supaya tidak menggunakan mesin langsung",
                    "C. Mengeluarkan bearing daripada sistem pemacu",
                    "D. Mengabaikan cadangan pengeluar (OEM)"
                ],
                jawapanBetul: 0,
                kesanSalah: "Pelarasan selang masa PM adalah teras kejuruteraan kebolehpercayaan (reliability engineering)."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 3 (Jurutera): Untuk memantau tahap getaran spindle secara berkala sebelum kerosakan berlaku, teknologi penyelenggaraan ramalan (Predictive Maintenance) manakah yang sesuai dicadangkan?",
                pilihan: [
                    "A. Analisis Getaran (Vibration Analysis) menggunakan accelerometer",
                    "B. Ujian tekanan hidrostatik",
                    "C. Pemeriksaan menggunakan kanta pembesar biasa",
                    "D. Ujian ketegangan tali"
                ],
                jawapanBetul: 0,
                kesanSalah: "Analisis getaran mampu mengesan ketidakseimbangan dan kehausan bearing pada peringkat awal."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 4 (Jurutera): Anda menyediakan senarai alat ganti kritikal (critical spare parts) dan anggaran kos naik taraf sistem pelinciran automatik. Ke manakah borang permohonan bajet ini perlu dihantar?",
                pilihan: [
                    "A. Pihak Pengurusan untuk kelulusan peruntukan kewangan dan jadual henti tugas",
                    "B. Terus kepada pembekal tanpa kelulusan",
                    "C. Kantin kolej",
                    "D. Pelajar tahun satu"
                ],
                jawapanBetul: 0,
                kesanSalah: "Perolehan alat ganti dan peruntukan bajet memerlukan kelulusan rasmi pihak Pengurusan."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 5 (Jurutera): Apakah dokumen penting yang wajib disertakan bersama borang permohonan kepada pihak Pengurusan?",
                pilihan: [
                    "A. Justifikasi kos berbanding kerugian masa henti (downtime cost) dan penilaian risiko",
                    "B. Gambar swafoto pasukan penyelenggaraan",
                    "C. Senarai kehadiran pelajar kelas lain",
                    "D. Resit pembelian makanan"
                ],
                jawapanBetul: 0,
                kesanSalah: "Pihak Pengurusan memerlukan justifikasi pulangan pelaburan (ROI) dan impak downtime untuk meluluskan bajet."
            }
        ]
    },
    pengurusan: {
        notaSerahan: "KELULUSAN PENGURUSAN: Jurutera telah menghantar cadangan pelan PM baharu dan anggaran kos alat ganti kepada pihak Pengurusan untuk kelulusan.",
        soalan: [
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 1 (Pengurusan): Kos alat ganti dan naik taraf pelinciran ialah RM 1,200, manakala kos kerugian jika mesin rosak teruk (breakdown) ialah RM 8,500 sehari. Apakah keputusan pengurusan yang paling tepat?",
                pilihan: [
                    "A. Meluluskan peruntukan RM 1,200 segera kerana kos pencegahan jauh lebih rendah daripada kos kerosakan",
                    "B. Menangguhkan kelulusan selama 6 bulan untuk menjimatkan wang",
                    "C. Menolak permohonan dan memaksa mesin beroperasi sehingga rosak",
                    "D. Memotong gaji operator untuk membayar alat ganti"
                ],
                jawapanBetul: 0,
                kesanSalah: "Menangguhkan penyelenggaraan pencegahan akan menyebabkan kerugian breakdown yang berganda."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 2 (Pengurusan): Bilakah masa paling sesuai untuk menjadualkan kerja-kerja penyelenggaraan berjadual (Scheduled PM) ini?",
                pilihan: [
                    "A. Semasa waktu luar puncak pengeluaran (off-peak / pertukaran syif) yang telah dirancang",
                    "B. Secara mengejut ketika pesanan pelanggan sedang mendesak",
                    "C. Tanpa memaklumkan kepada penyelia pengeluaran",
                    "D. Hanya apabila bekalan elektrik terputus"
                ],
                jawapanBetul: 0,
                kesanSalah: "Penjadualan PM yang terancang mengelakkan gangguan besar terhadap sasaran pengeluaran."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 3 (Pengurusan): Dalam pengurusan inventori alat ganti penyelenggaraan, apakah tujuan menetapkan paras stok minimum (Re-order Point)?",
                pilihan: [
                    "A. Memastikan alat ganti kritikal sentiasa tersedia apabila diperlukan tanpa menunggu tempoh penghantaran lama",
                    "B. Memenuhi ruang stor supaya kelihatan penuh",
                    "C. Membazirkan peruntukan tahunan",
                    "D. Mengelakkan juruteknik daripada memeriksa stor"
                ],
                jawapanBetul: 0,
                kesanSalah: "Ketiadaan stok alat ganti kritikal memanjangkan tempoh mesin berhenti (Mean Time To Repair - MTTR)."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 4 (Pengurusan): Sebelum menandatangani kelulusan kerja penyelenggaraan, aspek pematuhan manakah yang mesti disahkan oleh Pengurusan?",
                pilihan: [
                    "A. Pematuhan piawaian keselamatan pekerjaan (OSHA / JKKP) dan SOP kerja selamat",
                    "B. Warna pakaian seragam juruteknik",
                    "C. Jenis telefon pintar yang digunakan pekerja",
                    "D. Jenama air minuman di bengkel"
                ],
                jawapanBetul: 0,
                kesanSalah: "Pengurusan bertanggungjawab memastikan setiap aktiviti kerja mematuhi akta keselamatan dan kesihatan pekerjaan."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 5 (Pengurusan): Setelah borang diluluskan, ke manakah aliran borang arahan kerja ini dipulangkan untuk pelaksanaan pembaikan dan pengesahan kualiti?",
                pilihan: [
                    "A. Dipulangkan kepada Jurutera, Juruteknik & Operator untuk pembaikan, seterusnya disahkan oleh Pegawai QC",
                    "B. Dibuang ke dalam mesin pencincang kertas",
                    "C. Disimpan di rumah pengurus",
                    "D. Dihantar terus kepada pelanggan"
                ],
                jawapanBetul: 0,
                kesanSalah: "Borang yang diluluskan mesti dikembalikan kepada pasukan teknikal untuk pelaksanaan sebelum pemeriksaan akhir QC."
            }
        ]
    },
    qc: {
        notaSerahan: "PENGESAHAN AKHIR QC: Borang kelulusan Pengurusan telah dilaksanakan oleh Jurutera, Juruteknik & Operator. Kini Pegawai QC perlu membuat pemeriksaan kualiti akhir.",
        soalan: [
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 1 (Pegawai QC): Kerja pembaikan dan pelinciran telah selesai dijalankan oleh Juruteknik dan Operator. Apakah langkah pertama Pegawai QC sebelum mesin dibenarkan beroperasi semula?",
                pilihan: [
                    "A. Menyemak kelengkapan rekod borang kerja dan menjalankan ujian larian tanpa beban (dry run / trial run)",
                    "B. Terus menghasilkan 1,000 unit produk tanpa pemeriksaan",
                    "C. Menandatangani borang dari pejabat tanpa melihat mesin",
                    "D. Membuka semula semua komponen yang telah dipasang"
                ],
                jawapanBetul: 0,
                kesanSalah: "Ujian larian percubaan wajib dilakukan untuk memastikan tiada getaran, kebocoran, atau pemasangan longgar."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 2 (Pegawai QC): Semasa ujian pemotongan sampel pertama (First Article Inspection), ukuran diameter bahan kerja didapati lari 0.05 mm daripada had terima (tolerance). Apakah tindakan QC?",
                pilihan: [
                    "A. Tahan pelepasan mesin (Hold) dan minta Juruteknik membuat pelarasan / kalibrasi semula",
                    "B. Luluskan sahaja kerana perbezaan 0.05 mm tidak kelihatan dengan mata kasar",
                    "C. Ubah lukisan kejuruteraan mengikut ukuran yang salah",
                    "D. Sembunyikan sampel yang gagal tersebut"
                ],
                jawapanBetul: 0,
                kesanSalah: "Melepaskan mesin yang berada di luar had terima akan menghasilkan produk reject secara besar-besaran."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 3 (Pegawai QC): Apakah aspek kebersihan (5S / Housekeeping) yang perlu disahkan oleh Pegawai QC di sekitar mesin selepas kerja penyelenggaraan?",
                pilihan: [
                    "A. Tiada tumpahan minyak pelincir, tiada alatan tangan tertinggal di atas mesin, dan pelindung keselamatan terpasang rapi",
                    "B. Mesin mesti dicat semula dengan warna baharu setiap kali servis",
                    "C. Lantai bengkel mesti dibasahkan dengan air sabun",
                    "D. Semua pintu bengkel mesti dikunci dari luar"
                ],
                jawapanBetul: 0,
                kesanSalah: "Alatan yang tertinggal pada mesin atau tumpahan minyak adalah punca utama kemalangan bengkel."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 4 (Pegawai QC): Alat ukur yang digunakan oleh Pegawai QC untuk mengesahkan ketepatan hasil kerja mesin mestilah mempunyai...",
                pilihan: [
                    "A. Pelekat dan sijil kalibrasi yang masih sah tempohnya",
                    "B. Harga yang paling mahal di pasaran",
                    "C. Kotak simpanan berwarna merah",
                    "D. Nama pemilik ditulis dengan pen dakwat kekal"
                ],
                jawapanBetul: 0,
                kesanSalah: "Alat ukur yang tamat tempoh kalibrasi tidak boleh dipercayai ketepatannya."
            },
            {
                media: { jenis: "tiada", sumber: "" },
                teks: "Soalan 5 (Pegawai QC): Setelah semua ujian larian, ketepatan dimensi, dan keselamatan lulus sepenuhnya, apakah tindakan terakhir Pegawai QC pada borang arahan kerja?",
                pilihan: [
                    "A. Menandatangani pengesahan kualiti (Buy-off) dan membenarkan mesin kembali ke status operasi penuh",
                    "B. Memadam semua rekod penyelenggaraan daripada sistem",
                    "C. Mengarahkan mesin dihentikan semula selama seminggu",
                    "D. Memulangkan borang kosong kepada Operator"
                ],
                jawapanBetul: 0,
                kesanSalah: "Pengesahan rasmi Pegawai QC melengkapkan kitaran penyelenggaraan dan menjamin kualiti pengeluaran."
            }
        ]
    }
};

// Dapatkan Bank Soalan Terkini (dari simpanan guru atau data asal)
function ambilBankSoalan() {
    try {
        const simpanan = localStorage.getItem("dma2252_bank_soalan");
        if (!simpanan) return JSON.parse(JSON.stringify(BANK_SOALAN_ASAL));
        const parsed = JSON.parse(simpanan);
        // Pastikan semua 5 watak wujud
        URUTAN_WATAK.forEach(w => {
            if (!parsed[w.id] || !Array.isArray(parsed[w.id].soalan)) {
                parsed[w.id] = JSON.parse(JSON.stringify(BANK_SOALAN_ASAL[w.id]));
            }
        });
        return parsed;
    } catch (e) {
        return JSON.parse(JSON.stringify(BANK_SOALAN_ASAL));
    }
}

// Tukar mana-mana pautan (YouTube / Google Drive / MP4 / Gambar) kepada objek media sah
function prosesPautanMedia(url) {
    const pautan = (url || "").trim();
    if (pautan === "") return { jenis: "tiada", sumber: "" };

    const padananYt = pautan.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const padananDrive = pautan.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=view&)?id=))([a-zA-Z0-9_-]+)/);

    if (padananYt && padananYt[1]) {
        return { jenis: "youtube", sumber: `https://www.youtube.com/embed/${padananYt[1]}` };
    }
    if (padananDrive && padananDrive[1]) {
        return { jenis: "gambar", sumber: `https://drive.google.com/thumbnail?id=${padananDrive[1]}&sz=w1200` };
    }
    if (pautan.toLowerCase().endsWith(".mp4")) {
        return { jenis: "video_url", sumber: pautan };
    }
    return { jenis: "gambar", sumber: pautan };
}

// Jana kod HTML paparan gambar / video
function janaHtmlMedia(media) {
    if (!media || media.jenis === "tiada" || !media.sumber) return "";
    if (media.jenis === "gambar") {
        return `<img src="${media.sumber}" alt="Paparan Situasi Mesin" class="media-gambar">`;
    }
    if (media.jenis === "youtube") {
        return `
            <div class="bingkai-video">
                <iframe src="${media.sumber}" title="Video Simulasi" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
            </div>`;
    }
    if (media.jenis === "video_fail" || media.jenis === "video_url") {
        return `<video src="${media.sumber}" controls playsinline class="media-video"></video>`;
    }
    return "";
}