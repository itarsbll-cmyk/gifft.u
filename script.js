
/* =========================================
   GIFTY — JavaScript
   Template, editor, preview, dan gift link
========================================= */

(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const templateGrid = $("#templateGrid");
  const editorModal = $("#editorModal");
  const giftForm = $("#giftForm");
  const publicView = $("#publicView");
  const toast = $("#toast");

  const templates = [
    {
      id: "love",
      title: "Love Letter",
      category: "love",
      description: "A little letter for your favorite person.",
      emoji: "💌",
      color: "#ffd6df",
      headline: "A little letter for you",
      message:
        "There's something about you that makes ordinary days feel special. Thank you for being you.",
      tag: "For someone special",
    },
    {
      id: "birthday",
      title: "Birthday Cake",
      category: "birthday",
      description: "Make their special day a little sweeter.",
      emoji: "🎂",
      color: "#ffe58a",
      headline: "Happy Birthday!",
      message:
        "Today is all about you. I hope your day is filled with little things that make you smile.",
      tag: "Birthday",
    },
    {
      id: "memory",
      title: "Memory Lane",
      category: "friends",
      description: "Keep your favorite memories in one place.",
      emoji: "📸",
      color: "#dce8d5",
      headline: "Our little memories",
      message:
        "Some of my favorite moments are the simplest ones, especially when you're there.",
      tag: "Our memories",
    },
    {
      id: "mixtape",
      title: "Mixtape for You",
      category: "love",
      description: "A playlist-shaped way to say what you feel.",
      emoji: "🎧",
      color: "#e6dcf7",
      headline: "Songs that remind me of you",
      message:
        "Every song has a little piece of a memory. Here's a few that made me think of you.",
      tag: "Press play",
    },
    {
      id: "surprise",
      title: "Surprise Box",
      category: "cute",
      description: "A tiny surprise wrapped in a digital gift.",
      emoji: "🎁",
      color: "#ffd6df",
      headline: "A little surprise!",
      message:
        "You deserve something nice today. So here's a little reminder that someone is thinking of you.",
      tag: "Open me",
    },
    {
      id: "bestie",
      title: "Bestie Certificate",
      category: "friends",
      description: "Official proof that they're your favorite human.",
      emoji: "🏆",
      color: "#ffe58a",
      headline: "Certified Bestie",
      message:
        "Awarded for being an absolute icon, making ordinary days fun, and being one of my favorite people.",
      tag: "Bestie approved",
    },
    {
      id: "universe",
      title: "My Little Universe",
      category: "cute",
      description: "A tiny universe made just for them.",
      emoji: "🌙",
      color: "#e6dcf7",
      headline: "You are your own universe",
      message:
        "I hope you remember how much light you bring into the little corners of this world.",
      tag: "Made of stardust",
    },
    {
      id: "sunshine",
      title: "Pocket Sunshine",
      category: "cute",
      description: "A pocket-sized reminder for a cloudy day.",
      emoji: "☀️",
      color: "#ffe58a",
      headline: "A little sunshine for you",
      message:
        "If today feels a little heavy, here's a small reminder that brighter moments can still find you.",
      tag: "You got this",
    },
  ];

  let selectedTemplate = templates[0];
  let selectedColor = selectedTemplate.color;
  let photoData = "";
  let currentFilter = "all";

  /* =========================================
     HELPER FUNCTIONS
  ========================================= */

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[char];
    });
  }

  function encodeData(data) {
    const json = JSON.stringify(data);
    const bytes = new TextEncoder().encode(json);

    let binary = "";

    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  function decodeData(encoded) {
    const base64 = encoded
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      "="
    );

    const binary = atob(padded);
    const bytes = Uint8Array.from(
      binary,
      (char) => char.charCodeAt(0)
    );

    return JSON.parse(new TextDecoder().decode(bytes));
  }

  function getGiftData() {
    return {
      templateId: selectedTemplate.id,
      recipient: $("#recipient")?.value.trim() || "Someone special",
      sender: $("#sender")?.value.trim() || "Someone who cares",
      headline:
        $("#headline")?.value.trim() || selectedTemplate.headline,
      message:
        $("#message")?.value.trim() || selectedTemplate.message,
      song: $("#song")?.value.trim() || "",
      color: selectedColor,
      photo: photoData,
      emoji: selectedTemplate.emoji,
    };
  }

  /* =========================================
     RENDER TEMPLATE GALLERY
  ========================================= */

  function renderTemplates(filter = "all") {
    if (!templateGrid) return;

    currentFilter = filter;

    const filteredTemplates =
      filter === "all"
        ? templates
        : templates.filter(
            (template) => template.category === filter
          );

    if (filteredTemplates.length === 0) {
      templateGrid.innerHTML = `
        <div class="empty-state">
          <p>No templates found.</p>
        </div>
      `;
      return;
    }

    templateGrid.innerHTML = filteredTemplates
      .map(
        (template) => `
          <article class="template-card">
            <div
              class="template-art"
              style="background:${template.color}"
            >
              <span>${template.emoji}</span>
            </div>

            <div class="template-info">
              <h3>${escapeHTML(template.title)}</h3>

              <p>${escapeHTML(template.description)}</p>

              <div class="template-bottom">
                <span class="template-tag">
                  ${escapeHTML(template.tag)}
                </span>

                <button
                  type="button"
                  data-template="${template.id}"
                >
                  Make yours
                </button>
              </div>
            </div>
          </article>
        `
      )
      .join("");
  }

  /* =========================================
     TEMPLATE FILTERS
  ========================================= */

  $$(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".filter-btn").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      renderTemplates(button.dataset.filter || "all");
    });
  });

  /* =========================================
     OPEN AND CLOSE EDITOR
  ========================================= */

  function openEditor(templateId) {
    const template =
      templates.find((item) => item.id === templateId) ||
      templates[0];

    selectedTemplate = template;
    selectedColor = template.color;
    photoData = "";

    if (giftForm) {
      giftForm.reset();
    }

    const recipient = $("#recipient");
    const sender = $("#sender");
    const headline = $("#headline");
    const message = $("#message");
    const photo = $("#previewPhoto");

    if (recipient) recipient.value = "";
    if (sender) sender.value = "";
    if (headline) headline.value = template.headline;
    if (message) message.value = template.message;

    if (photo) {
      photo.src = "";
      photo.classList.remove("visible");
    }

    const song = $("#song");
    if (song) song.value = "";

    $$(".color-option").forEach((option) => {
      const color = option.dataset.color;

      option.classList.toggle(
        "active",
        color === selectedColor
      );
    });

    if (editorModal) {
      editorModal.classList.add("show");
      editorModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    updatePreview();
  }

  function closeEditor() {
    if (editorModal) {
      editorModal.classList.remove("show");
      editorModal.setAttribute("aria-hidden", "true");
    }

    document.body.style.overflow = "";
  }

  if (templateGrid) {
    templateGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-template]");

      if (!button) return;

      openEditor(button.dataset.template);
    });
  }

  $$("[data-close-editor]").forEach((button) => {
    button.addEventListener("click", closeEditor);
  });

  if (editorModal) {
    editorModal.addEventListener("click", (event) => {
      if (event.target === editorModal) {
        closeEditor();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeEditor();
    }
  });

  /* =========================================
     LIVE PREVIEW
  ========================================= */

  function updatePreview() {
    const data = getGiftData();

    const previewRecipient = $("#previewRecipient");
    const previewHeadline = $("#previewHeadline");
    const previewMessage = $("#previewMessage");
    const previewEmoji = $("#previewEmoji");
    const previewCard = $("#previewCard");

    if (previewRecipient) {
      previewRecipient.textContent = data.recipient;
    }

    if (previewHeadline) {
      previewHeadline.textContent = data.headline;
    }

    if (previewMessage) {
      previewMessage.textContent = data.message;
    }

    if (previewEmoji) {
      previewEmoji.textContent = data.emoji;
    }

    if (previewCard) {
      previewCard.style.backgroundColor = data.color;
    }

    const previewPhoto = $("#previewPhoto");

    if (previewPhoto) {
      if (photoData) {
        previewPhoto.src = photoData;
        previewPhoto.classList.add("visible");
      } else {
        previewPhoto.src = "";
        previewPhoto.classList.remove("visible");
      }
    }
  }

  [
    "#recipient",
    "#sender",
    "#headline",
    "#message",
    "#song",
  ].forEach((selector) => {
    const input = $(selector);

    if (input) {
      input.addEventListener("input", updatePreview);
    }
  });

  /* =========================================
     COLOR PICKER
  ========================================= */

  $$(".color-option").forEach((option) => {
    option.addEventListener("click", () => {
      selectedColor = option.dataset.color;

      $$(".color-option").forEach((item) => {
        item.classList.toggle("active", item === option);
      });

      updatePreview();
    });
  });

  /* =========================================
     PHOTO UPLOAD
  ========================================= */

  const photoInput = $("#photo");

  if (photoInput) {
    photoInput.addEventListener("change", (event) => {
      const file = event.target.files?.[0];

      if (!file) {
        photoData = "";
        updatePreview();
        return;
      }

      if (!file.type.startsWith("image/")) {
        showToast("Please choose an image file.");
        photoInput.value = "";
        return;
      }

      if (file.size > 600 * 1024) {
        showToast("Please choose a photo under 600 KB.");
        photoInput.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        photoData = reader.result;
        updatePreview();
      };

      reader.onerror = () => {
        showToast("Couldn't read that photo. Try another one.");
      };

      reader.readAsDataURL(file);
    });
  }

  /* =========================================
     PREVIEW BUTTON
  ========================================= */

  const previewOpen = $("#previewOpen");

  if (previewOpen) {
    previewOpen.addEventListener("click", () => {
      updatePreview();
      showToast("Your preview is up to date!");
    });
  }

  /* =========================================
     GENERATE GIFT LINK
  ========================================= */

  function createGiftLink(data) {
    const encoded = encodeData(data);
    const url = new URL(window.location.href);

    url.hash = `gift=${encoded}`;

    return url.href;
  }

  if (giftForm) {
    giftForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = getGiftData();

      if (!data.recipient) {
        showToast("Add a recipient first.");
        $("#recipient")?.focus();
        return;
      }

      if (!data.headline) {
        showToast("Give your gift a headline.");
        $("#headline")?.focus();
        return;
      }

      if (!data.message) {
        showToast("Write a little message first.");
        $("#message")?.focus();
        return;
      }

      const link = createGiftLink(data);

      const linkInput = $("#generatedLink");

      if (linkInput) {
        linkInput.value = link;
      }

      const linkResult = $("#linkResult");

      if (linkResult) {
        linkResult.hidden = false;
      }

      showToast("Your gift link is ready!");
    });
  }

  /* =========================================
     COPY GIFT LINK
  ========================================= */

  const copyLinkButton = $("#copyLink");

  if (copyLinkButton) {
    copyLinkButton.addEventListener("click", async () => {
      const linkInput = $("#generatedLink");
      const link = linkInput?.value;

      if (!link) {
        showToast("Create your gift link first.");
        return;
      }

      try {
        await navigator.clipboard.writeText(link);
        showToast("Gift link copied!");
      } catch (error) {
        if (linkInput) {
          linkInput.focus();
          linkInput.select();

          const copied = document.execCommand("copy");

          showToast(
            copied
              ? "Gift link copied!"
              : "Copy the selected link manually."
          );
        }
      }
    });
  }

  /* =========================================
     DISPLAY PUBLIC GIFT FROM URL
  ========================================= */

  function showPublicGift(data) {
    if (!publicView) return;

    const publicCard = $("#publicCard");
    const publicEmoji = $("#publicEmoji");
    const publicHeadline = $("#publicHeadline");
    const publicRecipient = $("#publicRecipient");
    const publicMessage = $("#publicMessage");
    const publicPhoto = $("#publicPhoto");
    const publicSender = $("#publicSender");
    const publicSong = $("#publicSong");

    if (publicEmoji) {
      publicEmoji.textContent = data.emoji || "🎁";
    }

    if (publicHeadline) {
      publicHeadline.textContent = data.headline || "A little gift";
    }

    if (publicRecipient) {
      publicRecipient.textContent =
        `For ${data.recipient || "someone special"}`;
    }

    if (publicMessage) {
      publicMessage.textContent = data.message || "";
    }

    if (publicCard) {
      publicCard.style.backgroundColor =
        data.color || "#ffd6df";
    }

    if (publicPhoto) {
      if (data.photo) {
        publicPhoto.src = data.photo;
        publicPhoto.classList.add("visible");
      } else {
        publicPhoto.src = "";
        publicPhoto.classList.remove("visible");
      }
    }

    if (publicSender) {
      publicSender.textContent = data.sender
        ? `made with love by ${data.sender}`
        : "";
    }

    if (publicSong) {
      if (data.song) {
        try {
          const songURL = new URL(data.song);

          if (
            songURL.protocol === "https:" ||
            songURL.protocol === "http:"
          ) {
            publicSong.href = songURL.href;
            publicSong.hidden = false;
          } else {
            publicSong.hidden = true;
          }
        } catch (error) {
          publicSong.hidden = true;
        }
      } else {
        publicSong.hidden = true;
      }
    }

    publicView.classList.add("show");
    document.body.style.overflow = "hidden";

    const mainContent = $("#mainContent");

    if (mainContent) {
      mainContent.hidden = true;
    }

    document.title = `${data.headline || "A little gift"} — Gifty`;
  }

  function checkGiftURL() {
    const hash = window.location.hash;

    if (!hash.startsWith("#gift=")) return;

    try {
      const encoded = hash.slice("#gift=".length);
      const data = decodeData(encoded);

      if (!data || typeof data !== "object") {
        throw new Error("Invalid gift data");
      }

      showPublicGift(data);
    } catch (error) {
      showToast("This gift link doesn't seem to work.");
    }
  }

  /* =========================================
     CLOSE PUBLIC GIFT
  ========================================= */

  const closePublic = $("#closePublic");

  if (closePublic) {
    closePublic.addEventListener("click", () => {
      publicView?.classList.remove("show");
      document.body.style.overflow = "";

      const mainContent = $("#mainContent");

      if (mainContent) {
        mainContent.hidden = false;
      }

      document.title = "Gifty — Make a little magic";
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    });
  }

  /* =========================================
     INITIALIZE
  ========================================= */

  renderTemplates();
  checkGiftURL();
})();
