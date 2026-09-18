/* =========================================================
   AI MASTERY - Application Logic
   Form Validation, Animated Interactions, Confetti & Storage
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const goalCards = document.querySelectorAll('.goal-option-card');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalConfirmBtn = document.getElementById('modal-whatsapp-btn');

    // Web Audio Synthesizer for high-tech micro-interactions
    const playCyberSound = (type = 'click') => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(480, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'success') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(554.37, now + 0.1); // C#
                osc.frequency.setValueAtTime(659.25, now + 0.2); // E
                osc.frequency.setValueAtTime(880, now + 0.3); // A
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
            }
        } catch (e) {
            // Audio context not allowed without prior interaction or unsupported
        }
    };

    // 1. Goal Cards Interactive Selection
    goalCards.forEach((card) => {
        card.addEventListener('click', () => {
            goalCards.forEach((c) => c.classList.remove('selected'));
            card.classList.add('selected');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
            playCyberSound('click');

            // Remove error if present on goal group
            const goalGroup = document.getElementById('goal-field-group');
            if (goalGroup) {
                goalGroup.classList.remove('has-error');
                const err = goalGroup.querySelector('.field-error-msg');
                if (err) err.style.display = 'none';
            }
        });
    });

    // Remove errors on input
    ['full-name', 'phone-number', 'university'].forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                const wrapper = input.closest('.neon-glow-wrapper');
                if (wrapper) wrapper.classList.remove('has-error');
                const group = input.closest('.field-group');
                const err = group ? group.querySelector('.field-error-msg') : null;
                if (err) err.style.display = 'none';
            });
        }
    });

    // 2. Form Submission Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('full-name');
        const phoneInput = document.getElementById('phone-number');
        const univInput = document.getElementById('university');
        const selectedGoal = document.querySelector('input[name="attendance_goal"]:checked');

        let isValid = true;

        // Validate Full Name
        const nameVal = nameInput.value.trim();
        if (!nameVal || nameVal.length < 3) {
            showFieldError(nameInput, 'يرجى إدخال اسمك الكريم بشكل صحيح (3 أحرف على الأقل)');
            isValid = false;
        }

        // Validate WhatsApp Phone
        const phoneVal = phoneInput.value.trim();
        const phoneRegex = /^(\+?20|0)?1[0125][0-9]{8}$/; // Egyptian mobile format or international
        if (!phoneVal || (!phoneRegex.test(phoneVal) && phoneVal.replace(/[^0-9]/g, '').length < 9)) {
            showFieldError(phoneInput, 'يرجى إدخال رقم واتساب صحيح لتصلك تفاصيل الموعد');
            isValid = false;
        }

        // Validate University
        const univVal = univInput.value.trim();
        if (!univVal || univVal.length < 2) {
            showFieldError(univInput, 'يرجى إدخال الجامعة أو الكلية / التخصص');
            isValid = false;
        }

        // Validate Goal Selection
        if (!selectedGoal) {
            const goalGroup = document.getElementById('goal-field-group');
            if (goalGroup) {
                const err = goalGroup.querySelector('.field-error-msg');
                if (err) err.style.display = 'flex';
            }
            isValid = false;
        }

        if (!isValid) {
            // Scroll smoothly to the first error
            const firstError = document.querySelector('.has-error, .field-error-msg[style*="flex"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Prepare Submission Data
        const registrationData = {
            id: 'AIM-' + Date.now().toString(36).toUpperCase(),
            name: nameVal,
            phone: phoneVal,
            university: univVal,
            goal: selectedGoal.value,
            goalText: selectedGoal.getAttribute('data-title') || selectedGoal.value,
            registeredAt: new Date().toLocaleString('ar-EG', {
                dateStyle: 'medium',
                timeStyle: 'short'
            })
        };

        // Save to LocalStorage
        saveRegistration(registrationData);

        // Populate Success Modal
        document.getElementById('summary-name').textContent = registrationData.name;
        document.getElementById('summary-phone').textContent = registrationData.phone;
        document.getElementById('summary-university').textContent = registrationData.university;
        document.getElementById('summary-goal').textContent = registrationData.goalText;

        // Organizer WhatsApp Number (Amir Adel Eid)
        const ORGANIZER_WHATSAPP = '201098021457';

        // WhatsApp Confirmation Message Formatted for Amir
        const messageText = 
`🚀 *تسجيل جديد في سيشن AI MASTERY*

مرحباً م. أمير عادل، أود تأكيد انضمامي للسيشن وهذه بياناتي:
━━━━━━━━━━━━━━━
👤 *الاسم:* ${registrationData.name}
📱 *رقم الواتساب:* ${registrationData.phone}
🎓 *الجامعة / التخصص:* ${registrationData.university}
🎯 *الهدف من الحضور:* ${registrationData.goalText}
🕒 *توقيت التسجيل:* ${registrationData.registeredAt}
🔖 *كود الحجز:* #${registrationData.id}
━━━━━━━━━━━━━━━
✨ يرجى تأكيد حجز مقعدي وإرسال رابط وموعد السيشن. شكراً لك!`;

        const whatsappUrl = `https://wa.me/${ORGANIZER_WHATSAPP}?text=${encodeURIComponent(messageText)}`;
        modalConfirmBtn.href = whatsappUrl;

        // Launch Confetti & Sounds
        playCyberSound('success');
        triggerConfetti();

        // Open Modal
        successModal.classList.add('active');

        // Automatically open WhatsApp directly after brief moment so registration arrives immediately
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 900);

        // Reset form
        form.reset();
        goalCards.forEach((c) => c.classList.remove('selected'));
        // Re-select the first card by default for convenience
        const defaultCard = document.querySelector('.goal-option-card');
        if (defaultCard) {
            defaultCard.classList.add('selected');
            const radio = defaultCard.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        }
    });

    function showFieldError(inputEl, message) {
        const wrapper = inputEl.closest('.neon-glow-wrapper');
        if (wrapper) wrapper.classList.add('has-error');
        const group = inputEl.closest('.field-group');
        if (group) {
            const errorMsg = group.querySelector('.field-error-msg');
            if (errorMsg) {
                errorMsg.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
                errorMsg.style.display = 'flex';
            }
        }
    }

    // Modal Close
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }

    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });

    // 3. Confetti Celebration Effect
    function triggerConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const count = 120;
        const pieces = [];
        const colors = ['#00f2fe', '#4facfe', '#9b51e0', '#ff007f', '#ffd700', '#ffffff'];

        for (let i = 0; i < count; i++) {
            pieces.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.7) * 18,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 8,
                opacity: 1
            });
        }

        let animationFrame;
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let activePieces = 0;

            pieces.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.4; // gravity
                p.vx *= 0.98;
                p.rotation += p.rotSpeed;
                p.opacity -= 0.009;

                if (p.opacity > 0) {
                    activePieces++;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = Math.max(p.opacity, 0);
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
                    ctx.restore();
                }
            });

            if (activePieces > 0) {
                animationFrame = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animationFrame);
            }
        }
        render();
    }

    // 4. LocalStorage & Admin Management
    const STORAGE_KEY = 'ai_mastery_registrations';

    function getRegistrations() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveRegistration(item) {
        const list = getRegistrations();
        list.unshift(item);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
});
