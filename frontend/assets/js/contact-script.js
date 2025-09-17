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
    
    // Validación del formulario
    const form = document.getElementById('contactForm');
    
    if (!form) {
        console.error('Formulario no encontrado');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    // Expresiones regulares para validación
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    
    // Estados de validación
    const fieldValidations = {
        name: false,
        email: false,
        phone: true, // Opcional
        subject: false,
        message: false,
        captcha: false
    };
    
    // Función para mostrar errores
    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        const formGroup = inputElement.closest('.form-group');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        if (formGroup) {
            formGroup.classList.add('invalid');
            formGroup.classList.remove('valid');
        }
        
        fieldValidations[fieldId] = false;
        updateSubmitButton();
    }
    
    // Función para limpiar errores
    function clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        const formGroup = inputElement.closest('.form-group');
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        if (formGroup) {
            formGroup.classList.remove('invalid');
            formGroup.classList.add('valid');
            
            // Remover la clase valid después de 2 segundos
            setTimeout(() => {
                formGroup.classList.remove('valid');
            }, 2000);
        }
        
        fieldValidations[fieldId] = true;
        updateSubmitButton();
    }
    
    // Validar campo individual
    function validateField(fieldId, validationFn, errorMessage, optional = false) {
        const field = document.getElementById(fieldId);
        if (!field) return false;
        
        const value = field.value.trim();
        
        // Si es opcional y está vacío, es válido
        if (optional && value === '') {
            clearError(fieldId);
            return true;
        }
        
        if (!validationFn(value)) {
            showError(fieldId, errorMessage);
            return false;
        }
        
        clearError(fieldId);
        return true;
    }
    
    // Validaciones específicas
    function validateName(name) {
        return name.length >= 4;
    }
    
    function validateEmail(email) {
        return emailRegex.test(email);
    }
    
    function validatePhone(phone) {
        return phone === '' || phoneRegex.test(phone);
    }
    
    function validateSubject(subject) {
        return subject !== '';
    }
    
    function validateMessage(message) {
        return message.length >= 10;
    }
    
    // Validar CAPTCHA
    function validateCaptcha() {
        const response = grecaptcha.getResponse();
        fieldValidations.captcha = response.length > 0;
        updateSubmitButton();
        return fieldValidations.captcha;
    }
    
    // Actualizar estado del botón de envío
    function updateSubmitButton() {
        if (!submitBtn) return;
        
        const allValid = Object.values(fieldValidations).every(status => status === true);
        submitBtn.disabled = !allValid;
    }
    
    // Validar formulario completo
    function validateForm() {
        let isValid = true;
        
        if (!validateField('name', validateName, 'El nombre debe tener al menos 4 caracteres')) {
            isValid = false;
        }
        
        if (!validateField('email', validateEmail, 'Ingresa un correo electrónico válido')) {
            isValid = false;
        }
        
        if (!validateField('phone', validatePhone, 'Ingresa un número de teléfono válido', true)) {
            isValid = false;
        }
        
        if (!validateField('subject', validateSubject, 'Selecciona un asunto')) {
            isValid = false;
        }
        
        if (!validateField('message', validateMessage, 'El mensaje debe tener al menos 10 caracteres')) {
            isValid = false;
        }
        
        if (!validateCaptcha()) {
            isValid = false;
            if (formMessage) {
                formMessage.textContent = 'Por favor, completa el CAPTCHA';
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
            }
        }
        
        return isValid;
    }
    
    // Mostrar mensaje de éxito/error
    function showMessage(message, isSuccess = true) {
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.classList.remove(isSuccess ? 'error' : 'success');
        formMessage.classList.add(isSuccess ? 'success' : 'error');
        formMessage.style.display = 'block';
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    // Enviar formulario
    async function submitForm(formData) {
        if (!submitBtn) return;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        try {
            // Simulación de envío exitoso (reemplazar con tu API real)
            setTimeout(() => {
                showMessage('¡Mensaje enviado con éxito! Te contactaré pronto.', true);
                
                if (form) form.reset();
                
                // Resetear CAPTCHA
                grecaptcha.reset();
                fieldValidations.captcha = false;
                
                // Resetear estados de validación
                Object.keys(fieldValidations).forEach(key => {
                    if (key !== 'captcha') {
                        const element = document.getElementById(key);
                        if (element) {
                            const formGroup = element.closest('.form-group');
                            if (formGroup) {
                                formGroup.classList.remove('invalid', 'valid');
                            }
                        }
                    }
                    fieldValidations[key] = key === 'phone' || key === 'captcha' ? false : true;
                });
                
                // Ocultar mensajes de error
                document.querySelectorAll('.error-message').forEach(el => {
                    el.textContent = '';
                    el.style.display = 'none';
                });
                
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar mensaje';
                }
                
                updateSubmitButton();
            }, 1500);
            
        } catch (error) {
            showMessage('Error al enviar el mensaje. Por favor, intenta nuevamente.', false);
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar mensaje';
            }
        }
    }
    
    // Event listeners para validación en tiempo real
    const fieldsToValidate = [
        { id: 'name', validator: validateName, message: 'El nombre debe tener al menos 4 caracteres' },
        { id: 'email', validator: validateEmail, message: 'Ingresa un correo electrónico válido' },
        { id: 'phone', validator: validatePhone, message: 'Ingresa un número de teléfono válido', optional: true },
        { id: 'message', validator: validateMessage, message: 'El mensaje debe tener al menos 10 caracteres' }
    ];
    
    fieldsToValidate.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element) return;
        
        // Validar mientras se escribe (con delay para no ser demasiado agresivo)
        let timeout;
        element.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                validateField(field.id, field.validator, field.message, field.optional);
            }, 500);
        });
        
        // Validar al perder el foco
        element.addEventListener('blur', function() {
            validateField(field.id, field.validator, field.message, field.optional);
        });
    });
    
    // Validación específica para el select
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', function() {
            validateField('subject', validateSubject, 'Selecciona un asunto');
        });
    }
    
    // Validación del CAPTCHA
    if (typeof grecaptcha !== 'undefined') {
        // Verificar CAPTCAH periódicamente
        setInterval(validateCaptcha, 1000);
    }
    
    // Event listener para el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value.trim(),
                'g-recaptcha-response': grecaptcha.getResponse()
            };
            
            submitForm(formData);
        } else {
            showMessage('Por favor, corrige los errores en el formulario', false);
        }
    });
    
    // Inicializar estado del botón
    updateSubmitButton();
});