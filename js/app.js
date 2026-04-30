const hospitalPhone = '917498536311';

function initLottieAnimations() {
  const animations = document.querySelectorAll('.lottie-animation[data-animation]');

  animations.forEach((container) => {
    const path = container.getAttribute('data-animation');

    if (!path) return;

    try {
      const fallback = container.querySelector('.lottie-fallback');

      if (!window.lottie && customElements.get('lottie-player')) {
        const player = document.createElement('lottie-player');
        player.setAttribute('src', path);
        player.setAttribute('background', 'transparent');
        player.setAttribute('speed', '1');
        player.setAttribute('loop', '');
        player.setAttribute('autoplay', '');
        player.className = 'lottie-host';
        container.appendChild(player);
        container.classList.add('lottie-loaded');
        if (fallback) fallback.setAttribute('aria-hidden', 'true');
        return;
      }

      if (!window.lottie) return;

      const animationHost = document.createElement('div');
      animationHost.className = 'lottie-host';
      animationHost.style.width = '100%';
      animationHost.style.minHeight = '280px';
      container.appendChild(animationHost);

      const animation = window.lottie.loadAnimation({
        container: animationHost,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path
      });

      animation.addEventListener('DOMLoaded', () => {
        container.classList.add('lottie-loaded');
        if (fallback) fallback.setAttribute('aria-hidden', 'true');
      });

      animation.addEventListener('data_failed', () => {
        animationHost.remove();
        container.classList.remove('lottie-loaded');
      });
    } catch (error) {
      container.classList.remove('lottie-loaded');
    }
  });
}

const menuToggle = document.querySelector('#menuToggle');
const mainMenu = document.querySelector('#mainMenu');

if (menuToggle && mainMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = !mainMenu.classList.contains('hidden');
    mainMenu.classList.toggle('hidden');
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
  });
}

document.querySelectorAll('#mainMenu a').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768 && mainMenu) {
      mainMenu.classList.add('hidden');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

const enquiryForm = document.querySelector('#enquiryForm');
const formStatus = document.querySelector('#formStatus');

if (enquiryForm) {
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#patientName')?.value.trim();
    const phone = document.querySelector('#patientPhone')?.value.trim();
    const service = document.querySelector('#patientService')?.value;
    const time = document.querySelector('#patientTime')?.value.trim();
    const message = document.querySelector('#patientMessage')?.value.trim();

    if (!name || !phone) {
      if (formStatus) formStatus.textContent = 'कृपया रुग्णाचे नाव आणि मोबाइल नंबर भरा.';
      return;
    }

    const whatsappMessage = [
      'नवीन Patient Enquiry - Devgiri Hospital',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Service: ${service || 'General appointment'}`,
      `Preferred time: ${time || 'Not specified'}`,
      `Message: ${message || 'Not specified'}`
    ].join('\n');

    if (formStatus) formStatus.textContent = 'WhatsApp उघडत आहे. कृपया तयार झालेला enquiry message send करा.';
    window.open(`https://wa.me/${hospitalPhone}?text=${encodeURIComponent(whatsappMessage)}`, '_blank', 'noopener');
  });
}

const chatToggle = document.querySelector('#chatToggle');
const chatClose = document.querySelector('#chatClose');
const chatPanel = document.querySelector('#chatPanel');
const chatMessages = document.querySelector('#chatMessages');
const chatForm = document.querySelector('#chatForm');
const chatInput = document.querySelector('#chatInput');
let greetingSpoken = false;

const welcomeMessage = 'नमस्कार. देवगिरी हॉस्पिटलमध्ये आपले स्वागत आहे. सेवा, OPD वेळ, पत्ता किंवा अपॉइंटमेंट याबद्दल माहिती हवी असल्यास मला विचारा.';

