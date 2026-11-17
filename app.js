// Data Tetapan Asal Sistem
const tetapanAsal = {
    tajukUtama: "MACHINE MAINTENANCE DMA2252 KOLEJ VOKASIONAL KERIAN",
    subtopik: "SUBTOPIK (PREVENTIVE MAINTENANCE)",
    passAdmin: "123",
    media: { jenis: "tiada", sumber: "" },
    teksMedia: "Selamat datang ke sesi simulasi amali. Sila rujuk paparan di atas dan log masuk menggunakan kata laluan watak yang diberikan oleh guru.",
    watak: [
        { id: "operator", jawatan: "1. Operator", nama: "Pelajar 1", pass: "op111" },
        { id: "juruteknik", jawatan: "2. Juruteknik Penyelenggaraan", nama: "Pelajar 2", pass: "tek222" },
        { id: "jurutera", jawatan: "3. Jurutera", nama: "Pelajar 3", pass: "jur333" },
        { id: "pengurusan", jawatan: "4. Pengurusan", nama: "Pelajar 4", pass: "pen444" },
        { id: "qc", jawatan: "5. Pegawai QC", nama: "Pelajar 5", pass: "qc555" }
    ]
};

let mediaSementara = { jenis: "tiada", sumber: "" };
let bankSoalanSementara = {};
let watakSedangDisunting = "operator";

function ambilTetapan() {
    try {
        const dataSimpanan = localStorage.getItem("dma2252_tetapan");
        if (!dataSimpanan) return JSON.parse(JSON.stringify(tetapanAsal));
        const parsed = JSON.parse(dataSimpanan);
        if (!parsed.passAdmin) parsed.passAdmin = "123";
        if (!parsed.media) parsed.media = { jenis: "tiada", sumber: "" };
        if (parsed.teksMedia === undefined) parsed.teksMedia = "";
        if (!Array.isArray(parsed.watak)) parsed.watak = JSON.parse(JSON.stringify(tetapanAsal.watak));
        return parsed;
    } catch (err) {
        return JSON.parse(JSON.stringify(tetapanAsal));
    }
}

