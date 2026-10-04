/**
 * QR Code Studio - Main Application Logic
 * Featuring: Warm Light Theme, Logo Harmony, Interactive Mouse-Tracking Gradient, QR Gen & JPG Download
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const urlForm = document.getElementById('urlForm');
  const urlInput = document.getElementById('urlInput');
  const btnClearInput = document.getElementById('btnClearInput');
  const btnSubmit = document.getElementById('btnSubmit');
  const qrcodeBox = document.getElementById('qrcodeBox');
  const qrInteractiveWrapper = document.getElementById('qrInteractiveWrapper');
  const btnDirectDownload = document.getElementById('btnDirectDownload');
  const btnCopyUrl = document.getElementById('btnCopyUrl');
  const targetUrlText = document.getElementById('targetUrlText');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const inputFieldWrapper = document.getElementById('inputFieldWrapper');
  const cursorGlow = document.getElementById('cursorGlow');

  let qrInstance = null;
  let currentQrData = '';
  let toastTimer = null;

  // Initialize focus
  urlInput.focus();

  // --------------------------------------------------------------------------
  // 1. Interactive Dynamic Gradient on Mouse Movement
  // --------------------------------------------------------------------------
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMouseMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;
  });

  // Smooth 60fps render loop for organic gradient shifting
  function animateGradient() {
    // Linear interpolation for smooth trailing
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    const width = window.innerWidth || 1;
    const height = window.innerHeight || 1;

    const pctX = Math.max(0, Math.min(1, currentX / width));
    const pctY = Math.max(0, Math.min(1, currentY / height));

    // Dynamic Hue: shifts subtly around the logo's golden amber tone (36deg ~ 52deg)
    const dynamicHue = (36 + (pctX * 12) + (pctY * 6)).toFixed(1);

    // Dynamic Angle: shifts gently between 110deg and 160deg
    const dynamicAngle = (110 + (pctX * 35) + (pctY * 25)).toFixed(1) + 'deg';

    // Update CSS custom properties on document root
    document.documentElement.style.setProperty('--mouse-x', `${(pctX * 100).toFixed(2)}%`);
    document.documentElement.style.setProperty('--mouse-y', `${(pctY * 100).toFixed(2)}%`);
    document.documentElement.style.setProperty('--gradient-angle', dynamicAngle);
    document.documentElement.style.setProperty('--accent-hue', dynamicHue);

    // Follow cursor for glowing spotlight
    if (cursorGlow) {
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
    }

    requestAnimationFrame(animateGradient);
  }
  requestAnimationFrame(animateGradient);

  // --------------------------------------------------------------------------
  // 2. Clear Button Display Handling
  // --------------------------------------------------------------------------
  urlInput.addEventListener('input', () => {
    if (urlInput.value.trim().length > 0) {
      btnClearInput.classList.add('show');
    } else {
      btnClearInput.classList.remove('show');
    }
  });

  btnClearInput.addEventListener('click', () => {
    urlInput.value = '';
    btnClearInput.classList.remove('show');
    urlInput.focus();
  });

  // --------------------------------------------------------------------------
  // 3. Form Submission & QR Code Generation
  // --------------------------------------------------------------------------
  urlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    generateQRCode();
  });

  function normalizeUrl(input) {
    let text = input.trim();
    if (!text) return '';
    // If it looks like a domain (e.g. google.com, naver.com), prepend https://
    const domainRegex = /^[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}(\/.*)?$/;
    if (domainRegex.test(text) && !/^https?:\/\//i.test(text)) {
      text = 'https://' + text;
    }
    return text;
  }

  function generateQRCode() {
    const rawValue = urlInput.value.trim();
    if (!rawValue) {
      // Shake effect on input for user feedback
      inputFieldWrapper.style.animation = 'none';
      void inputFieldWrapper.offsetWidth; // trigger reflow
      inputFieldWrapper.style.animation = 'shake 0.4s ease';
      urlInput.focus();
      showToast('생성할 URL 또는 텍스트를 입력해주세요.', 'warning');
      return;
    }

    const processedUrl = normalizeUrl(rawValue);
    currentQrData = processedUrl;
    targetUrlText.textContent = processedUrl;
    targetUrlText.title = processedUrl;

    // Reset previous QR element
    qrcodeBox.innerHTML = '';

    // Generate high resolution QR Code using qrcodejs
    try {
      qrInstance = new QRCode(qrcodeBox, {
        text: processedUrl,
        width: 512,
        height: 512,
        colorDark: '#1e293b', // Deep slate for sharp contrast
        colorLight: '#ffffff',
        correctLevel: typeof QRCode.CorrectLevel !== 'undefined' ? QRCode.CorrectLevel.H : 2
      });

      // Smooth transition: Move input to bottom, bring QR to dead center
      document.body.classList.add('has-qr');

      showToast('QR 코드가 성공적으로 생성되었습니다! ✨');
    } catch (err) {
      console.error('QR code generation failed:', err);
      showToast('QR 코드 생성 중 오류가 발생했습니다.', 'error');
    }
  }

  // --------------------------------------------------------------------------
  // 4. High Quality JPG Download Logic
  // --------------------------------------------------------------------------
  function downloadQrAsJpg() {
    if (!currentQrData) return;

    // Find canvas or img in qrcodeBox
    const qrCanvas = qrcodeBox.querySelector('canvas');
    const qrImg = qrcodeBox.querySelector('img');

    if (!qrCanvas && (!qrImg || !qrImg.src)) {
      showToast('QR 이미지를 준비하는 중입니다. 잠시 후 다시 시도해주세요.', 'warning');
      return;
    }

    // High quality export canvas (with crisp pure white padding)
    const exportCanvas = document.createElement('canvas');
    const exportSize = 800; // 800x800 high res JPG
    const padding = 80;     // 80px white margin
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize;

    const ctx = exportCanvas.getContext('2d');

    // Fill pure white background (JPG does not support alpha channel)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exportSize, exportSize);

    function completeDownload(sourceDrawable) {
      // Draw QR centered inside canvas
      const drawSize = exportSize - (padding * 2);
      ctx.drawImage(sourceDrawable, padding, padding, drawSize, drawSize);

      // Export as JPG
      try {
        const jpgDataUrl = exportCanvas.toDataURL('image/jpeg', 0.95);
        const downloadLink = document.createElement('a');
        
        // Clean filename based on URL domain or timestamp
        let safeName = 'qrcode';
        try {
          const parsed = new URL(currentQrData);
          safeName = 'qr_' + parsed.hostname.replace(/[^a-zA-Z0-9]/g, '_');
        } catch (_) {
          safeName = 'qrcode_' + Date.now();
        }

        downloadLink.download = `${safeName}.jpg`;
        downloadLink.href = jpgDataUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Feedback animation on wrapper
        qrInteractiveWrapper.style.transform = 'scale(0.96)';
        setTimeout(() => {
          qrInteractiveWrapper.style.transform = '';
        }, 150);

        showToast('QR 코드가 JPG 파일로 저장되었습니다! 📥');
      } catch (e) {
        console.error('Download error:', e);
        showToast('JPG 다운로드 중 문제가 발생했습니다.', 'error');
      }
    }

    if (qrCanvas) {
      completeDownload(qrCanvas);
    } else if (qrImg && qrImg.src) {
      if (qrImg.complete) {
        completeDownload(qrImg);
      } else {
        qrImg.onload = () => completeDownload(qrImg);
      }
    }
  }

  // Click on QR interactive wrapper to trigger JPG download
  qrInteractiveWrapper.addEventListener('click', downloadQrAsJpg);
  qrInteractiveWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      downloadQrAsJpg();
    }
  });

  // Direct download button inside card
  btnDirectDownload.addEventListener('click', (e) => {
    e.stopPropagation();
    downloadQrAsJpg();
  });

  // --------------------------------------------------------------------------
  // 5. Copy URL Action
  // --------------------------------------------------------------------------
  btnCopyUrl.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!currentQrData) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentQrData);
      } else {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = currentQrData;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
      }
      showToast('URL 주소가 클립보드에 복사되었습니다! 📋');
    } catch (err) {
      showToast('클립보드 복사에 실패했습니다.', 'warning');
    }
  });

  // --------------------------------------------------------------------------
  // 6. Toast Notification Helper
  // --------------------------------------------------------------------------
  function showToast(message, type = 'success') {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastMessage.textContent = message;
    const toastIcon = document.getElementById('toastIcon');

    if (type === 'warning') {
      toastIcon.textContent = '!';
      toastIcon.style.background = '#f59e0b';
    } else if (type === 'error') {
      toastIcon.textContent = '✕';
      toastIcon.style.background = '#ef4444';
    } else {
      toastIcon.textContent = '✓';
      toastIcon.style.background = 'var(--success)';
    }

    toastNotification.classList.add('active');

    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 2800);
  }
});
