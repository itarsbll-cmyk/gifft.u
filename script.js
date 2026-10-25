const surpriseCards = document.querySelectorAll(".surprise-card");

const messageSection = document.getElementById("messageSection");
const messageDecoration = document.getElementById("messageDecoration");
const messageEyebrow = document.getElementById("messageEyebrow");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const messageSignature = document.getElementById("messageSignature");

const startButton = document.getElementById("startButton");
const closeMessageButton = document.getElementById("closeMessage");


/*isi secret text (bebas ganti)*/
const surpriseMessages = {
  balloon: {
    emoji: "💌",
    eyebrow: "A LITTLE MESSAGE FOR YOU",
    title: "Surprise!",
    text:
      "Hai, kamu!\n\n" +
      "Semoga hari-harimu selalu punya alasan buat bahagia. " +
      "Kalau hari ini terasa berat, ingat kalau kamu tetap " +
      "pantas mendapatkan hal-hal baik.\n\n" +
      "Anggap aja balon tadi membawa sedikit kebahagiaan buat kamu.",
    signature: "A little wish, just for you."
  },

  gift: {
    emoji: "🎁",
    eyebrow: "YOU FOUND THE SURPRISE",
    title: "A gift for you!",
    text:
      "Selamat, kamu berhasil membuka kadonya!\n\n" +
      "Hadiah kecil ini punya satu pesan: " +
      "terima kasih sudah menjadi dirimu sendiri.\n\n" +
      "Semoga ada hal menyenangkan yang menunggumu hari ini.",
    signature: "Wrapped with care, just for you."
  },

  heart: {
    emoji: "💗",
    eyebrow: "ARROW OF AFFECTION",
    title: "You are special.",
    text:
      "Panahnya berhasil mengenai hati!\n\n" +
      "Ada orang-orang yang bisa membuat hari biasa terasa " +
      "lebih menyenangkan hanya dengan kehadirannya.\n\n" +
      "Semoga kamu tahu kalau keberadaanmu juga bisa " +
      "berarti buat orang lain.",
    signature: "Sending you a little happiness."
  }
};

/*status suprise*/
const openedSurprises = new Set();

let activeCard = null;
let animationTimeout = null;


/*muncul secret text*/
function showMessage(type) {
  const message = surpriseMessages[type];

  if (!message) return;

  messageDecoration.textContent = message.emoji;
  messageEyebrow.textContent = message.eyebrow;
  messageTitle.textContent = message.title;
  messageText.textContent = message.text;
  messageSignature.textContent = message.signature;

  messageSection.hidden = false;

  // Paksa browser memperbarui animasi saat pesan dibuka lagi.
  messageSection.classList.remove("message-refresh");
  void messageSection.offsetWidth;
  messageSection.classList.add("message-refresh");

  // Gulir perlahan ke pesan yang baru muncul.
  window.setTimeout(() => {
    messageSection.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 100);
}


/*efek balon dor*/

function popBalloon(card) {
  if (card.classList.contains("popped")) return;

  card.classList.add("popped");
  card.disabled = true;

  // Tunggu balon menghilang dan partikel menyebar.
  animationTimeout = window.setTimeout(() => {
    showMessage("balloon");
    card.disabled = false;
  }, 550);
}


/*efek kado*/

function openGift(card) {
  if (card.classList.contains("gift-open")) return;

  card.classList.add("gift-open");
  card.disabled = true;

  // Tutup kado terangkat terlebih dahulu.
  animationTimeout = window.setTimeout(() => {
    showMessage("gift");
    card.disabled = false;
  }, 650);
}


/*efek panah*/

function shootHeart(card) {
  if (card.classList.contains("heart-shot")) return;

  card.classList.add("heart-shot");
  card.disabled = true;

  // Beri waktu agar panah sampai ke hati.
  animationTimeout = window.setTimeout(() => {
    showMessage("heart");
    card.disabled = false;
  }, 1000);
}


/*kartu suprise*/

surpriseCards.forEach(card => {
  card.addEventListener("click", () => {
    const type = card.dataset.surprise;

    // Cegah animasi yang sama dipicu berulang kali.
    if (openedSurprises.has(type)) {
      showMessage(type);
      return;
    }

    openedSurprises.add(type);
    activeCard = card;

    if (type === "balloon") {
      popBalloon(card);
    } else if (type === "gift") {
      openGift(card);
    } else if (type === "heart") {
      shootHeart(card);
    }
  });
});


/*tombol start*/

startButton.addEventListener("click", () => {
  document.getElementById("surprises").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});


/* tombol close*/
closeMessageButton.addEventListener("click", () => {
  messageSection.hidden = true;

  // Kembali ke kartu yang terakhir dibuka.
  if (activeCard) {
    activeCard.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
});


surpriseCards.forEach(card => {
  card.addEventListener("focus", () => {
    card.dataset.keyboardFocus = "true";
  });

  card.addEventListener("blur", () => {
    delete card.dataset.keyboardFocus;
  });
});


console.log("Gifty berhasil dimuat!");
console.log("Pilih balon, kado, atau hati untuk membuka kejutan.");