function escapeHtml(teks) {
    if (!teks) return "";
    return teks
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

document.addEventListener("DOMContentLoaded", function () {
    const data = ambilTetapan();

    // 1. Halaman Log Masuk (index.html)
    const elTajuk = document.getElementById("paparan-tajuk");
    const elSubtopik = document.getElementById("paparan-subtopik");
    if (elTajuk && elSubtopik) {
        elTajuk.textContent = data.tajukUtama;
        elSubtopik.textContent = data.subtopik;

        const bahagianMedia = document.getElementById("bahagian-media-login");
        const kontenaMedia = document.getElementById("paparan-media-kontena");
        const teksMedia = document.getElementById("paparan-teks-media");

        const htmlMedia = janaHtmlMedia(data.media);
        const adaTeks = data.teksMedia && data.teksMedia.trim() !== "";

        if (htmlMedia !== "" || adaTeks) {
            bahagianMedia.style.display = "block";
            kontenaMedia.innerHTML = htmlMedia;
            teksMedia.textContent = data.teksMedia;
            teksMedia.style.display = adaTeks ? "block" : "none";
        } else {
            bahagianMedia.style.display = "none";
        }

        const inputPassPelajar = document.getElementById("kataLaluan");
        if (inputPassPelajar) {
            inputPassPelajar.addEventListener("keypress", function (e) {
                if (e.key === "Enter") semakLogMasukPelajar();
            });
        }

        const inputPassAdmin = document.getElementById("passAdminInput");
        if (inputPassAdmin) {
            inputPassAdmin.addEventListener("keypress", function (e) {
                if (e.key === "Enter") sahkanAdmin();
            });
        }

        const modalAdmin = document.getElementById("modal-admin");
        if (modalAdmin) {
            modalAdmin.addEventListener("click", function (e) {
                if (e.target === modalAdmin) tutupModalAdmin();
            });
        }
    }

    // 2. Halaman Admin (admin.html)
    if (document.getElementById("senarai-watak-admin")) {
        if (sessionStorage.getItem("statusAdmin") !== "sah") {
            window.location.href = "index.html";
            return;
        }
        bankSoalanSementara = ambilBankSoalan();
        muatBorangAdmin(data);
    }
});

// --- LOG MASUK PEMAIN & MOD PEMERHATI ---
function semakLogMasukPelajar() {
    const namaInput = document.getElementById("namaPelajar").value.trim();
    const passInput = document.getElementById("kataLaluan").value.trim();
    const mesejRalat = document.getElementById("mesej-ralat");
    const data = ambilTetapan();

    mesejRalat.style.display = "none";

    const watakDijumpai = data.watak.find(w => w.pass === passInput);
    if (watakDijumpai) {
        const namaDigunakan = namaInput !== "" ? namaInput : watakDijumpai.nama;
        sessionStorage.setItem("watakAktifId", watakDijumpai.id);
        sessionStorage.setItem("namaAktif", namaDigunakan);
        window.location.href = "simulasi.html";
    } else {
        mesejRalat.style.display = "block";
    }
}

function masukModPemerhati() {
    const namaInput = document.getElementById("namaPelajar").value.trim();
    sessionStorage.setItem("watakAktifId", "pemerhati");
    sessionStorage.setItem("namaAktif", namaInput !== "" ? namaInput : "Pemerhati Kelas");
    window.location.href = "simulasi.html";
}

// --- MODAL ADMIN ---
function bukaModalAdmin() {
    const modal = document.getElementById("modal-admin");
    const inputPass = document.getElementById("passAdminInput");
    const ralat = document.getElementById("ralat-admin");
    if (modal) {
        modal.style.display = "flex";
        if (inputPass) {
            inputPass.value = "";
            setTimeout(() => inputPass.focus(), 50);
        }
        if (ralat) ralat.style.display = "none";
    }
}

function tutupModalAdmin() {
    const modal = document.getElementById("modal-admin");
    if (modal) modal.style.display = "none";
}

function sahkanAdmin() {
    const inputPass = document.getElementById("passAdminInput");
    const ralat = document.getElementById("ralat-admin");
    const data = ambilTetapan();

    if ((inputPass ? inputPass.value.trim() : "") === data.passAdmin) {
        sessionStorage.setItem("statusAdmin", "sah");
        window.location.href = "admin.html";
    } else {
        if (ralat) ralat.style.display = "block";
    }
}

// --- MEDIA SKRIN UTAMA (admin.html) ---
function mampatkanGambar(fail, callback) {
    const pembaca = new FileReader();
    pembaca.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement("canvas");
            const lebarMaks = 640;
            let lebar = img.width;
            let tinggi = img.height;

            if (lebar > lebarMaks) {
                tinggi = Math.round((tinggi * lebarMaks) / lebar);
                lebar = lebarMaks;
            }
            canvas.width = lebar;
            canvas.height = tinggi;
            canvas.getContext("2d").drawImage(img, 0, 0, lebar, tinggi);
            callback(canvas.toDataURL("image/jpeg", 0.65));
        };
        img.src = e.target.result;
    };
    pembaca.readAsDataURL(fail);
}

function kendaliMuatNaikFail(event) {
    const fail = event.target.files[0];
    if (!fail) return;
    document.getElementById("inputUrlMedia").value = "";

    if (fail.type.startsWith("image/")) {
        mampatkanGambar(fail, function (dataUrl) {
            mediaSementara = { jenis: "gambar", sumber: dataUrl };
            kemasKiniPratontonAdmin();
        });
    } else if (fail.type.startsWith("video/")) {
        if (fail.size > 3 * 1024 * 1024) {
            alert("Saiz video melebihi 3MB. Sila gunakan pautan YouTube pada Pilihan B.");
            event.target.value = "";
            return;
        }
        const pembaca = new FileReader();
        pembaca.onload = function (e) {
            mediaSementara = { jenis: "video_fail", sumber: e.target.result };
            kemasKiniPratontonAdmin();
        };
        pembaca.readAsDataURL(fail);
    }
}

