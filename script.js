/* GIFTY — JavaScript
   Mengatur galeri, filter, editor, preview, upload foto, dan link hadiah.
*/
(() => {
  "use strict";

  // Fungsi singkat untuk memilih elemen HTML.
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const templateGrid = $("#templateGrid");
  const editorModal = $("#editorModal");
  const giftForm = $("#giftForm");
  const publicView = $("#publicView");
  const toast = $("#toast");

  // Data template yang tersedia di galeri.
  const templates = [
    {
      id: "love",
      title: "Love Letter",
      category: "love",
      description: "A little letter for your favorite person.",
      emoji: "💌",
      color: "#ffd6df",
      headline: "A little letter for you",
      message: "There's something about you that makes ordinary days feel special. Thank you for being you.",
      tag: "For someone special"
    },
    {
      id: "birthday",
      title: "Birthday Cake",
      category: "birthday",
      description: "Make their special day a little sweeter.",
      emoji: "🎂",
      color: "#ffe58a",
      headline: "Happy Birthday!",
      message: "Today is all about you. I hope your day is filled with little things that make you smile.",
      tag: "Birthday"
    },
    {
      id: "memory",
      title: "Memory Lane",
      category: "friends",
      description: "Keep your favorite memories in one place.",
      emoji: "📸",
      color: "#dce8d5",
      headline: "Our little memories",
      message: "Some of my favorite moments are the simplest ones, especially when you're there.",
      tag: "Our memories"
    },
    {
      id: "mixtape",
      title: "Mixtape for You",
      category: "love",
      description: "A playlist-shaped way to say what you feel.",
      emoji: "🎧",
      color: "#e6dcf7",
      headline: "Songs that remind me of you",
      message: "Every song has a little piece of a memory. Here's a few that made me think of you.",
      tag: "Press play"
    },
    {
      id: "surprise",
      title: "Surprise Box",
      category: "cute",
      description: "A tiny surprise wrapped in a digital gift.",
      emoji: "🎁",
      color: "#ffd6df",
      headline: "A little surprise!",
      message: "You deserve something nice today. So here's a little reminder that someone is thinking of you.",
      tag: "Open me"
    },
    {
      id: "bestie",
      title: "Bestie Certificate",
      category: "friends",
      description: "Official proof that they're your favorite human.",
      emoji: "🏆",
      color: "#ffe58a",
      headline: "Certified Bestie",
      message: "Awarded for being an absolute icon, making ordinary days fun, and being one of my favorite people.",
      tag: "Bestie approved"
    },
    {
      id: "universe",
      title: "My Little Universe",
      category: "cute",
      description: "A tiny universe made just for them.",
      emoji: "🌙",
      color: "#e6dcf7",
      headline: "You are your own universe",
      message: "I hope you remember how much light you bring into the little corners of this world.",
      tag: "Made of stardust"
    },
    {
      id: "sunshine",
      title: "Pocket Sunshine",
      category: "cute",
      description: "A pocket-sized reminder for a cloudy day.",
      emoji: "☀️",
      color: "#ffe58a",
      headline: "A little sunshine for you",
      message: "If today feels a little heavy, here's a small reminder that brighter moments can still find you.",
      tag: "You got this"
    }
  ];

  // Menyimpan keadaan template dan hadiah yang sedang dibuat.
  let selectedTemplate = templates[0];
  let selectedColor = selectedTemplate.color;
  let photoData = "";
  let generatedGiftLink = "";
  let toastTimer;

  // Menampilkan notifikasi singkat.
  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  // Mengubah data hadiah menjadi Base64 agar dapat disimpan dalam URL.
  function encodeData(data) {
    const bytes = new TextEncoder().encode(JSON.stringify(data));

    let binary = "";

    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  // Membaca kembali data hadiah dari URL.
  function decodeData(encoded) {
    const base64 = encoded
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      "="
    );

    const binary = atob(padded);

    const bytes = Uint8Array.from(binary, (char) => {
      return char.charCodeAt(0);
    });

    return JSON.parse(new TextDecoder().decode(bytes));
  }

  // Mengambil data yang diisi pengguna pada form.
  function getGiftData() {
    return {
      templateId: selectedTemplate.id,
      recipient: $("#recipient")?.value.trim() || "",
      sender: $("#sender")?.value.trim() || "",
      headline: $("#headline")?.value.trim() || selectedTemplate.headline,
      message: $("#message")?.value.trim() || "",
      song: $("#song")?.value.trim() || "",
      color: selectedColor,
      photo: photoData,
      emoji: selectedTemplate.emoji
    };
  }

  // Menampilkan template pada galeri.
  function renderTemplates(filter = "all") {
    if (!templateGrid) return;

    const filtered = filter === "all"
      ? templates
      : templates.filter((item) => item.category === filter);

    const count = $("#templateCount");

    if (count) {
      count.textContent =
        `${filtered.length} TEMPLATE${filtered.length === 1 ? "" : "S"}`;
    }

    // Tampilkan pesan jika tidak ada template.
    if (!filtered.length) {
      templateGrid.innerHTML =
        '<div class="empty-state">Template tidak ditemukan.</div>';
      return;
    }

    // Membuat kartu template.
    templateGrid.innerHTML = filtered.map((item) => `
      <article class="template-card">
        <div class="template-art" style="background:${item.color}">
          <span aria-hidden="true">${item.emoji}</span>
        </div>

        <div class="template-info">
          <h3>${item.title}</h3>
          <p>${item.description}</p>

          <div class="template-bottom">
            <span class="template-tag">${item.tag}</span>

            <button type="button" data-template="${item.id}">
              Make yours
            </button>
          </div>
        </div>
      </article>
    `).join("");
  }

  // Mengatur filter galeri ketika tombol filter diklik.
  $$("#filters [data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      $$("#filters [data-filter]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      renderTemplates(button.dataset.filter || "all");
    });
  });

  // Memperbarui preview berdasarkan isi form.
  function updatePreview() {
    const data = getGiftData();

    const title = $("#prevTitle");
    const message = $("#prevMessage");
    const emoji = $("#prevEmoji");
    const tag = $("#prevTag");
    const sign = $("#prevSign");
    const preview = $("#livePreview");
    const image = $("#prevPhoto");
    const count = $("#charCount");

    if (title) {
      title.textContent = data.headline || "A little gift for you";
    }

    if (message) {
      message.textContent =
        data.message || "Your lovely message will appear here.";
    }

    if (emoji) {
      emoji.textContent = data.emoji;
    }

    if (tag) {
      tag.textContent = `For ${data.recipient || "someone special"}`;
    }

    if (sign) {
      sign.textContent = data.sender
        ? `— with love, ${data.sender}`
        : "— with love";
    }

    if (preview) {
      preview.style.backgroundColor = selectedColor;
    }

    if (count) {
      count.textContent = String($("#message")?.value.length || 0);
    }

    // Tampilkan foto jika pengguna sudah memilihnya.
    if (image) {
      image.hidden = !photoData;

      if (photoData) {
        image.src = photoData;
      } else {
        image.removeAttribute("src");
      }
    }
  }

  // Menyesuaikan warna template dengan pilihan warna pada form.
  function colorToAccentValue(color) {
    const options = [
      "#f5c957",
      "#f3c7d0",
      "#c8d9bf",
      "#d9c9ef",
      "#f0c5a2"
    ];

    const map = {
      "#ffe58a": "#f5c957",
      "#ffd6df": "#f3c7d0",
      "#dce8d5": "#c8d9bf",
      "#e6dcf7": "#d9c9ef"
    };

    return map[color] || (
      options.includes(color) ? color : "#f5c957"
    );
  }

  // Membuka editor dan memuat template yang dipilih.
  function openEditor(templateId) {
    selectedTemplate =
      templates.find((item) => item.id === templateId) || templates[0];

    selectedColor = selectedTemplate.color;
    photoData = "";
    generatedGiftLink = "";

    if (giftForm) {
      giftForm.reset();
    }

    $("#recipient").value = "";
    $("#sender").value = "";
    $("#headline").value = selectedTemplate.headline;
    $("#message").value = selectedTemplate.message;
    $("#song").value = "";
    $("#accent").value = colorToAccentValue(selectedColor);

    $("#prevPhoto").hidden = true;
    $("#prevPhoto").removeAttribute("src");

    $("#linkResult").hidden = true;
    $("#copyLink").disabled = true;

    $("#linkStatus").textContent =
      "Preview akan berubah saat kamu mengisi form.";

    editorModal?.classList.add("show");
    editorModal?.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    updatePreview();

    $("#recipient")?.focus();
  }

  // Menutup editor hadiah.
  function closeEditor() {
    editorModal?.classList.remove("show");
    editorModal?.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");
  }

  // Klik tombol pada kartu template untuk membuka editor.
  templateGrid?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-template]");

    if (button) {
      openEditor(button.dataset.template);
    }
  });

  // Tombol navigasi dan tombol aksi utama.
  $("#createNav")?.addEventListener("click", () => {
    openEditor(selectedTemplate.id);
  });

  $("#browseBtn")?.addEventListener("click", () => {
    $("#gallery")?.scrollIntoView({ behavior: "smooth" });
  });

  $("#howNav")?.addEventListener("click", () => {
    $("#how")?.scrollIntoView({ behavior: "smooth" });
  });

  // Memilih template secara acak.
  $("#surpriseBtn")?.addEventListener("click", () => {
    const random =
      templates[Math.floor(Math.random() * templates.length)];

    openEditor(random.id);
  });

  // Menutup editor dengan tombol tutup.
  $("#closeEditor")?.addEventListener("click", closeEditor);

  // Menutup editor jika area gelap di luar modal diklik.
  editorModal?.addEventListener("click", (event) => {
    if (event.target === editorModal) {
      closeEditor();
    }
  });

  // Menutup editor menggunakan tombol Escape.
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      editorModal?.classList.contains("show")
    ) {
      closeEditor();
    }
  });

  // Perbarui preview setiap kali pengguna mengetik.
  ["#recipient", "#sender", "#headline", "#message", "#song"]
    .forEach((selector) => {
      $(selector)?.addEventListener("input", updatePreview);
    });

  // Mengubah warna preview.
  $("#accent")?.addEventListener("change", (event) => {
    selectedColor = event.target.value;
    updatePreview();
  });

  // Membaca foto dari komputer pengguna.
  $("#photo")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      photoData = "";
      updatePreview();
      return;
    }

    // Pastikan file yang dipilih berupa gambar.
    if (!file.type.startsWith("image/")) {
      showToast("Pilih file gambar yang valid.");
      event.target.value = "";
      return;
    }

    // Batasi ukuran foto agar link tidak terlalu panjang.
    if (file.size > 600 * 1024) {
      showToast("Ukuran foto maksimal 600 KB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      photoData =
        typeof reader.result === "string" ? reader.result : "";

      updatePreview();
    };

    reader.onerror = () => {
      showToast("Foto tidak bisa dibaca. Coba pilih foto lain.");
    };

    reader.readAsDataURL(file);
  });

  // Memperbarui preview melalui tombol preview.
  $("#previewOpen")?.addEventListener("click", () => {
    updatePreview();
    showToast("Preview sudah diperbarui.");
  });

  // Membuat link hadiah dari URL halaman saat ini.
  function createGiftLink(data) {
    const url = new URL(window.location.href);

    url.hash = `gift=${encodeData(data)}`;

    return url.href;
  }

  // Memproses form ketika tombol generate ditekan.
  giftForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = getGiftData();

    // Validasi nama penerima.
    if (!data.recipient) {
      showToast("Isi nama penerima dulu.");
      $("#recipient")?.focus();
      return;
    }

    // Validasi judul.
    if (!data.headline) {
      showToast("Isi judul hadiah dulu.");
      $("#headline")?.focus();
      return;
    }

    // Validasi pesan.
    if (!data.message) {
      showToast("Tulis pesan hadiah dulu.");
      $("#message")?.focus();
      return;
    }

    // Validasi URL lagu jika diisi.
    if (data.song) {
      try {
        const songURL = new URL(data.song);

        if (!["http:", "https:"].includes(songURL.protocol)) {
          throw new Error("Invalid URL");
        }
      } catch {
        showToast("Link lagu harus berupa URL yang valid.");
        $("#song")?.focus();
        return;
      }
    }

    // Buat link dan tampilkan hasilnya.
    generatedGiftLink = createGiftLink(data);

    $("#generatedLink").value = generatedGiftLink;
    $("#linkResult").hidden = false;
    $("#copyLink").disabled = false;

    $("#linkStatus").textContent =
      "Link berhasil dibuat. Salin untuk membagikannya.";

    showToast("Link hadiah berhasil dibuat.");
  });

  // Menyalin link hadiah ke clipboard.
  $("#copyLink")?.addEventListener("click", async () => {
    if (!generatedGiftLink) {
      showToast("Buat link hadiah terlebih dahulu.");
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedGiftLink);

      showToast("Link hadiah berhasil disalin.");
    } catch {
      // Cara alternatif jika Clipboard API tidak tersedia.
      const input = $("#generatedLink");

      input?.focus();
      input?.select();

      let copied = false;

      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }

      showToast(
        copied
          ? "Link hadiah berhasil disalin."
          : "Pilih dan salin link secara manual."
      );
    }
  });

  // Menampilkan hadiah ketika link dibuka penerima.
  function showPublicGift(data) {
    $("#mainContent").hidden = true;

    publicView.hidden = false;
    publicView.classList.add("show");

    $("#publicEmoji").textContent = data.emoji || "🎁";
    $("#publicTag").textContent = "A LITTLE SURPRISE";

    $("#publicRecipient").textContent =
      `Untuk ${data.recipient || "seseorang spesial"}`;

    $("#publicTitle").textContent =
      data.headline || "A little gift for you";

    $("#publicMessage").textContent = data.message || "";

    $("#publicSign").textContent = data.sender
      ? `— with love, ${data.sender}`
      : "— with love";

    $("#publicCard").style.backgroundColor =
      data.color || "#ffd6df";

    // Tampilkan foto pada halaman hadiah.
    const image = $("#publicPhoto");

    image.hidden = !data.photo;

    if (data.photo) {
      image.src = data.photo;
    } else {
      image.removeAttribute("src");
    }

    // Tampilkan link lagu jika URL valid.
    const song = $("#publicSong");

    song.hidden = true;
    song.removeAttribute("href");

    if (data.song) {
      try {
        const songURL = new URL(data.song);

        if (["https:", "http:"].includes(songURL.protocol)) {
          song.href = songURL.href;
          song.hidden = false;
        }
      } catch {
        // Link lagu tidak valid, jadi tidak ditampilkan.
      }
    }

    document.title =
      `${data.headline || "A little gift"} — Gifty`;

    window.scrollTo(0, 0);
  }

  // Mengecek apakah URL berisi data hadiah.
  function checkGiftURL() {
    if (!window.location.hash.startsWith("#gift=")) {
      return;
    }

    try {
      const encoded =
        window.location.hash.slice("#gift=".length);

      const data = decodeData(encoded);

      // Pastikan data yang dibaca berbentuk objek.
      if (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data)
      ) {
        throw new Error("Data hadiah tidak valid");
      }

      showPublicGift(data);
    } catch (error) {
      showToast(
        "Link hadiah ini tidak bisa dibuka. Pastikan link tersalin lengkap."
      );
    }
  }

  // Kembali ke halaman utama.
  function returnHome() {
    publicView.classList.remove("show");
    publicView.hidden = true;

    $("#mainContent").hidden = false;

    document.title = "gifty — make someone's day";

    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );

    window.scrollTo(0, 0);
  }

  $("#backHome")?.addEventListener("click", returnHome);

  // Tombol untuk membaca kembali hadiah.
  $("#publicReplay")?.addEventListener("click", () => {
    $("#publicCard").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    showToast("Semoga hadiah kecil ini bikin harimu menyenangkan.");
  });

  // Jalankan fungsi awal setelah elemen halaman tersedia.
  renderTemplates();
  updatePreview();
  checkGiftURL();
})();
