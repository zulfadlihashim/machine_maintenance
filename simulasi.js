function janaSesiBaharu() {
    return {
        indeksWatak: 0,
        indeksSoalan: 0,
        kesihatan: 100,
        kos: 0,
        bilanganSalah: 0,
        tamat: false,
        masaMula: Date.now(),
        masaTamat: null,
        statistikWatak: {
            operator: { nama: "", salah: 0, kos: 0 },
            juruteknik: { nama: "", salah: 0, kos: 0 },
            jurutera: { nama: "", salah: 0, kos: 0 },
            pengurusan: { nama: "", salah: 0, kos: 0 },
            qc: { nama: "", salah: 0, kos: 0 }
        },
        senaraiKesilapan: [],
        log: [
            {
                masa: dapatkanMasaSemasa(),
                jenis: "info",
                teks: "Sesi simulasi dimulakan. Menunggu tindakan daripada 1. Operator."
            }
        ]
    };
}

function ambilSesiSimulasi() {
    const asal = janaSesiBaharu();
    try {
        const simpanan = localStorage.getItem("dma2252_sesi_simulasi");
        if (!simpanan) return asal;

        const parsed = JSON.parse(simpanan);
        if (!parsed.masaMula) parsed.masaMula = Date.now();
        if (!parsed.statistikWatak) parsed.statistikWatak = asal.statistikWatak;
        if (!Array.isArray(parsed.senaraiKesilapan)) parsed.senaraiKesilapan = [];
        return parsed;
    } catch (e) {
        return asal;
    }
}

function simpanSesiSimulasi(sesi) {
    localStorage.setItem("dma2252_sesi_simulasi", JSON.stringify(sesi));
}

function dapatkanMasaSemasa() {
    return new Date().toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit" });
}

function formatTempohMasa(msMula, msTamat) {
    const jumlahSaat = Math.max(1, Math.floor(((msTamat || Date.now()) - msMula) / 1000));
    const minit = Math.floor(jumlahSaat / 60);
    const saat = jumlahSaat % 60;
    return `${minit} min ${saat} saat`;
}