function kendaliInputUrl(url) {
    document.getElementById("uploadMediaFile").value = "";
    mediaSementara = prosesPautanMedia(url);
    kemasKiniPratontonAdmin();
}

function padamMediaSemasa() {
    mediaSementara = { jenis: "tiada", sumber: "" };
    document.getElementById("uploadMediaFile").value = "";
    document.getElementById("inputUrlMedia").value = "";
    kemasKiniPratontonAdmin();
}

function kemasKiniPratontonAdmin() {
    const kotakPratonton = document.getElementById("pratonton-media-admin");
    const html = janaHtmlMedia(mediaSementara);
    kotakPratonton.innerHTML = html === ""
        ? `<span class="teks-tiada-media">Tiada gambar atau video ditetapkan.</span>`
        : html;
}

// --- PENGURUSAN SOALAN & MEDIA SETIAP WATAK (admin.html) ---
function simpanDrafWatakSemasa() {
    if (!bankSoalanSementara[watakSedangDisunting]) return;
    const dataWatak = bankSoalanSementara[watakSedangDisunting];

    const elNota = document.getElementById("inputNotaSerahan");
    if (elNota) dataWatak.notaSerahan = elNota.value.trim();

    dataWatak.soalan.forEach((s, idx) => {
        const elTeks = document.getElementById(`soalan_teks_${idx}`);
        if (!elTeks) return;
        s.teks = elTeks.value.trim();
        s.pilihan = [
            document.getElementById(`pilihan_${idx}_0`).value.trim(),
            document.getElementById(`pilihan_${idx}_1`).value.trim(),
            document.getElementById(`pilihan_${idx}_2`).value.trim(),
            document.getElementById(`pilihan_${idx}_3`).value.trim()
        ];
        s.jawapanBetul = parseInt(document.getElementById(`jawapan_betul_${idx}`).value, 10);
        s.kesanSalah = document.getElementById(`kesan_salah_${idx}`).value.trim();
    });
}

function tukarWatakEditorSoalan() {
    simpanDrafWatakSemasa();
    watakSedangDisunting = document.getElementById("pilihWatakSoalan").value;
    paparEditorSoalanWatak(watakSedangDisunting);
}

