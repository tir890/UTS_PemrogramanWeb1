// ===============================================
// SCRIPT.JS — UTSPemrograman Web
// ===============================================

// Jalankan fungsi sesuai halaman yang sedang dibuka
document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname.split("/").pop();

  switch (page) {
    case "index.html":
      initLoginPage();
      break;
    case "dashboard.html":
      tampilGreeting();
      break;
    case "stok.html":
      loadKatalog();
      break;
    case "checkout.html":
      initCheckout();
      break;
    case "tracking.html":
      // gak butuh init, tombol "Cari" panggil fungsi langsung
      break;
  }
});

// ========================
// LOGIN PAGE
// ========================
function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = dataPengguna.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("userLogin", JSON.stringify(user));
      alert(`Login berhasil, selamat datang ${user.nama}!`);
      window.location.href = "dashboard.html";
    } else {
      alert("Email atau password yang anda masukkan salah!");
    }
  });
}

// ========================
// DASHBOARD PAGE
// ========================
function tampilGreeting() {
  const greetEl = document.getElementById("greeting");
  if (!greetEl) return;

  const jam = new Date().getHours();
  let ucapan = "";

  if (jam >= 5 && jam < 12) ucapan = "Selamat Pagi";
  else if (jam >= 12 && jam < 15) ucapan = "Selamat Siang";
  else if (jam >= 15 && jam < 18) ucapan = "Selamat Sore";
  else ucapan = "Selamat Malam";

  const user = JSON.parse(localStorage.getItem("userLogin"));
  greetEl.textContent = `${ucapan}, ${user ? user.nama : "Pengguna"}!`;
}

// ========================
// STOK / KATALOG PAGE
// ========================
function loadKatalog() {
  const tbody = document.querySelector("#tableKatalog tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  dataKatalogBuku.forEach((b) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${b.kodeBarang}</td>
      <td>${b.namaBarang}</td>
      <td>${b.jenisBarang}</td>
      <td>${b.edisi}</td>
      <td>${b.stok}</td>
      <td>${b.harga}</td>
    `;
    tbody.appendChild(row);
  });
}

// Tambah stok baru secara dinamis
function addRowForm() {
  const form = document.getElementById("formAdd");
  if (form) form.classList.toggle("hidden");
}

function saveRow() {
  const kode = document.getElementById("kode").value.trim();
  const judul = document.getElementById("judul").value.trim();
  const jenis = document.getElementById("jenis").value.trim();
  const edisi = document.getElementById("edisi").value.trim();
  const stok = document.getElementById("stok").value.trim();
  const harga = document.getElementById("harga").value.trim();

  if (!kode || !judul || !stok || !harga)
    return alert("Isi semua kolom sebelum menyimpan!");

  dataKatalogBuku.push({
    kodeBarang: kode,
    namaBarang: judul,
    jenisBarang: jenis || "Buku Ajar",
    edisi: edisi || "-",
    stok: parseInt(stok),
    harga: `Rp ${harga}`,
    cover: "",
  });

  alert("Data stok baru berhasil ditambahkan!");
  loadKatalog();
  document.getElementById("formAdd").classList.add("hidden");
}

// ========================
// CHECKOUT / PEMESANAN
// ========================
let pesanan = [];

function initCheckout() {
  const select = document.getElementById("listBuku");
  if (!select) return;

  // isi dropdown dari data.js
  dataKatalogBuku.forEach((buku) => {
    const opt = document.createElement("option");
    opt.value = buku.kodeBarang;
    opt.textContent = buku.namaBarang;
    select.appendChild(opt);
  });
}

function tambahPesanan() {
  const kode = document.getElementById("listBuku").value;
  const qty = parseInt(document.getElementById("qty").value);

  const buku = dataKatalogBuku.find((b) => b.kodeBarang === kode);
  if (!buku || qty <= 0) return alert("Pilih buku dan jumlah yang benar!");

  const hargaNum = parseInt(buku.harga.replace(/\D/g, ""));
  pesanan.push({
    judul: buku.namaBarang,
    qty,
    harga: hargaNum,
    total: hargaNum * qty,
  });

  renderPesanan();
}

function renderPesanan() {
  const tbody = document.querySelector("#tablePesanan tbody");
  const totalEl = document.getElementById("grandTotal");

  tbody.innerHTML = "";
  let totalAll = 0;

  pesanan.forEach((p) => {
    totalAll += p.total;
    tbody.innerHTML += `
      <tr>
        <td>${p.judul}</td>
        <td>${p.qty}</td>
        <td>Rp ${p.harga.toLocaleString("id-ID")}</td>
        <td>Rp ${p.total.toLocaleString("id-ID")}</td>
      </tr>`;
  });

  totalEl.textContent = `Total: Rp ${totalAll.toLocaleString("id-ID")}`;
}

// ========================
// TRACKING PENGIRIMAN
// ========================
function cariTracking() {
  const no = document.getElementById("noDO").value.trim();
  const result = document.getElementById("trackingResult");
  if (!no) return (result.innerHTML = "<p>Masukkan nomor DO terlebih dahulu!</p>");

  const data = dataTracking[no];
  if (!data)
    return (result.innerHTML = `<p style="color:red;">Nomor DO tidak ditemukan!</p>`);

  const perjalananHTML = data.perjalanan
    .map((x) => `<li><b>${x.waktu}</b> — ${x.keterangan}</li>`)
    .join("");

  result.innerHTML = `
    <h3>${data.nama}</h3>
    <p>Status: <b>${data.status}</b></p>
    <p>Ekspedisi: ${data.ekspedisi}</p>
    <p>Tanggal Kirim: ${data.tanggalKirim}</p>
    <p>Total Pembayaran: ${data.total}</p>
    <ul>${perjalananHTML}</ul>
  `;
}
