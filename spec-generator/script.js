/**
 * IT-Outsourcing Landing Page Scripts
 * Калькулятор стоимости и обработка форм заявки
 */

// ==================== КОНФИГУРАЦИЯ ====================

/**
 * Конфигурация Formspree
 * Для использования Formspree:
 * 1. Зарегистрируйтесь на https://formspree.io (бесплатно)
 * 2. Создайте форму на вашей почте (например, info@devagency.pro)
 * 3. Получите ID формы (например: f12345678)
 * 4. Замените 'your-form-id' на ваш ID
 * 5. Раскомментируйте строку ниже
 */
const FORMSPREE_FORM_ID = null; // Замените на 'fXXXXXXXX' для активации Formspree

// ==================== КАЛЬКУЛЯТОР СТОИМОСТИ ====================

/**
 * Базовые стоимости услуг (в тысячах рублей)
 */
const baseCosts = {
    web: 500,      // Веб-разработка
    mobile: 700,   // Мобильная разработка
    support: 150,  // Техническая поддержка (месячная)
    cloud: 300     // Cloud решения
};

/**
 * Множители для сроков реализации
 */
const timelineMultipliers = {
    short: 0.8,    // 1-3 месяца (быстро = дороже)
    medium: 1.0,   // 3-6 месяцев (нормально)
    long: 1.3      // 6+ месяцев (долго = дешевле)
};

/**
 * Множители для сложности проекта
 */
const complexityMultipliers = {
    basic: 1.0,      // Базовая
    standard: 1.5,   // Стандартная
    complex: 2.2     // Сложная
};

/**
 * Рассчитывает стоимость проекта на основе выбранных параметров
 */
function calculateCost() {
    const service = document.getElementById('service').value;
    const timeline = document.querySelector('input[name="timeline"]:checked')?.value;
    const complexity = document.querySelector('input[name="complexity"]:checked')?.value;
    const resultDiv = document.getElementById('calculator-result');

    // Валидация
    if (!service || !timeline || !complexity) {
        alert('Пожалуйста, заполните все поля калькулятора');
        return;
    }

    // Расчёт
    const baseCost = baseCosts[service] || 0;
    const timelineMultiplier = timelineMultipliers[timeline] || 1;
    const complexityMultiplier = complexityMultipliers[complexity] || 1;

    const totalCost = Math.round(baseCost * timelineMultiplier * complexityMultiplier);

    // Вывод результата
    document.getElementById('cost-value').textContent = totalCost.toLocaleString('ru-RU');
    resultDiv.style.display = 'block';

    // Плавная прокрутка к результату
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ==================== ОБРАБОТКА ФОРМЫ ЗАЯВКИ ====================

document.addEventListener('DOMContentLoaded', function() {
    const applicationForm = document.getElementById('application-form');

    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Сбор данных формы
            const formData = {
                name: document.getElementById('form-name').value.trim(),
                email: document.getElementById('form-email').value.trim(),
                phone: document.getElementById('form-phone').value.trim(),
                service: document.getElementById('form-service').value,
                message: document.getElementById('form-description').value.trim()
            };

            // Валидация
            if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.message) {
                showFormMessage('Пожалуйста, заполните все поля формы', 'error');
                return;
            }

            // Валидация email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormMessage('Пожалуйста, введите корректный email адрес', 'error');
                return;
            }

            // Валидация телефона
            const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(formData.phone)) {
                showFormMessage('Пожалуйста, введите корректный номер телефона', 'error');
                return;
            }

            // Минимальная длина описания
            if (formData.message.length < 10) {
                showFormMessage('Пожалуйста, введите более подробное описание проекта (минимум 10 символов)', 'error');
                return;
            }

            // Отправка формы
            submitApplicationForm(formData);
        });
    }
});

/**
 * Отправляет форму заявки через Formspree или сохраняет в localStorage
 */
function submitApplicationForm(formData) {
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляю...';

    // Если Formspree ID настроен, отправляем туда
    if (FORMSPREE_FORM_ID) {
        submitToFormspree(formData, submitBtn, originalText);
    } else {
        // Иначе сохраняем в localStorage для демонстрации
        submitToLocalStorage(formData, submitBtn, originalText);
    }
}

/**
 * Отправляет форму на Formspree
 */
function submitToFormspree(formData, submitBtn, originalText) {
    const formspreeUrl = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;
    
    fetch(formspreeUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            showFormMessage('✓ Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в течение 24 часов.', 'success');
            document.getElementById('application-form').reset();
        } else {
            throw new Error('Server response was not ok');
        }
    })
    .catch(error => {
        console.error('Formspree error:', error);
        // Fallback на localStorage при ошибке Formspree
        submitToLocalStorage(formData, submitBtn, originalText);
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        setTimeout(() => {
            document.getElementById('form-message').style.display = 'none';
        }, 5000);
    });
}

/**
 * Сохраняет форму в localStorage для демонстрации
 */
function submitToLocalStorage(formData, submitBtn, originalText) {
    setTimeout(() => {
        // Сохраняем в localStorage
        const savedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
        savedApplications.push({
            ...formData,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        localStorage.setItem('applications', JSON.stringify(savedApplications));

        // Успешное сообщение
        showFormMessage('✓ Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в течение 24 часов.', 'success');

        // Очистка формы
        document.getElementById('application-form').reset();

        // Восстановление кнопки
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Очистка сообщения через 5 секунд
        setTimeout(() => {
            document.getElementById('form-message').style.display = 'none';
        }, 5000);
    }, 800);
}

/**
 * Показывает сообщение формы (успех или ошибка)
 */
function showFormMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = message;
    messageDiv.className = type;
    messageDiv.style.display = 'block';

    // Прокрутка к сообщению
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ==================== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ====================

/**
 * Инициализирует плавную прокрутку для навигации
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    
    // Информационное сообщение в консоль
    if (!FORMSPREE_FORM_ID) {
        console.info('ℹ️ Demo mode: Заявки сохраняются в localStorage. Для реальной отправки почты используйте Formspree.');
        console.info('Инструкция: https://formspree.io');
    }
});