function paparEditorSoalanWatak(idWatak) {
    const dataWatak = bankSoalanSementara[idWatak];
    document.getElementById("inputNotaSerahan").value = dataWatak.notaSerahan || "";

    const bekas = document.getElementById("bekas-editor-soalan");
    bekas.innerHTML = "";

    dataWatak.soalan.forEach((s, idx) => {
        const htmlPratonton = janaHtmlMedia(s.media);
        const urlNilai = (s.media && s.media.sumber && s.media.sumber.startsWith("http")) ? s.media.sumber : "";

        bekas.innerHTML += `
            <div class="kotak-editor-item">
                <div class="header-editor-item">
                    <strong>Soalan ${idx + 1}</strong>
                    <button type="button" class="btn-padam-kecil" onclick="padamMediaSoalan(${idx})">🗑️ Padam Media Soalan</button>
                </div>

                <div class="kumpulan-input">
                    <label>Muat Naik Gambar/Video Soalan ${idx + 1} ATAU Tampal Pautan YouTube / Google Drive:</label>
                    <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4" onchange="muatNaikMediaSoalan(event, ${idx})" style="margin-bottom: 8px;">
                    <input type="text" id="media_url_${idx}" value="${escapeHtml(urlNilai)}" placeholder="Tampal pautan YouTube / Google Drive / URL gambar..." oninput="ubahUrlMediaSoalan(${idx}, this.value)">
                </div>

                <div id="pratonton_soalan_${idx}" class="kotak-pratonton" style="margin-bottom: 12px;">
                    ${htmlPratonton !== "" ? htmlPratonton : '<span class="teks-tiada-media">Tiada media bagi soalan ini.</span>'}
                </div>

                <div class="kumpulan-input">
                    <label>Teks Soalan / Situasi (Dipaparkan di bawah gambar/video):</label>
                    <textarea id="soalan_teks_${idx}" rows="2">${escapeHtml(s.teks)}</textarea>
                </div>

                <div class="grid-input-pilihan">
                    <div class="kumpulan-input">
                        <label>Pilihan A:</label>
                        <input type="text" id="pilihan_${idx}_0" value="${escapeHtml(s.pilihan[0])}">
                    </div>
                    <div class="kumpulan-input">
                        <label>Pilihan B:</label>
                        <input type="text" id="pilihan_${idx}_1" value="${escapeHtml(s.pilihan[1])}">
                    </div>
                    <div class="kumpulan-input">
                        <label>Pilihan C:</label>
                        <input type="text" id="pilihan_${idx}_2" value="${escapeHtml(s.pilihan[2])}">
                    </div>
                    <div class="kumpulan-input">
                        <label>Pilihan D:</label>
                        <input type="text" id="pilihan_${idx}_3" value="${escapeHtml(s.pilihan[3])}">
                    </div>
                </div>

                <div class="grid-input-pilihan">
                    <div class="kumpulan-input">
                        <label>Jawapan Tepat:</label>
                        <select id="jawapan_betul_${idx}" class="dropdown-admin">
                            <option value="0" ${s.jawapanBetul === 0 ? "selected" : ""}>Pilihan A</option>
                            <option value="1" ${s.jawapanBetul === 1 ? "selected" : ""}>Pilihan B</option>
                            <option value="2" ${s.jawapanBetul === 2 ? "selected" : ""}>Pilihan C</option>
                            <option value="3" ${s.jawapanBetul === 3 ? "selected" : ""}>Pilihan D</option>
                        </select>
                    </div>
                    <div class="kumpulan-input">
                        <label>Nota Kesan Jika Salah (Dipaparkan dalam Log Kesilapan):</label>
                        <input type="text" id="kesan_salah_${idx}" value="${escapeHtml(s.kesanSalah || "")}">
                    </div>
                </div>
            </div>
        `;
    });
}

function muatNaikMediaSoalan(event, idx) {
    const fail = event.target.files[0];
    if (!fail) return;
    document.getElementById(`media_url_${idx}`).value = "";

    if (fail.type.startsWith("image/")) {
        mampatkanGambar(fail, function (dataUrl) {
            bankSoalanSementara[watakSedangDisunting].soalan[idx].media = { jenis: "gambar", sumber: dataUrl };
            document.getElementById(`pratonton_soalan_${idx}`).innerHTML = janaHtmlMedia({ jenis: "gambar", sumber: dataUrl });
        });
    } else if (fail.type.startsWith("video/")) {
        if (fail.size > 2.5 * 1024 * 1024) {
            alert("Saiz video terlalu besar. Sila gunakan pautan YouTube.");
            event.target.value = "";
            return;
        }
        const pembaca = new FileReader();
        pembaca.onload = function (e) {
            const mediaObj = { jenis: "video_fail", sumber: e.target.result };
            bankSoalanSementara[watakSedangDisunting].soalan[idx].media = mediaObj;
            document.getElementById(`pratonton_soalan_${idx}`).innerHTML = janaHtmlMedia(mediaObj);
        };
        pembaca.readAsDataURL(fail);
    }
}

function ubahUrlMediaSoalan(idx, url) {
    const mediaObj = prosesPautanMedia(url);
    bankSoalanSementara[watakSedangDisunting].soalan[idx].media = mediaObj;
    const html = janaHtmlMedia(mediaObj);
    document.getElementById(`pratonton_soalan_${idx}`).innerHTML = html !== ""
        ? html
        : '<span class="teks-tiada-media">Tiada media bagi soalan ini.</span>';
}

