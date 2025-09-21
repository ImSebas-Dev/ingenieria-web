document.addEventListener('DOMContentLoaded', function() {
    // Menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    const faqList = document.querySelector('.faq-list');
    
    // Función para cargar FAQs desde el CMS
    async function loadFAQs() {
        try {
            // Aquí implementarías la conexión con tu backend Django
            // Ejemplo:
            /*
            const response = await fetch('/api/faqs/');
            const faqs = await response.json();
            displayFAQs(faqs);
            */
            
            // Datos de ejemplo (eliminar en implementación real)
            const exampleFAQs = [
                {
                    id: 1,
                    question: "¿Cuál es tu experiencia en desarrollo web?",
                    answer: "Tengo más de 3 años de experiencia desarrollando aplicaciones web modernas utilizando tecnologías como HTML5, CSS3, JavaScript, React y diversos frameworks backend."
                },
                {
                    id: 2,
                    question: "¿Qué tipos de proyectos aceptas?",
                    answer: "Acepto proyectos de desarrollo web, aplicaciones móviles, consultoría tecnológica y mentoring. Me especializo en soluciones frontend y aplicaciones full-stack."
                },
                {
                    id: 3,
                    question: "¿Cuál es tu proceso de trabajo?",
                    answer: "Mi proceso incluye: 1) Consulta inicial, 2) Planificación y presupuesto, 3) Diseño y desarrollo, 4) Revisiones y feedback, 5) Implementación y lanzamiento, 6) Soporte post-lanzamiento."
                }
            ];
            
            displayFAQs(exampleFAQs);
            
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
            
            questionButton.addEventListener('click', function() {
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