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
    const phoneRegex = /^[0-9]{10}$/;
    
    // Estados de validación - USANDO LOS IDs CORRECTOS DE DJANGO
    const fieldValidations = {
        name: false,          // id_name
        email: false,         // id_email
        phone: true,          // id_phone (Opcional)
        subject: false,       // id_subject
        message: false,       // id_message
        captcha: false
    };
    
    // Función para mostrar errores
    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        
        if (!inputElement) {
            console.error('Elemento no encontrado:', fieldId);
            return;
        }
        
        const formGroup = inputElement.closest('.form-group');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        if (formGroup) {
            formGroup.classList.add('invalid');
            formGroup.classList.remove('valid');
        }
        
        fieldValidations[fieldId.split('_')[1]] = false; // Convertir id_name a name
        updateSubmitButton();
    }
    
    // Función para limpiar errores
    function clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        
        if (!inputElement) {
            console.error('Elemento no encontrado:', fieldId);
            return;
        }
        
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
        
        fieldValidations[fieldId.split('_')[1]] = true; // Convertir id_name a name
        updateSubmitButton();
    }
    
    // Validar campo individual
    function validateField(fieldId, validationFn, errorMessage, optional = false) {
        const field = document.getElementById(fieldId);
        if (!field) return optional; // Si no existe y es opcional, es válido
        
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
        if (typeof grecaptcha === 'undefined') {
            console.warn('reCAPTCHA no está cargado');
            fieldValidations.captcha = true; // Asumir válido si no está cargado
            return true;
        }
        
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
        
        // Feedback visual del botón
        if (allValid) {
            submitBtn.classList.add('valid');
        } else {
            submitBtn.classList.remove('valid');
        }
    }
    
    // Validar formulario completo
    function validateForm() {
        let isValid = true;
        
        // Validar campos con los IDs CORRECTOS de Django
        if (!validateField('id_name', validateName, 'El nombre debe tener al menos 4 caracteres')) {
            isValid = false;
        }
        
        if (!validateField('id_email', validateEmail, 'Ingresa un correo electrónico válido')) {
            isValid = false;
        }
        
        if (!validateField('id_phone', validatePhone, 'Ingresa un número de teléfono válido (10 dígitos)', true)) {
            isValid = false;
        }
        
        if (!validateField('id_subject', validateSubject, 'Selecciona un asunto')) {
            isValid = false;
        }
        
        if (!validateField('id_message', validateMessage, 'El mensaje debe tener al menos 10 caracteres')) {
            isValid = false;
        }
        
        if (!validateCaptcha()) {
            isValid = false;
            if (formMessage) {
                formMessage.textContent = 'Por favor, completa el CAPTCHA';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            }
        }
        
        return isValid;
    }
    
    // Mostrar mensaje de éxito/error
    function showMessage(message, isSuccess = true) {
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.className = isSuccess ? 'form-message success' : 'form-message error';
        formMessage.style.display = 'block';
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    // Event listeners para validación en tiempo real
    const fieldsToValidate = [
        { id: 'id_name', validator: validateName, message: 'El nombre debe tener al menos 4 caracteres' },
        { id: 'id_email', validator: validateEmail, message: 'Ingresa un correo electrónico válido' },
        { id: 'id_phone', validator: validatePhone, message: 'Ingresa un número de teléfono válido (10 dígitos)', optional: true },
        { id: 'id_message', validator: validateMessage, message: 'El mensaje debe tener al menos 10 caracteres' }
    ];
    
    fieldsToValidate.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element) {
            console.warn('Campo no encontrado:', field.id);
            return;
        }
        
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
    const subjectSelect = document.getElementById('id_subject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', function() {
            validateField('id_subject', validateSubject, 'Selecciona un asunto');
        });
        
        // Validar inicialmente
        validateField('id_subject', validateSubject, 'Selecciona un asunto');
    } else {
        console.warn('Select de asunto no encontrado');
    }
    
    // Validación del CAPTCHA
    if (typeof grecaptcha !== 'undefined') {
        // Verificar CAPTCHA periódicamente
        setInterval(validateCaptcha, 1000);
    } else {
        console.warn('reCAPTCHA no está disponible');
        // Si no hay reCAPTCHA, considerar válido
        fieldValidations.captcha = true;
        updateSubmitButton();
    }
    
    // Event listener para el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('Formulario enviado - Validando...');
        
        if (validateForm()) {
            console.log('Formulario válido - Enviando...');
            
            // Mostrar estado de carga
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            // Enviar formulario normalmente (Django se encarga)
            this.submit();
            
        } else {
            console.log('Formulario inválido');
            showMessage('Por favor, corrige los errores en el formulario', false);
            
            // Hacer scroll al primer error
            const firstError = form.querySelector('.invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // Validar campos inicialmente
    fieldsToValidate.forEach(field => {
        validateField(field.id, field.validator, field.message, field.optional);
    });
    validateField('id_subject', validateSubject, 'Selecciona un asunto');
    
    // Inicializar estado del botón
    updateSubmitButton();
});