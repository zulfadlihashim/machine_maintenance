// Data Tetapan Asal Sistem
const tetapanAsal = {
    tajukUtama: "MACHINE MAINTENANCE DMA2252 KOLEJ VOKASIONAL KERIAN",
    subtopik: "SUBTOPIK (PREVENTIVE MAINTENANCE)",
    passAdmin: "123",
    watak: [
        { id: "operator", jawatan: "1. Operator", nama: "Pelajar 1", pass: "op111" },
        { id: "juruteknik", jawatan: "2. Juruteknik Penyelenggaraan", nama: "Pelajar 2", pass: "tek222" },
        { id: "jurutera", jawatan: "3. Jurutera", nama: "Pelajar 3", pass: "jur333" },
        { id: "pengurusan", jawatan: "4. Pengurusan", nama: "Pelajar 4", pass: "pen444" },
        { id: "qc", jawatan: "5. Pegawai QC", nama: "Pelajar 5", pass: "qc555" }
    ]
};

// Fungsi mendapatkan data terkini dari simpanan pelayar
function ambilTetapan() {
    const dataSimpanan = localStorage.getItem("dma2252_tetapan");
    return dataSimpanan ? JSON.parse(dataSimpanan) : JSON.parse(JSON.stringify(tetapanAsal));
}

// Dijalankan secara automatik apabila halaman dibuka
document.addEventListener("DOMContentLoaded", function () {
    const data = ambilTetapan();

    // 1. Jika berada di halaman index.html
    const elTajuk = document.getElementById("paparan-tajuk");
    const elSubtopik = document.getElementById("paparan-subtopik");
    if (elTajuk && elSubtopik) {
        elTajuk.textContent = data.tajukUtama;
        elSubtopik.textContent = data.subtopik;

        // Benarkan tekan kekunci Enter pada kotak kata laluan pelajar & admin
        document.getElementById("kataLaluan").addEventListener("keypress", function (e) {
            if (e.key === "Enter") semakLogMasukPelajar();
        });
        document.getElementById("passAdminInput").addEventListener("keypress", function (e) {
            if (e.key === "Enter") sahkanAdmin();
        });
    }

    // 2. Jika berada di halaman admin.html
    if (document.getElementById("senarai-watak-admin")) {
        if (sessionStorage.getItem("statusAdmin") !== "sah") {
            window.location.href = "index.html";
            return;
        }
        muatBorangAdmin(data);
    }
});

// --- FUNGSI LOG MASUK PELAJAR (index.html) ---
function semakLogMasukPelajar() {
    const namaInput = document.getElementById("namaPelajar").value.trim();
    const passInput = document.getElementById("kataLaluan").value.trim();
    const mesejRalat = document.getElementById("mesej-ralat");
    const data = ambilTetapan();

    mesejRalat.style.display = "none";

    const watakDijumpai = data.watak.find(w => w.pass === passInput);

    if (watakDijumpai) {
        const namaDigunakan = namaInput !== "" ? namaInput : watakDijumpai.nama;
        alert(
            "Log Masuk Berjaya!\n\n" +
            "Nama: " + namaDigunakan + "\n" +
            "Watak: " + watakDijumpai.jawatan + "\n\n" +
            "(Sedia untuk ke halaman simulasi)"
        );
    } else {
        mesejRalat.style.display = "block";
    }
}

// --- FUNGSI MODAL ADMIN (index.html) ---
function bukaModalAdmin() {
    document.getElementById("modal-admin").style.display = "flex";
    document.getElementById("passAdminInput").value = "";
    document.getElementById("ralat-admin").style.display = "none";
    document.getElementById("passAdminInput").focus();
}

function tutupModalAdmin() {
    document.getElementById("modal-admin").style.display = "none";
}

function sahkanAdmin() {
    const passAdmin = document.getElementById("passAdminInput").value;
    const data = ambilTetapan();

    if (passAdmin === data.passAdmin) {
        sessionStorage.setItem("statusAdmin", "sah");
        window.location.href = "admin.html";
    } else {
        document.getElementById("ralat-admin").style.display = "block";
    }
}

// --- FUNGSI PANEL ADMIN (admin.html) ---
function muatBorangAdmin(data) {
    document.getElementById("inputTajukUtama").value = data.tajukUtama;
    document.getElementById("inputSubtopik").value = data.subtopik;

    const tbody = document.getElementById("senarai-watak-admin");
    tbody.innerHTML = "";

    data.watak.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td data-label="Watak Simulasi"><strong>${item.jawatan}</strong></td>
                <td data-label="Nama Pelajar"><input type="text" id="nama_${index}" value="${item.nama}" placeholder="Nama pelajar"></td>
                <td data-label="Kata Laluan"><input type="text" id="pass_${index}" value="${item.pass}" placeholder="Kata laluan"></td>
            </tr>
        `;
    });
}

function simpanTetapanAdmin() {
    const data = ambilTetapan();
    data.tajukUtama = document.getElementById("inputTajukUtama").value.trim();
    data.subtopik = document.getElementById("inputSubtopik").value.trim();

    data.watak.forEach((item, index) => {
        item.nama = document.getElementById(`nama_${index}`).value.trim();
        item.pass = document.getElementById(`pass_${index}`).value.trim();
    });

    localStorage.setItem("dma2252_tetapan", JSON.stringify(data));

    const notis = document.getElementById("notis-simpan");
    notis.style.display = "block";
    setTimeout(() => { notis.style.display = "none"; }, 3000);
}

function setSemulaTetapan() {
    if (confirm("Adakah cikgu pasti mahu mengembalikan semua tajuk dan kata laluan kepada tetapan asal?")) {
        localStorage.removeItem("dma2252_tetapan");
        muatBorangAdmin(ambilTetapan());
        alert("Tetapan asal telah dipulihkan.");
    }
}

function logKeluarAdmin() {
    sessionStorage.removeItem("statusAdmin");
    window.location.href = "index.html";
}