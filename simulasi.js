// Dapatkan status sesi simulasi semasa
function ambilSesiSimulasi() {
    const asal = {
        indeksWatak: 0, // 0: Operator, 1: Juruteknik, 2: Jurutera, 3: Pengurusan, 4: QC
        indeksSoalan: 0, // 0 hingga 4
        kesihatan: 100,
        kos: 0,
        bilanganSalah: 0,
        tamat: false,
        log: [
            {
                masa: dapatkanMasaSemasa(),
                jenis: "info",
                teks: "Sesi simulasi dimulakan. Menunggu tindakan daripada 1. Operator."
            }
        ]
    };

    try {
        const simpanan = localStorage.getItem("dma2252_sesi_simulasi");
        return simpanan ? JSON.parse(simpanan) : asal;
    } catch (e) {
        return asal;
    }
}

function simpanSesiSimulasi(sesi) {
    localStorage.setItem("dma2252_sesi_simulasi", JSON.stringify(sesi));
}

function dapatkanMasaSemasa() {
    const skg = new Date();
    return skg.toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit" });
}

// Dijalankan apabila simulasi.html dibuka
document.addEventListener("DOMContentLoaded", function () {
    const tetapanRaw = localStorage.getItem("dma2252_tetapan");
    if (tetapanRaw) {
        const tetapan = JSON.parse(tetapanRaw);
        document.getElementById("sim-tajuk-kursus").textContent = tetapan.tajukUtama || "MACHINE MAINTENANCE DMA2252";
        document.getElementById("sim-subtopik").textContent = tetapan.subtopik || "PREVENTIVE MAINTENANCE";
    }

    paparSkrinSimulasi();

    // Kemas kini automatik jika ada perubahan dari tab lain pada pelayar yang sama
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

    // 1. Papar Identiti Pengguna di Bar Atas
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

    // 5. Semak Jika Simulasi Sudah Tamat
    const kadSoalan = document.getElementById("kad-soalan-utama");
    const kadTamat = document.getElementById("kad-tamat-simulasi");

    if (sesi.tamat) {
        document.getElementById("teks-giliran-semasa").textContent = "Selesai (Disahkan QC)";
        document.getElementById("teks-kemajuan-soalan").textContent = "25 / 25 Soalan Lengkap";
        document.getElementById("banner-serahan").style.display = "none";
        kadSoalan.style.display = "none";
        kadTamat.style.display = "block";

        document.getElementById("akhir-kesihatan").textContent = `${sesi.kesihatan}%`;
        document.getElementById("akhir-kos").textContent = `RM ${sesi.kos.toLocaleString()}`;
        document.getElementById("akhir-salah").textContent = `${sesi.bilanganSalah} kali`;

        let ulasan = "Cemerlang! Pasukan mematuhi SOP penyelenggaraan dengan tahap kerosakan minimum.";
        if (sesi.kesihatan < 50) {
            ulasan = "Perhatian: Banyak kesilapan teknikal berlaku menyebabkan kos baik pulih meningkat dan kesihatan mesin merosot.";
        }
        document.getElementById("ulasan-prestasi").textContent = ulasan;
        return;
    }

    kadSoalan.style.display = "block";
    kadTamat.style.display = "none";

    // 6. Papar Soalan Watak Semasa
    const watakSemasaObj = URUTAN_WATAK[sesi.indeksWatak];
    const dataWatak = bankSoalan[watakSemasaObj.id];
    const soalanSemasa = dataWatak.soalan[sesi.indeksSoalan];

    document.getElementById("teks-giliran-semasa").textContent = watakSemasaObj.tajuk;
    document.getElementById("teks-kemajuan-soalan").textContent = `Soalan ${sesi.indeksSoalan + 1} daripada 5`;
    document.getElementById("banner-serahan").style.display = "block";
    document.getElementById("banner-serahan").textContent = dataWatak.notaSerahan;
    document.getElementById("label-nombor-soalan").textContent = `${watakSemasaObj.tajuk} — Soalan ${sesi.indeksSoalan + 1} / 5`;

    // Tentukan sama ada pengguna semasa dibenarkan menjawab
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

    // Papar Media (Gambar / Video) & Teks Soalan di Bawahnya
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

    // Papar 4 Pilihan Jawapan
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

function semakJawapanPelajar(indeksDipilih, butangDitekan) {
    const sesi = ambilSesiSimulasi();
    const bankSoalan = ambilBankSoalan();
    const watakSemasaObj = URUTAN_WATAK[sesi.indeksWatak];
    const soalanSemasa = bankSoalan[watakSemasaObj.id].soalan[sesi.indeksSoalan];
    const namaPengguna = sessionStorage.getItem("namaAktif") || watakSemasaObj.tajuk;
    const kotakMaklumBalas = document.getElementById("kotak-maklum-balas");

    const hurufPilihan = ["A", "B", "C", "D"][indeksDipilih];

    // Jika Jawapan BETUL
    if (indeksDipilih === soalanSemasa.jawapanBetul) {
        // Kunci semua butang sementara sebelum ke soalan seterusnya
        document.querySelectorAll(".btn-pilihan-jawapan").forEach(b => b.disabled = true);
        butangDitekan.classList.add("jawapan-betul");

        kotakMaklumBalas.style.display = "block";
        kotakMaklumBalas.className = "kotak-maklum-balas betul";
        kotakMaklumBalas.innerHTML = `✅ <strong>Tindakan Tepat!</strong> Merekodkan ke dalam borang kerja...`;

        sesi.log.push({
            masa: dapatkanMasaSemasa(),
            jenis: "betul",
            teks: `✅ <strong>${watakSemasaObj.tajuk} (${namaPengguna})</strong> menjawab tepat pada Soalan ${sesi.indeksSoalan + 1} (Pilihan ${hurufPilihan}).`
        });

        // Bergerak ke soalan seterusnya atau serah tugas ke watak berikutnya
        if (sesi.indeksSoalan < 4) {
            sesi.indeksSoalan += 1;
        } else if (sesi.indeksWatak < URUTAN_WATAK.length - 1) {
            const watakSeterusnya = URUTAN_WATAK[sesi.indeksWatak + 1];
            sesi.log.push({
                masa: dapatkanMasaSemasa(),
                jenis: "serahan",
                teks: `📋 <strong>SERAHAN BORANG:</strong> ${watakSemasaObj.tajuk} telah melengkapkan 5 tugasan dan menyerahkan borang kepada <strong>${watakSeterusnya.tajuk}</strong>.`
            });
            sesi.indeksWatak += 1;
            sesi.indeksSoalan = 0;
        } else {
            sesi.tamat = true;
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
    }
    // Jika Jawapan SALAH
    else {
        butangDitekan.disabled = true;
        butangDitekan.classList.add("jawapan-salah");

        sesi.kesihatan = Math.max(0, sesi.kesihatan - 10);
        sesi.kos += 500;
        sesi.bilanganSalah += 1;

        const catatanKesan = soalanSemasa.kesanSalah || "Tindakan tidak mengikut SOP penyelenggaraan.";

        kotakMaklumBalas.style.display = "block";
        kotakMaklumBalas.className = "kotak-maklum-balas salah";
        kotakMaklumBalas.innerHTML = `
            ❌ <strong>Tindakan Kurang Tepat (Pilihan ${hurufPilihan})!</strong><br>
            <span>Kesan: Kesihatan Mesin <strong>-10%</strong> | Kos Baik Pulih <strong>+RM 500</strong></span><br>
            <small>${catatanKesan} Sila pilih tindakan yang betul untuk meneruskan.</small>
        `;

        sesi.log.push({
            masa: dapatkanMasaSemasa(),
            jenis: "salah",
            teks: `❌ <strong>KESILAPAN — ${watakSemasaObj.tajuk} (${namaPengguna})</strong> memilih jawapan <strong>${hurufPilihan}</strong> pada Soalan ${sesi.indeksSoalan + 1}. <em>Kesan: Kesihatan Mesin -10% (${sesi.kesihatan}%), Kos +RM 500 (RM ${sesi.kos.toLocaleString()}). ${catatanKesan}</em>`
        });

        simpanSesiSimulasi(sesi);

        // Kemas kini meter atas dan log serta-merta tanpa memadam tanda merah pada butang
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

function keluarSimulasi() {
    sessionStorage.removeItem("watakAktifId");
    sessionStorage.removeItem("namaAktif");
    window.location.href = "index.html";
}