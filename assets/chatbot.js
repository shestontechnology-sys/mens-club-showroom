/**
 * MEN'S CLUB ATELIER - AI STYLIST & CHATBOT ENGINE
 * Intelligent Conversational Assistant for Fashion, Bespoke Tailoring & Appointments
 */

(function () {
  'use strict';

  // Knowledge Base
  const KB = {
    brands: [
      "Manyavar (Royal Kurtas & Sherwanis)",
      "Nalli (Pure Kanchipuram Silks & Dhotis)",
      "Levi's (Original Denim & Jackets)",
      "Zara Man (Luxury Casuals & Shirts)",
      "H&M (Minimalist Urban Wear)",
      "Puma (Athleisure & Sneakers)"
    ],
    showrooms: [
      {
        city: "Thiruvallur",
        address: "J.N. Road (Opposite Clock Tower), Thiruvallur, Tamil Nadu",
        timings: "10:30 AM – 9:30 PM (Open 7 Days)",
        phone: "+91 98401 23456"
      },
      {
        city: "Chennai (Anna Nagar)",
        address: "2nd Avenue, Near Roundtana, Anna Nagar West, Chennai",
        timings: "10:30 AM – 9:30 PM (Open 7 Days)",
        phone: "+91 98401 23457"
      }
    ],
    tailoring: "Our Master Tailors offer Bespoke Made-to-Measure suits, handcrafted sherwanis, and Express 2-Hour Alterations on all garments purchased in-store.",
    collections: [
      {
        id: "sherwani",
        title: "Royal Zari Embroidered Sherwani",
        category: "Festive & Wedding",
        price: "₹18,500",
        image: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80",
        desc: "Handcrafted raw silk with antique gold zardozi embroidery. Perfect for grooms & gala receptions."
      },
      {
        id: "suit",
        title: "Bespoke Midnight Navy Tuxedo",
        category: "Evening Suiting",
        price: "₹14,200",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
        desc: "Super 140s Italian wool with satin peak lapel and customized inner monogram."
      },
      {
        id: "kurta",
        title: "Manyavar Pure Silk Festive Kurta Set",
        category: "Ethnic Classics",
        price: "₹6,800",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
        desc: "Jacquard weave silk paired with churidar in vibrant emerald and sunset amber tones."
      },
      {
        id: "denim",
        title: "Levi's 511 Slim Fit Selvedge Denim",
        category: "Modern Casuals",
        price: "₹4,499",
        image: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80",
        desc: "Authentic stretch selvedge denim, tailored cut for all-day comfort."
      }
    ]
  };

  // Chatbot State
  let chatHistory = [];
  const STORAGE_KEY = 'mensclub_chat_history_v1';

  // DOM Elements
  let container, triggerBtn, windowEl, messagesEl, inputField, sendBtn, suggestionsEl;

  // Initialize Chatbot
  function init() {
    createDOM();
    loadHistory();
    attachEvents();
  }

  // Create Chatbot DOM Markup
  function createDOM() {
    // Launcher
    const launcherMarkup = `
      <div class="chatbot-launcher-container" id="chatbot-launcher">
        <div class="chatbot-launcher-badge" id="chatbot-badge">
          <span class="status-dot"></span>
          <span>Need Style Advice? <strong>Chat with AI</strong></span>
        </div>
        <button class="chatbot-trigger-btn" id="chatbot-toggle-btn" aria-label="Open AI Fashion Stylist">
          <svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <path d="M8 10h.01"></path>
            <path d="M12 10h.01"></path>
            <path d="M16 10h.01"></path>
          </svg>
          <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Chatbot Window -->
      <div class="chatbot-window" id="chatbot-window" role="dialog" aria-label="Men's Club AI Stylist">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-header-brand">
            <div class="chatbot-avatar-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span class="chatbot-online-indicator"></span>
            </div>
            <div class="chatbot-header-info">
              <div class="chatbot-header-title">
                <span>Atelier AI Stylist</span>
                <span class="chatbot-header-badge">AI 2.0</span>
              </div>
              <span class="chatbot-header-status">Men's Club Fashion Concierge</span>
            </div>
          </div>
          <div class="chatbot-header-actions">
            <button class="chatbot-ctrl-btn" id="chatbot-clear-btn" title="Clear Conversation" aria-label="Clear chat">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
            <button class="chatbot-ctrl-btn" id="chatbot-minimize-btn" title="Minimize" aria-label="Close chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <!-- Messages Content -->
        <div class="chatbot-messages" id="chatbot-messages"></div>

        <!-- Quick Suggestions -->
        <div class="chatbot-suggestions-wrapper" id="chatbot-suggestions">
          <button class="chatbot-chip" data-query="Wedding & Sherwani Options">👔 Wedding Kurtas</button>
          <button class="chatbot-chip" data-query="Bespoke Tailoring and Fitting">🧵 Custom Tailoring</button>
          <button class="chatbot-chip" data-query="Showroom Address & Hours">📍 Store Locations</button>
          <button class="chatbot-chip" data-query="Certified Brands Available">✨ Brands in Stock</button>
          <button class="chatbot-chip" data-query="Book a Fitting Appointment">📅 Book Fitting</button>
          <button class="chatbot-chip" data-query="Connect to WhatsApp Stylist">💬 WhatsApp Stylist</button>
        </div>

        <!-- Input Bar -->
        <div class="chatbot-input-area">
          <form class="chatbot-input-form" id="chatbot-form">
            <input type="text" id="chatbot-input" class="chatbot-input-field" placeholder="Ask about couture, sizing, wedding suits..." autocomplete="off">
            <button type="submit" class="chatbot-send-btn" id="chatbot-send-btn" aria-label="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
          <div class="chatbot-footer-note">
            Powered by Men's Club Atelier • <a href="tel:+919840123456">Direct Call</a> • <a href="https://wa.me/919840123456" target="_blank" rel="noopener">WhatsApp Support</a>
          </div>
        </div>
      </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = launcherMarkup;
    document.body.appendChild(div);

    // Cache elements
    container = document.getElementById('chatbot-launcher');
    triggerBtn = document.getElementById('chatbot-toggle-btn');
    windowEl = document.getElementById('chatbot-window');
    messagesEl = document.getElementById('chatbot-messages');
    inputField = document.getElementById('chatbot-input');
    sendBtn = document.getElementById('chatbot-send-btn');
    suggestionsEl = document.getElementById('chatbot-suggestions');
  }

  // Load or Initialize Chat History
  function loadHistory() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        chatHistory = JSON.parse(stored);
      }
    } catch (e) {
      chatHistory = [];
    }

    if (chatHistory.length === 0) {
      // Add initial greeting
      const greeting = {
        sender: 'bot',
        text: `Vanakkam & Welcome to **Men's Club Showroom & Atelier**! 🌟\n\nI am your personal **AI Fashion Stylist**. How may I assist you today?`,
        cards: [KB.collections[0], KB.collections[1]],
        time: getCurrentTime()
      };
      chatHistory.push(greeting);
      saveHistory();
    }

    renderAllMessages();
  }

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
    } catch (e) {}
  }

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Render Messages
  function renderAllMessages() {
    messagesEl.innerHTML = '';
    chatHistory.forEach(msg => {
      appendMessageToDOM(msg, false);
    });
    scrollToBottom();
  }

  function appendMessageToDOM(msg, animate = true) {
    const row = document.createElement('div');
    row.className = `chatbot-msg-row ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`;

    let formattedText = msg.text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    let cardsHtml = '';
    if (msg.cards && msg.cards.length > 0) {
      cardsHtml = msg.cards.map(c => `
        <div class="chatbot-card-recommendation">
          <img src="${c.image}" alt="${c.title}" class="chatbot-card-img" loading="lazy">
          <div class="chatbot-card-content">
            <div class="chatbot-card-title">${c.title}</div>
            <div class="chatbot-card-desc">${c.desc}</div>
            <div class="chatbot-card-footer">
              <span class="chatbot-card-price">${c.price}</span>
              <button class="chatbot-card-btn" onclick="window.MensClubChatbot.openBooking('${c.title}')">Try On in Showroom</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    let actionsHtml = '';
    if (msg.actionBtn) {
      actionsHtml = `
        <div style="margin-top: 10px;">
          <button class="btn btn-primary btn-sm" style="font-size: 0.78rem; padding: 6px 14px; background: #84CC16; color: #000; font-weight:700; border-radius: 8px; border:none; cursor:pointer;" onclick="${msg.actionBtn.action}">
            ${msg.actionBtn.label}
          </button>
        </div>
      `;
    }

    row.innerHTML = `
      <div class="chatbot-msg-bubble">
        <div>${formattedText}</div>
        ${cardsHtml}
        ${actionsHtml}
        <div class="chatbot-msg-time">${msg.time || getCurrentTime()}</div>
      </div>
    `;

    messagesEl.appendChild(row);
    if (animate) {
      scrollToBottom();
    }
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTypingIndicator() {
    const typingRow = document.createElement('div');
    typingRow.className = 'chatbot-msg-row bot-msg';
    typingRow.id = 'chatbot-typing-row';
    typingRow.innerHTML = `
      <div class="chatbot-typing-indicator">
        <span class="chatbot-typing-dot"></span>
        <span class="chatbot-typing-dot"></span>
        <span class="chatbot-typing-dot"></span>
      </div>
    `;
    messagesEl.appendChild(typingRow);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById('chatbot-typing-row');
    if (el) el.remove();
  }

  // Handle User Input & AI NLP Logic
  function handleSendMessage(text) {
    const query = text.trim();
    if (!query) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: query,
      time: getCurrentTime()
    };
    chatHistory.push(userMsg);
    appendMessageToDOM(userMsg, true);
    saveHistory();

    inputField.value = '';
    showTypingIndicator();

    // Generate intelligent AI response with slight delay for realistic feel
    setTimeout(() => {
      removeTypingIndicator();
      const botResponse = generateAIResponse(query);
      chatHistory.push(botResponse);
      appendMessageToDOM(botResponse, true);
      saveHistory();
    }, 700);
  }

  // AI Response Generator
  function generateAIResponse(query) {
    const q = query.toLowerCase();

    // 1. Wedding / Sherwani / Groom
    if (q.includes('wedding') || q.includes('groom') || q.includes('sherwani') || q.includes('marriage') || q.includes('reception')) {
      return {
        sender: 'bot',
        text: `For grand wedding occasions, we specialize in **Royal Zardozi Sherwanis**, **Varanasi Brocade Kurtas**, and **Custom Indo-Western Tuxedos** crafted from pure mulberry silks. \n\nWould you like to book a private VIP bridal/groom trial session in our Thiruvallur or Chennai salon?`,
        cards: [KB.collections[0], KB.collections[2]],
        actionBtn: {
          label: "📅 Book VIP Groom Fitting",
          action: "window.MensClubChatbot.openBooking('Wedding Sherwani & Groom Trial')"
        },
        time: getCurrentTime()
      };
    }

    // 2. Custom Tailoring / Bespoke / Sizing / Fitting
    if (q.includes('tailor') || q.includes('stitch') || q.includes('custom') || q.includes('bespoke') || q.includes('alter') || q.includes('size')) {
      return {
        sender: 'bot',
        text: `✨ **Bespoke Tailoring & Express Alteration Service:**\n\n• **Master Tailoring**: Custom measured three-piece suits, bandhgalas, and bespoke shirts within 3–5 working days.\n• **2-Hour Express Alterations**: Complimentary length adjustments & waist tapering on any ready-to-wear piece purchased in our store.\n• **Fabric Selection**: Super 120s–160s Italian wool, Egyptian Giza cotton, and Kanchipuram raw silk.`,
        actionBtn: {
          label: "Book Measurement Appointment",
          action: "window.MensClubChatbot.openBooking('Master Tailoring & Measurements')"
        },
        time: getCurrentTime()
      };
    }

    // 3. Location / Address / Timings / Store info
    if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('time') || q.includes('open') || q.includes('chennai') || q.includes('thiruvallur')) {
      return {
        sender: 'bot',
        text: `📍 **Men's Club Flagship Showrooms:**\n\n🏛️ **Thiruvallur Flagship:**\nJ.N. Road (Opposite Clock Tower), Thiruvallur.\n🕒 10:30 AM – 9:30 PM (Daily)\n📞 +91 98401 23456\n\n🏢 **Chennai Atelier:**\n2nd Avenue, Near Roundtana, Anna Nagar West, Chennai.\n🕒 10:30 AM – 9:30 PM (Daily)\n📞 +91 98401 23457\n\nValet parking & private fitting lounges available at both locations.`,
        actionBtn: {
          label: "🗺️ Get Google Maps Directions",
          action: "window.open('https://maps.google.com/?q=Thiruvallur+Chennai', '_blank')"
        },
        time: getCurrentTime()
      };
    }

    // 4. Brands
    if (q.includes('brand') || q.includes('manyavar') || q.includes('nalli') || q.includes('levi') || q.includes('zara') || q.includes('puma') || q.includes('h&m')) {
      return {
        sender: 'bot',
        text: `We are authorized retailers and curators for world-class menswear & couture:\n\n👑 **Ethnic & Couture**: Manyavar, Nalli Silks, Raymond, Mohanlal Sons\n👔 **Contemporary & Shirts**: Zara Man, H&M, Linen Club, Louis Philippe\n👖 **Denim & Casuals**: Levi's, Rare Rabbit, Puma, Tommy Hilfiger\n\nAll collections come with 100% authenticity guarantee.`,
        cards: [KB.collections[2], KB.collections[3]],
        time: getCurrentTime()
      };
    }

    // 5. Booking / Appointment
    if (q.includes('book') || q.includes('appointment') || q.includes('reserve') || q.includes('slot') || q.includes('schedule')) {
      return {
        sender: 'bot',
        text: `I can immediately reserve a priority fitting suite for you at our salon! Click below to choose your preferred time slot and store:`,
        actionBtn: {
          label: "Reserve Salon Suite Now",
          action: "window.MensClubChatbot.openBooking()"
        },
        time: getCurrentTime()
      };
    }

    // 6. WhatsApp / Contact / Human Stylist
    if (q.includes('whatsapp') || q.includes('chat') || q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('human') || q.includes('person')) {
      return {
        sender: 'bot',
        text: `You can connect instantly with our Senior Showroom Manager & Head Stylist on WhatsApp for real-time video consults and catalog photos:`,
        actionBtn: {
          label: "💬 Connect on WhatsApp (+91 98401 23456)",
          action: "window.open('https://wa.me/919840123456?text=Hi%20Mens%20Club%2C%20I%20would%20like%20to%20inquire%20about%20your%20couture%20collection', '_blank')"
        },
        time: getCurrentTime()
      };
    }

    // 7. Pricing / Discounts / Offers
    if (q.includes('price') || q.includes('cost') || q.includes('discount') || q.includes('offer') || q.includes('rate')) {
      return {
        sender: 'bot',
        text: `💎 **Showroom Pricing Guide:**\n\n• **Formal Shirts & Trousers**: Starting from ₹1,899\n• **Premium Denim (Levi's / Rare Rabbit)**: ₹3,499 – ₹6,999\n• **Silk Kurtas & Dhotis (Manyavar / Nalli)**: ₹4,500 – ₹15,000\n• **Handcrafted Wedding Sherwanis**: ₹12,000 – ₹45,000\n• **Bespoke Three-Piece Suits**: ₹11,500 onwards\n\n🎁 *Ask in-store for festive season wedding bundle concessions!*`,
        time: getCurrentTime()
      };
    }

    // 8. Saree / Women's Couture / Family
    if (q.includes('saree') || q.includes('silk') || q.includes('women') || q.includes('family')) {
      return {
        sender: 'bot',
        text: `Along with our premier menswear atelier, we curate pure **Kanchipuram Silk Sarees & Bridal Trousseaus** in partnership with certified artisan weavers. Visit our 1st-floor Heritage Silk Gallery in Thiruvallur.`,
        cards: [KB.collections[2]],
        time: getCurrentTime()
      };
    }

    // Default Fallback
    return {
      sender: 'bot',
      text: `Thank you for your interest in **Men's Club**. I can assist you with:\n\n1. 👔 **Wedding & Groom Collections**\n2. 🧵 **Bespoke Tailoring & Alterations**\n3. 📍 **Store Locations & Timings**\n4. 📅 **Booking a Fitting Suite**\n5. 💬 **Speaking with a Stylist on WhatsApp**\n\nWhat would you like to explore?`,
      time: getCurrentTime()
    };
  }

  // Attach Event Listeners
  function attachEvents() {
    // Toggle Window
    triggerBtn.addEventListener('click', toggleChat);
    const badge = document.getElementById('chatbot-badge');
    if (badge) {
      badge.addEventListener('click', openChat);
    }

    // Close / Minimize
    const minBtn = document.getElementById('chatbot-minimize-btn');
    if (minBtn) minBtn.addEventListener('click', closeChat);

    // Clear Chat
    const clearBtn = document.getElementById('chatbot-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear chat history?')) {
          localStorage.removeItem(STORAGE_KEY);
          chatHistory = [];
          loadHistory();
        }
      });
    }

    // Form Submit
    const form = document.getElementById('chatbot-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendMessage(inputField.value);
    });

    // Chips Click
    suggestionsEl.addEventListener('click', (e) => {
      const chip = e.target.closest('.chatbot-chip');
      if (chip) {
        const query = chip.dataset.query || chip.innerText;
        handleSendMessage(query);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (windowEl.classList.contains('is-open')) {
          closeChat();
        }
        document.querySelectorAll('.modal-backdrop').forEach(modal => {
          modal.style.display = 'none';
          modal.style.opacity = '0';
          modal.style.visibility = 'hidden';
        });
      }
    });

    // Handle Page Modal triggers (Book Fitting buttons across the page)
    document.querySelectorAll('[data-trigger-booking], .btn-nav-reserve, .btn-hero-booking').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.MensClubChatbot.openBooking();
      });
    });

    // Handle Booking Modal close
    const bookingClose = document.getElementById('booking-close');
    const bookingModal = document.getElementById('booking-modal');
    if (bookingClose && bookingModal) {
      bookingClose.addEventListener('click', () => {
        bookingModal.style.display = 'none';
        bookingModal.style.opacity = '0';
        bookingModal.style.visibility = 'hidden';
      });
      bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
          bookingModal.style.display = 'none';
          bookingModal.style.opacity = '0';
          bookingModal.style.visibility = 'hidden';
        }
      });
    }

    // Handle Appointment Form submit with live feedback
    const apptForm = document.getElementById('appointment-form');
    if (apptForm) {
      apptForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('booking-name')?.value || 'Valued Patron';
        const date = document.getElementById('booking-date')?.value || 'Selected Date';
        const time = document.getElementById('booking-time')?.value || 'Fitting Slot';
        const location = document.getElementById('booking-location')?.value || 'Showroom';
        
        if (bookingModal) {
          bookingModal.style.display = 'none';
          bookingModal.style.opacity = '0';
          bookingModal.style.visibility = 'hidden';
        }

        // Show toast or open chatbot confirmation
        openChat();
        const confirmMsg = {
          sender: 'bot',
          text: `🎉 **Fitting Suite Confirmed!**\n\nThank you **${name}**. Your VIP appointment at **${location}** on **${date} (${time})** has been reserved.\n\nOur Senior Stylist will be ready for you. See you soon! ✨`,
          time: getCurrentTime()
        };
        chatHistory.push(confirmMsg);
        appendMessageToDOM(confirmMsg, true);
        saveHistory();
      });
    }

    // Handle Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileClose = document.querySelector('.mobile-nav-close');
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        mobileDrawer.classList.toggle('is-open');
        mobileDrawer.style.transform = mobileDrawer.classList.contains('is-open') ? 'translateX(0)' : 'translateX(100%)';
      });
      if (mobileClose) {
        mobileClose.addEventListener('click', () => {
          mobileDrawer.classList.remove('is-open');
          mobileDrawer.style.transform = 'translateX(100%)';
        });
      }
    }

    // Gracefully fade out preloader if still active
    setTimeout(() => {
      const preloader = document.querySelector('.preloader');
      if (preloader) {
        preloader.style.transition = 'opacity 0.6s ease';
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600);
      }
    }, 700);
  }

  function toggleChat() {
    if (windowEl.classList.contains('is-open')) {
      closeChat();
    } else {
      openChat();
    }
  }

  function openChat() {
    windowEl.classList.add('is-open');
    container.classList.add('is-active');
    setTimeout(() => {
      inputField.focus();
      scrollToBottom();
    }, 150);
  }

  function closeChat() {
    windowEl.classList.remove('is-open');
    container.classList.remove('is-active');
  }

  // Global Chatbot API for external triggers
  window.MensClubChatbot = {
    open: openChat,
    close: closeChat,
    ask: (q) => {
      openChat();
      handleSendMessage(q);
    },
    openBooking: (pieceName = '') => {
      closeChat();
      const bookingModal = document.getElementById('booking-modal');
      if (bookingModal) {
        bookingModal.classList.add('is-open');
        bookingModal.style.display = 'flex';
        bookingModal.style.opacity = '1';
        bookingModal.style.visibility = 'visible';
        
        if (pieceName) {
          const pieceInput = document.getElementById('booking-piece');
          if (pieceInput) pieceInput.value = pieceName;
        }

        // Focus first input
        const nameInput = document.getElementById('booking-name');
        if (nameInput) nameInput.focus();
      } else {
        window.location.hash = '#booking-modal';
      }
    }
  };

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
