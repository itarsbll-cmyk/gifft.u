document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. SELECT HTML ELEMENTS
    // =====================================

    const filterButtons = document.querySelectorAll(".filter-button");
    const templateCards = document.querySelectorAll(".template-card");
    const chooseButtons = document.querySelectorAll(".choose-template");

    const customizeModal = document.getElementById("customizeModal");
    const previewModal = document.getElementById("previewModal");

    const closeModalButton = document.getElementById("closeModal");
    const closePreviewButton = document.getElementById("closePreview");
    const editGiftButton = document.getElementById("editGift");

    const giftForm = document.getElementById("giftForm");
    const templateNameInput = document.getElementById("templateName");
    const senderNameInput = document.getElementById("senderName");
    const receiverNameInput = document.getElementById("receiverName");
    const giftMessageInput = document.getElementById("giftMessage");
    const giftPhotoInput = document.getElementById("giftPhoto");
    const giftSongInput = document.getElementById("giftSong");

    const resultReceiver = document.getElementById("resultReceiver");
    const resultSender = document.getElementById("resultSender");
    const resultMessage = document.getElementById("resultMessage");
    const resultPhoto = document.getElementById("resultPhoto");
    const resultSong = document.getElementById("resultSong");
    const resultSongLink = document.getElementById("resultSongLink");

    const downloadGiftButton = document.getElementById("downloadGift");
    const startLinks = document.querySelectorAll('a[href="#templates"]');

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    // Data hadiah yang sedang dibuat.
    let selectedTemplate = "";
    let uploadedPhotoData = "";
    let currentGift = null;

    // Menyimpan object URL supaya bisa dibersihkan.
    let photoObjectUrl = "";


    // =====================================
    // 2. MOBILE NAVIGATION
    // =====================================

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("open");

            menuToggle.textContent = isOpen ? "×" : "☰";
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("open");
                menuToggle.textContent = "☰";
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", function (event) {
            const clickedInsideMenu =
                navLinks.contains(event.target) ||
                menuToggle.contains(event.target);

            if (!clickedInsideMenu) {
                navLinks.classList.remove("open");
                menuToggle.textContent = "☰";
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }


    // =====================================
    // 3. FILTER TEMPLATE
    // =====================================

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            // Ambil kategori yang dipilih.
            const selectedCategory = button.dataset.filter;

            // Tandai tombol yang sedang aktif.
            filterButtons.forEach(function (filterButton) {
                filterButton.classList.remove("active");
            });

            button.classList.add("active");

            // Tampilkan kartu sesuai kategori.
            templateCards.forEach(function (card) {

                const cardCategory = card.dataset.category;

                if (
                    selectedCategory === "all" ||
                    cardCategory === selectedCategory
                ) {
                    card.classList.remove("is-hidden");
                } else {
                    card.classList.add("is-hidden");
                }

            });

        });

    });


    // =====================================
    // 4. OPEN CUSTOMIZE MODAL
    // =====================================

    function openCustomizeModal(template) {

        selectedTemplate = template;

        // Tampilkan nama template yang dipilih.
        templateNameInput.value = template;

        // Tampilkan modal editor.
        customizeModal.hidden = false;
        document.body.classList.add("modal-open");

        // Fokus ke input nama pengirim.
        setTimeout(function () {
            senderNameInput.focus();
        }, 100);

    }


    // Semua