const botAnswers = {
  hospital: 'देवगिरी मल्टिस्पेशालिटी हॉस्पिटल, अंबाजोगाई येथे आधुनिक सुविधा, अनुभवी डॉक्टर्स आणि प्रगत वैद्यकीय सेवा उपलब्ध आहेत.',
  services: 'आमच्याकडे Bronchoscopy, Sleep Study, Thoracoscopy, Allergy Testing, Asthma/COPD care, BP, Diabetes, Heart Disease care, TB treatment, PFT, X-Ray, ICU आणि 24 तास औषध सुविधा उपलब्ध आहेत.',
  timing: 'OPD वेळ सकाळी 10 ते रात्री 9 आहे. आपत्कालीन सेवा सोमवार ते रविवार 24x7 उपलब्ध आहे.',
  appointment: 'अपॉइंटमेंटसाठी 7498536311 वर फोन करा किंवा enquiry form भरा. फॉर्म भरल्यानंतर WhatsApp मध्ये तयार message उघडेल.',
  address: 'पत्ता: डॉक्टर लाटणे बिल्डिंग, छ. संभाजी राजे चौक, मीनाताई ठाकरे चौक ते गार्डन रोड, अंबाजोगाई.',
  fallback: 'मी सेवा, वेळ, पत्ता आणि अपॉइंटमेंट याबद्दल माहिती देऊ शकतो. तातडीची स्थिती असल्यास कृपया थेट हॉस्पिटलला फोन करा.'
};

function addChatMessage(text, sender = 'bot') {
  if (!chatMessages) return;
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotAnswer(input) {
  const question = input.toLowerCase();

  if (question.includes('service') || question.includes('सेवा') || question.includes('उपचार') || question.includes('तपासणी') || question.includes('test')) return botAnswers.services;
  if (question.includes('time') || question.includes('वेळ') || question.includes('timing') || question.includes('opd') || question.includes('ओपीडी')) return botAnswers.timing;
  if (question.includes('appointment') || question.includes('अपॉइंटमेंट') || question.includes('book') || question.includes('बुक')) return botAnswers.appointment;
  if (question.includes('address') || question.includes('पत्ता') || question.includes('location') || question.includes('कुठे')) return botAnswers.address;
  if (question.includes('hospital') || question.includes('हॉस्पिटल') || question.includes('about') || question.includes('माहिती')) return botAnswers.hospital;

  return botAnswers.fallback;
}

function openChat(showIntro = true) {
  if (!chatPanel || !chatToggle) return;
  const wasHidden = chatPanel.classList.contains('hidden');
  chatPanel.classList.remove('hidden');
  chatToggle.setAttribute('aria-expanded', 'true');

  if (showIntro && wasHidden && chatMessages && chatMessages.children.length === 0) {
    addChatMessage(botAnswers.hospital);
    addChatMessage('तुम्हाला सेवा, वेळ, पत्ता किंवा अपॉइंटमेंट यापैकी कोणती माहिती हवी आहे?');
  }
}

function greetVisitorAutomatically() {
  if (!chatPanel || !chatToggle || greetingSpoken) return;
  greetingSpoken = true;
  openChat(false);
  addChatMessage(welcomeMessage);
}

function closeChat() {
  if (!chatPanel || !chatToggle) return;
  chatPanel.classList.add('hidden');
  chatToggle.setAttribute('aria-expanded', 'false');
}

chatToggle?.addEventListener('click', () => {
  if (chatPanel?.classList.contains('hidden')) openChat();
  else closeChat();
});

chatClose?.addEventListener('click', closeChat);

document.querySelectorAll('.quick-question').forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.getAttribute('data-question') || 'hospital';
    addChatMessage(button.textContent.trim(), 'user');
    addChatMessage(botAnswers[key] || botAnswers.fallback);
  });
});

chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = chatInput?.value.trim();
  if (!question) return;

  addChatMessage(question, 'user');
  addChatMessage(getBotAnswer(question));
  chatInput.value = '';
});

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    initLottieAnimations();
    window.setTimeout(greetVisitorAutomatically, 900);
  });
} else {
  initLottieAnimations();
  window.setTimeout(greetVisitorAutomatically, 900);
}
