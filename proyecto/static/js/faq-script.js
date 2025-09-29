document.addEventListener('DOMContentLoaded', function () {
    // Menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    const faqList = document.querySelector('.faq-list');

    // Función para cargar FAQs desde el CMS
    async function loadFAQs() {
        try {
            const response = await fetch('/faq/api/faqs');
            const faqs = await response.json();
            displayFAQs(faqs);
        } catch (error) {
            faqList.innerHTML = '<div class="faq-error">Error al cargar las preguntas frecuentes. Por favor, intenta nuevamente más tarde.</div>';
        }
    }

    // Función para mostrar FAQs en la página
    function displayFAQs(faqs) {
        if (!faqs || faqs.length === 0) {
            faqList.innerHTML = '<div class="faq-empty">No hay preguntas frecuentes disponibles en este momento.</div>';
            return;
        }

        faqList.innerHTML = '';

        faqs.forEach(faq => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';

            const questionButton = document.createElement('button');
            questionButton.className = 'faq-question';
            questionButton.textContent = faq.question;

            const answerDiv = document.createElement('div');
            answerDiv.className = 'faq-answer';
            answerDiv.innerHTML = `<p>${faq.answer}</p>`;

            questionButton.addEventListener('click', function () {
                // Cerrar otras FAQs abiertas
                document.querySelectorAll('.faq-question.active').forEach(activeBtn => {
                    if (activeBtn !== questionButton) {
                        activeBtn.classList.remove('active');
                        activeBtn.nextElementSibling.classList.remove('active');
                    }
                });

                // Alternar FAQ actual
                questionButton.classList.toggle('active');
                answerDiv.classList.toggle('active');
            });

            faqItem.appendChild(questionButton);
            faqItem.appendChild(answerDiv);
            faqList.appendChild(faqItem);
        });
    }

    // Cargar FAQs al iniciar la página
    loadFAQs();
});