function escapeTeks(teks) {
    if (!teks) return "";
    return String(teks)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

document.addEventListener("DOMContentLoaded", function () {
    const tetapanRaw = localStorage.getItem("dma2252_tetapan");
    if (tetapanRaw) {
        const tetapan = JSON.parse(tetapanRaw);
        const tajuk = tetapan.tajukUtama || "MACHINE MAINTENANCE DMA2252 KOLEJ VOKASIONAL KERIAN";
        const sub = tetapan.subtopik || "SUBTOPIK (PREVENTIVE MAINTENANCE)";
        document.getElementById("sim-tajuk-kursus").textContent = tajuk;
        document.getElementById("sim-subtopik").textContent = sub;
        document.getElementById("cetak-tajuk-kursus").textContent = tajuk;
        document.getElementById("cetak-subtopik").textContent = sub;
    }

    // Sokongan tekan Enter pada modal reset akhir
    const inputReset = document.getElementById("passResetAkhirInput");
    if (inputReset) {
        inputReset.addEventListener("keypress", function (e) {
            if (e.key === "Enter") sahkanResetAkhir();
        });
    }

    const modalReset = document.getElementById("modal-reset-akhir");
    if (modalReset) {
        modalReset.addEventListener("click", function (e) {
            if (e.target === modalReset) tutupModalResetAkhir();
        });
    }

    paparSkrinSimulasi();

    window.addEventListener("storage", function (e) {
        if (e.key === "dma2252_sesi_simulasi" || e.key === "dma2252_bank_soalan") {
            paparSkrinSimulasi();
        }
    });
});

function paparSkrinSimulasi() {
    const sesi = ambilSesiSimulasi();
    const bankSoalan = ambilBankSoalan();
    const watakPenggunaId = sessionStorage.getItem("watakAktifId") || "pemerhati";
    const namaPengguna = sessionStorage.getItem("namaAktif") || "Pemerhati Kelas";

    // Rekodkan nama pelajar aktif jika dia memegang salah satu watak
    if (sesi.statistikWatak[watakPenggunaId] && namaPengguna) {
        sesi.statistikWatak[watakPenggunaId].nama = namaPengguna;
        simpanSesiSimulasi(sesi);
    }

    const jumlahSemuaSoalan = URUTAN_WATAK.reduce((jumlah, w) => {
        return jumlah + (bankSoalan[w.id] ? bankSoalan[w.id].soalan.length : 0);
    }, 0);

    // 1. Papar Identiti Pengguna
    const badgeIdentiti = document.getElementById("badge-identiti");
    if (watakPenggunaId === "pemerhati") {
        badgeIdentiti.textContent = "👁️ Mod Pemerhati (Tonton Sahaja)";
        badgeIdentiti.className = "badge-watak badge-pemerhati";
    } else {
        const infoWatak = URUTAN_WATAK.find(w => w.id === watakPenggunaId);
        badgeIdentiti.textContent = `👤 ${infoWatak ? infoWatak.tajuk : watakPenggunaId} (${namaPengguna})`;
        badgeIdentiti.className = "badge-watak badge-pemain";
    }

    // 2. Papar Meter Kesihatan Mesin & Kos
    const elKesihatan = document.getElementById("teks-kesihatan");
    const barKesihatan = document.getElementById("bar-kesihatan");
    elKesihatan.textContent = `${sesi.kesihatan}%`;
    barKesihatan.style.width = `${sesi.kesihatan}%`;

    if (sesi.kesihatan > 60) {
        barKesihatan.style.backgroundColor = "#22c55e";
    } else if (sesi.kesihatan > 30) {
        barKesihatan.style.backgroundColor = "#f59e0b";
    } else {
        barKesihatan.style.backgroundColor = "#ef4444";
    }

    document.getElementById("teks-kos").textContent = `RM ${sesi.kos.toLocaleString()}`;

    // 3. Papar Bar Aliran 5 Watak
    const barAliran = document.getElementById("bar-aliran-watak");
    barAliran.innerHTML = URUTAN_WATAK.map((w, idx) => {
        let kelas = "langkah-watak";
        if (sesi.tamat || idx < sesi.indeksWatak) kelas += " selesai";
        else if (idx === sesi.indeksWatak) kelas += " aktif";
        return `<div class="${kelas}">${w.tajuk}</div>`;
    }).join("");

    // 4. Papar Log Aktiviti & Kesilapan
    const kontenaLog = document.getElementById("senarai-log-aktiviti");
    kontenaLog.innerHTML = sesi.log.slice().reverse().map(item => `
        <div class="item-log log-${item.jenis}">
            <span class="masa-log">[${item.masa}]</span>
            <span>${item.teks}</span>
        </div>
    `).join("");

    // 5. Semak Jika Simulasi Sudah Tamat -> Papar Dashboard Rumusan 4 Bahagian
    const kadSoalan = document.getElementById("kad-soalan-utama");
    const kadTamat = document.getElementById("kad-tamat-simulasi");

    if (sesi.tamat) {
        document.getElementById("teks-giliran-semasa").textContent = "Selesai (Disahkan QC)";
        document.getElementById("teks-kemajuan-soalan").textContent = `${jumlahSemuaSoalan} / ${jumlahSemuaSoalan} Soalan Lengkap`;
        document.getElementById("banner-serahan").style.display = "none";
        kadSoalan.style.display = "none";
        kadTamat.style.display = "block";

        paparDashboardRumusan(sesi);
        return;
    }

    kadSoalan.style.display = "block";
    kadTamat.style.display = "none";

    // 6. Papar Soalan Watak Semasa
    const watakSemasaObj = URUTAN_WATAK[sesi.indeksWatak];
    const dataWatak = bankSoalan[watakSemasaObj.id];
    const jumlahSoalanWatak = dataWatak.soalan.length;

    if (sesi.indeksSoalan >= jumlahSoalanWatak) {
        sesi.indeksSoalan = Math.max(0, jumlahSoalanWatak - 1);
        simpanSesiSimulasi(sesi);
    }

    const soalanSemasa = dataWatak.soalan[sesi.indeksSoalan];

    document.getElementById("teks-giliran-semasa").textContent = watakSemasaObj.tajuk;
    document.getElementById("teks-kemajuan-soalan").textContent = `Soalan ${sesi.indeksSoalan + 1} daripada ${jumlahSoalanWatak}`;
    document.getElementById("banner-serahan").style.display = "block";
    document.getElementById("banner-serahan").textContent = dataWatak.notaSerahan;
    document.getElementById("label-nombor-soalan").textContent = `${watakSemasaObj.tajuk} — Soalan ${sesi.indeksSoalan + 1} / ${jumlahSoalanWatak}`;

    const giliranSaya = (watakPenggunaId === watakSemasaObj.id);
    const badgeKunci = document.getElementById("status-kunci-jawapan");

    if (giliranSaya) {
        badgeKunci.textContent = "🟢 Giliran Anda Menjawab";
        badgeKunci.className = "badge-kunci aktif";
    } else if (watakPenggunaId === "pemerhati") {
        badgeKunci.textContent = `👁️ Mod Pemerhati — Menunggu ${watakSemasaObj.tajuk}`;
        badgeKunci.className = "badge-kunci";
    } else {
        badgeKunci.textContent = `⏳ Tunggu Giliran — Sedang dijawab oleh ${watakSemasaObj.tajuk}`;
        badgeKunci.className = "badge-kunci";
    }

    const kontenaMedia = document.getElementById("kontena-media-soalan");
    const htmlMedia = janaHtmlMedia(soalanSemasa.media);
    if (htmlMedia !== "") {
        kontenaMedia.style.display = "block";
        kontenaMedia.innerHTML = htmlMedia;
    } else {
        kontenaMedia.style.display = "none";
        kontenaMedia.innerHTML = "";
    }

    document.getElementById("teks-soalan-semasa").textContent = soalanSemasa.teks;

    const gridPilihan = document.getElementById("senarai-pilihan-jawapan");
    gridPilihan.innerHTML = "";
    document.getElementById("kotak-maklum-balas").style.display = "none";

    soalanSemasa.pilihan.forEach((teksPilihan, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-pilihan-jawapan";
        btn.textContent = teksPilihan;
        btn.disabled = !giliranSaya;
        if (giliranSaya) {
            btn.onclick = () => semakJawapanPelajar(idx, btn);
        }
        gridPilihan.appendChild(btn);
    });
}

function paparDashboardRumusan(sesi) {
    // Bahagian 1: Penarafan & 4 Metrik Utama
    const lencana = document.getElementById("lencana-penarafan");
    const ulasan = document.getElementById("ulasan-prestasi");

    if (sesi.kesihatan >= 80) {
        lencana.textContent = "🟢 OPERASI OPTIMUM (80% – 100%)";
        lencana.className = "lencana-penarafan status-optimum";
        ulasan.textContent = "Tahniah! Pasukan melaksanakan prosedur Preventive Maintenance dengan tepat, selamat, dan kos penyelenggaraan yang terkawal.";
    } else if (sesi.kesihatan >= 50) {
        lencana.textContent = "🟡 PERLU PEMANTAUAN (50% – 79%)";
        lencana.className = "lencana-penarafan status-pantau";
        ulasan.textContent = "Mesin berjaya dibaik pulih, namun beberapa kesilapan teknikal telah meningkatkan kos penyelenggaraan. Sila semak semula senarai semak SOP di bawah.";
    } else {
        lencana.textContent = "🔴 KRITIKAL / BREAKDOWN (< 50%)";
        lencana.className = "lencana-penarafan status-kritikal";
        ulasan.textContent = "Amaran: Terlalu banyak kesilapan prosedur berlaku sehingga menjejaskan kesihatan mesin secara serius dan menyebabkan kos baik pulih melambung tinggi.";
    }

    document.getElementById("akhir-kesihatan").textContent = `${sesi.kesihatan}%`;
    document.getElementById("akhir-kos").textContent = `RM ${sesi.kos.toLocaleString()}`;
    document.getElementById("akhir-salah").textContent = `${sesi.bilanganSalah} kali`;
    document.getElementById("akhir-tempoh").textContent = formatTempohMasa(sesi.masaMula, sesi.masaTamat);

    // Bahagian 2: Jadual Pecahan Prestasi Mengikut 5 Watak
    const tetapanRaw = localStorage.getItem("dma2252_tetapan");
    const senaraiTetapanWatak = tetapanRaw ? JSON.parse(tetapanRaw).watak : [];
    const tbody = document.getElementById("jadual-prestasi-watak");
    tbody.innerHTML = "";

    URUTAN_WATAK.forEach((w, idx) => {
        const stat = sesi.statistikWatak[w.id] || { nama: "", salah: 0, kos: 0 };
        const namaTetapan = senaraiTetapanWatak[idx] ? senaraiTetapanWatak[idx].nama : `Pelajar ${idx + 1}`;
        const namaPaparan = stat.nama && stat.nama.trim() !== "" ? stat.nama : namaTetapan;
        const statusBadge = stat.salah === 0
            ? `<span class="badge-status-ok">✅ Cemerlang</span>`
            : `<span class="badge-status-amaran">⚠️ Perlu Perhatian</span>`;

        tbody.innerHTML += `
            <tr>
                <td data-label="Watak"><strong>${w.tajuk}</strong></td>
                <td data-label="Nama Pelajar">${escapeTeks(namaPaparan)}</td>
                <td data-label="Bilangan Salah">${stat.salah}</td>
                <td data-label="Penalti Kos">${stat.kos > 0 ? "+RM " + stat.kos.toLocaleString() : "RM 0"}</td>
                <td data-label="Status Tugasan">${statusBadge}</td>
            </tr>
        `;
    });

    // Bahagian 3: Papan Refleksi "Belajar Dari Kesilapan"
    const kontenaRefleksi = document.getElementById("senarai-refleksi-kesilapan");
    if (!sesi.senaraiKesilapan || sesi.senaraiKesilapan.length === 0) {
        kontenaRefleksi.innerHTML = `
            <div class="kotak-tiada-salah">
                🎉 <strong>Sifar Kesilapan!</strong> Semua 5 watak mematuhi langkah SOP penyelenggaraan dengan tepat tanpa sebarang penalti.
            </div>
        `;
    } else {
        kontenaRefleksi.innerHTML = sesi.senaraiKesilapan.map((item, i) => `
            <div class="kad-refleksi-item">
                <div class="header-refleksi">
                    <span>#${i + 1} • <strong>${escapeTeks(item.watakTajuk)}</strong> (${escapeTeks(item.namaPelajar)})</span>
                    <span class="badge-penalti">-10% Kesihatan | +RM 500</span>
                </div>
                <p class="refleksi-soalan"><strong>Soalan ${item.nomborSoalan}:</strong> ${escapeTeks(item.teksSoalan)}</p>
                <p class="refleksi-salah">❌ <strong>Pilihan Salah:</strong> ${escapeTeks(item.jawapanSalahTeks)}</p>
                <p class="refleksi-sop">💡 <strong>Pembetulan SOP:</strong> ${escapeTeks(item.notaSop)}</p>
            </div>
        `).join("");
    }

    // Bahagian 4: Tarikh & Masa Work Order
    const tarikhObj = sesi.masaTamat ? new Date(sesi.masaTamat) : new Date();
    const formatTarikh = tarikhObj.toLocaleDateString("ms-MY", { day: "2-digit", month: "2-digit", year: "numeric" });
    const formatMasa = tarikhObj.toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit" });
    document.getElementById("wo-tarikh-masa").textContent = `Tarikh & Masa Pengesahan: ${formatTarikh}, ${formatMasa}`;
}

function semakJawapanPelajar(indeksDipilih, butangDitekan) {
    const sesi = ambilSesiSimulasi();
    const bankSoalan = ambilBankSoalan();
    const watakSemasaObj = URUTAN_WATAK[sesi.indeksWatak];
    const senaraiSoalanWatak = bankSoalan[watakSemasaObj.id].soalan;
    const jumlahSoalanWatak = senaraiSoalanWatak.length;
    const soalanSemasa = senaraiSoalanWatak[sesi.indeksSoalan];
    const namaPengguna = sessionStorage.getItem("namaAktif") || watakSemasaObj.tajuk;
    const kotakMaklumBalas = document.getElementById("kotak-maklum-balas");

    const hurufPilihan = ["A", "B", "C", "D"][indeksDipilih];

    // Pastikan rekod statistik watak wujud
    if (!sesi.statistikWatak[watakSemasaObj.id]) {
        sesi.statistikWatak[watakSemasaObj.id] = { nama: namaPengguna, salah: 0, kos: 0 };
    }
    sesi.statistikWatak[watakSemasaObj.id].nama = namaPengguna;

    if (indeksDipilih === soalanSemasa.jawapanBetul) {
        document.querySelectorAll(".btn-pilihan-jawapan").forEach(b => b.disabled = true);
        butangDitekan.classList.add("jawapan-betul");

        kotakMaklumBalas.style.display = "block";
        kotakMaklumBalas.className = "kotak-maklum-balas betul";
        kotakMaklumBalas.innerHTML = `✅ <strong>Tindakan Tepat!</strong> Merekodkan ke dalam borang kerja...`;

        sesi.log.push({
            masa: dapatkanMasaSemasa(),
            jenis: "betul",
            teks: `✅ <strong>${watakSemasaObj.tajuk} (${escapeTeks(namaPengguna)})</strong> menjawab tepat pada Soalan ${sesi.indeksSoalan + 1} (Pilihan ${hurufPilihan}).`
        });

        if (sesi.indeksSoalan < jumlahSoalanWatak - 1) {
            sesi.indeksSoalan += 1;
        } else if (sesi.indeksWatak < URUTAN_WATAK.length - 1) {
            const watakSeterusnya = URUTAN_WATAK[sesi.indeksWatak + 1];
            sesi.log.push({
                masa: dapatkanMasaSemasa(),
                jenis: "serahan",
                teks: `📋 <strong>SERAHAN BORANG:</strong> ${watakSemasaObj.tajuk} telah melengkapkan ${jumlahSoalanWatak} tugasan dan menyerahkan borang kepada <strong>${watakSeterusnya.tajuk}</strong>.`
            });
            sesi.indeksWatak += 1;
            sesi.indeksSoalan = 0;
        } else {
            sesi.tamat = true;
            sesi.masaTamat = Date.now();
            sesi.log.push({
                masa: dapatkanMasaSemasa(),
                jenis: "serahan",
                teks: `🏆 <strong>PENGESAHAN SELESAI:</strong> ${watakSemasaObj.tajuk} telah menandatangani kelulusan akhir mesin.`
            });
        }

        simpanSesiSimulasi(sesi);
        setTimeout(() => {
            paparSkrinSimulasi();
        }, 1200);
    } else {
        butangDitekan.disabled = true;
        butangDitekan.classList.add("jawapan-salah");

        sesi.kesihatan = Math.max(0, sesi.kesihatan - 10);
        sesi.kos += 500;
        sesi.bilanganSalah += 1;

        sesi.statistikWatak[watakSemasaObj.id].salah += 1;
        sesi.statistikWatak[watakSemasaObj.id].kos += 500;

        const catatanKesan = soalanSemasa.kesanSalah || "Tindakan tidak mengikut SOP penyelenggaraan.";

        sesi.senaraiKesilapan.push({
            watakTajuk: watakSemasaObj.tajuk,
            namaPelajar: namaPengguna,
            nomborSoalan: sesi.indeksSoalan + 1,
            teksSoalan: soalanSemasa.teks,
            jawapanSalahTeks: soalanSemasa.pilihan[indeksDipilih],
            notaSop: catatanKesan
        });

        kotakMaklumBalas.style.display = "block";
        kotakMaklumBalas.className = "kotak-maklum-balas salah";
        kotakMaklumBalas.innerHTML = `
            ❌ <strong>Tindakan Kurang Tepat (Pilihan ${hurufPilihan})!</strong><br>
            <span>Kesan: Kesihatan Mesin <strong>-10%</strong> | Kos Baik Pulih <strong>+RM 500</strong></span><br>
            <small>${escapeTeks(catatanKesan)} Sila pilih tindakan yang betul untuk meneruskan.</small>
        `;

        sesi.log.push({
            masa: dapatkanMasaSemasa(),
            jenis: "salah",
            teks: `❌ <strong>KESILAPAN — ${watakSemasaObj.tajuk} (${escapeTeks(namaPengguna)})</strong> memilih jawapan <strong>${hurufPilihan}</strong> pada Soalan ${sesi.indeksSoalan + 1}. <em>Kesan: Kesihatan Mesin -10% (${sesi.kesihatan}%), Kos +RM 500 (RM ${sesi.kos.toLocaleString()}). ${escapeTeks(catatanKesan)}</em>`
        });

        simpanSesiSimulasi(sesi);

        document.getElementById("teks-kesihatan").textContent = `${sesi.kesihatan}%`;
        document.getElementById("bar-kesihatan").style.width = `${sesi.kesihatan}%`;
        document.getElementById("teks-kos").textContent = `RM ${sesi.kos.toLocaleString()}`;

        const kontenaLog = document.getElementById("senarai-log-aktiviti");
        kontenaLog.innerHTML = sesi.log.slice().reverse().map(item => `
            <div class="item-log log-${item.jenis}">
                <span class="masa-log">[${item.masa}]</span>
                <span>${item.teks}</span>
            </div>
        `).join("");
    }
}

// --- MODAL MULA PUSINGAN BAHARU (ADMIN) ---
function bukaModalResetAkhir() {
    const modal = document.getElementById("modal-reset-akhir");
    const input = document.getElementById("passResetAkhirInput");
    const ralat = document.getElementById("ralat-reset-akhir");
    if (modal) {
        modal.style.display = "flex";
        if (input) {
            input.value = "";
            setTimeout(() => input.focus(), 50);
        }
        if (ralat) ralat.style.display = "none";
    }
}

function tutupModalResetAkhir() {
    const modal = document.getElementById("modal-reset-akhir");
    if (modal) modal.style.display = "none";
}

function sahkanResetAkhir() {
    const input = document.getElementById("passResetAkhirInput");
    const ralat = document.getElementById("ralat-reset-akhir");
    const tetapanRaw = localStorage.getItem("dma2252_tetapan");
    const passAdminSah = tetapanRaw ? (JSON.parse(tetapanRaw).passAdmin || "123") : "123";

    if ((input ? input.value.trim() : "") === passAdminSah) {
        localStorage.removeItem("dma2252_sesi_simulasi");
        tutupModalResetAkhir();
        paparSkrinSimulasi();
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        if (ralat) ralat.style.display = "block";
    }
}

function keluarSimulasi() {
    sessionStorage.removeItem("watakAktifId");
    sessionStorage.removeItem("namaAktif");
    window.location.href = "index.html";
}