function padamMediaSoalan(idx) {
    bankSoalanSementara[watakSedangDisunting].soalan[idx].media = { jenis: "tiada", sumber: "" };
    document.getElementById(`media_url_${idx}`).value = "";
    document.getElementById(`pratonton_soalan_${idx}`).innerHTML = '<span class="teks-tiada-media">Tiada media bagi soalan ini.</span>';
}

// --- BORANG UTAMA ADMIN ---
function muatBorangAdmin(data) {
    document.getElementById("inputTajukUtama").value = data.tajukUtama;
    document.getElementById("inputSubtopik").value = data.subtopik;
    document.getElementById("inputTeksMedia").value = data.teksMedia || "";

    mediaSementara = JSON.parse(JSON.stringify(data.media || { jenis: "tiada", sumber: "" }));
    document.getElementById("inputUrlMedia").value =
        (mediaSementara.sumber && mediaSementara.sumber.startsWith("http")) ? mediaSementara.sumber : "";
    kemasKiniPratontonAdmin();

    const tbody = document.getElementById("senarai-watak-admin");
    tbody.innerHTML = "";
    data.watak.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td data-label="Watak Simulasi"><strong>${item.jawatan}</strong></td>
                <td data-label="Nama Pelajar"><input type="text" id="nama_${index}" value="${escapeHtml(item.nama)}" placeholder="Nama pelajar"></td>
                <td data-label="Kata Laluan"><input type="text" id="pass_${index}" value="${escapeHtml(item.pass)}" placeholder="Kata laluan"></td>
            </tr>
        `;
    });

    watakSedangDisunting = document.getElementById("pilihWatakSoalan").value;
    paparEditorSoalanWatak(watakSedangDisunting);
}

function simpanTetapanAdmin() {
    simpanDrafWatakSemasa();

    const data = ambilTetapan();
    data.tajukUtama = document.getElementById("inputTajukUtama").value.trim();
    data.subtopik = document.getElementById("inputSubtopik").value.trim();
    data.media = mediaSementara;
    data.teksMedia = document.getElementById("inputTeksMedia").value.trim();

    data.watak.forEach((item, index) => {
        item.nama = document.getElementById(`nama_${index}`).value.trim();
        item.pass = document.getElementById(`pass_${index}`).value.trim();
    });

    try {
        localStorage.setItem("dma2252_tetapan", JSON.stringify(data));
        localStorage.setItem("dma2252_bank_soalan", JSON.stringify(bankSoalanSementara));

        const notis = document.getElementById("notis-simpan");
        notis.style.display = "block";
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        setTimeout(() => { notis.style.display = "none"; }, 3500);
    } catch (ralat) {
        alert("Gagal menyimpan kerana saiz keseluruhan gambar yang dimuat naik melebihi had memori pelayar. Sila gunakan pautan Google Drive / YouTube untuk gambar atau video yang banyak.");
    }
}

function resetSesiSimulasiAdmin() {
    if (confirm("Reset kemajuan simulasi (Kesihatan Mesin kembali 100%, Kos RM 0, dan mula semula dari Operator)?")) {
        localStorage.removeItem("dma2252_sesi_simulasi");
        alert("Sesi simulasi telah ditetapkan semula untuk kumpulan baharu!");
    }
}

function setSemulaTetapan() {
    if (confirm("Kembalikan semua tajuk, kata laluan, dan 25 soalan kepada tetapan asal?")) {
        localStorage.removeItem("dma2252_tetapan");
        localStorage.removeItem("dma2252_bank_soalan");
        localStorage.removeItem("dma2252_sesi_simulasi");
        bankSoalanSementara = ambilBankSoalan();
        muatBorangAdmin(ambilTetapan());
        alert("Semua tetapan dan bank soalan asal telah dipulihkan.");
    }
}

function logKeluarAdmin() {
    sessionStorage.removeItem("statusAdmin");
    window.location.href = "index.html";
}