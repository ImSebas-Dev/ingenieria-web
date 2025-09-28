// static/js/contact-script.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Script de contacto cargado');
    
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
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }
    
    // Expresiones regulares para validación (coinciden con forms.py)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/; // 10 dígitos exactos
    
    // Estados de validación
    const fieldStates = {
        nombre: { isValid: false, isOptional: false },
        email: { isValid: false, isOptional: false },
        phone: { isValid: true, isOptional: true }, // Teléfono es opcional
        asunto: { isValid: false, isOptional: false },
        mensaje: { isValid: false, isOptional: false },
        captcha: { isValid: false, isOptional: false }
    };
    
    // Elementos de los campos (usando los IDs de Django)
    const fields = {
        nombre: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        asunto: document.getElementById('subject'),
        mensaje: document.getElementById('message')
    };
    
    // Verificar que todos los campos existan
    Object.entries(fields).forEach(([key, field]) => {
        if (!field) {
            console.error(`❌ Campo ${key} no encontrado`);
        }
    });
    
    // Función para mostrar errores
    function showError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const fieldElement = fields[fieldName];
        
        if (errorElement && fieldElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            fieldElement.classList.add('invalid');
            fieldElement.classList.remove('valid');
        }
        
        fieldStates[fieldName].isValid = false;
        updateSubmitButton();
    }
    
    // Función para limpiar errores
    function clearError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const fieldElement = fields[fieldName];
        
        if (errorElement && fieldElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            fieldElement.classList.remove('invalid');
            fieldElement.classList.add('valid');
        }
        
        fieldStates[fieldName].isValid = true;
        updateSubmitButton();
    }
    
    // Validaciones específicas para cada campo
    const validators = {
        nombre: (value) => {
            if (!value.trim()) return 'El nombre es requerido';
            if (value.trim().length < 4) return 'El nombre debe tener al menos 4 caracteres';
            return null;
        },
        
        email: (value) => {
            if (!value.trim()) return 'El email es requerido';
            if (!emailRegex.test(value)) return 'Ingresa un email válido';
            return null;
        },
        
        phone: (value) => {
            if (!value.trim()) return null; // Opcional, no hay error si está vacío
            if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
                return 'El teléfono debe tener 10 dígitos';
            }
            return null;
        },
        
        asunto: (value) => {
            if (!value || value === '') return 'Selecciona un asunto';
            return null;
        },
        
        mensaje: (value) => {
            if (!value.trim()) return 'El mensaje es requerido';
            if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres';
            return null;
        }
    };
    
    // Validar un campo individual
    function validateField(fieldName) {
        const field = fields[fieldName];
        if (!field) return;
        
        const value = field.value;
        const error = validators[fieldName](value);
        
        if (error) {
            showError(fieldName, error);
        } else {
            clearError(fieldName);
        }
    }
    
    // Validar todos los campos
    function validateAllFields() {
        Object.keys(fields).forEach(fieldName => {
            validateField(fieldName);
        });
        validateCaptcha();
        return isFormValid();
    }
    
    // Verificar si el formulario es válido
    function isFormValid() {
        return Object.values(fieldStates).every(state => state.isValid);
    }
    
    // Actualizar estado del botón de envío
    function updateSubmitButton() {
        if (!submitBtn) return;
        
        const isValid = isFormValid();
        submitBtn.disabled = !isValid;
        
        if (isValid) {
            submitBtn.classList.add('valid');
        } else {
            submitBtn.classList.remove('valid');
        }
    }
    
    // Validar CAPTCHA
    function validateCaptcha() {
        if (typeof grecaptcha === 'undefined') {
            console.warn('reCAPTCHA no está disponible');
            fieldStates.captcha.isValid = true;
            return true;
        }
        
        const response = grecaptcha.getResponse();
        const isValid = response.length > 0;
        fieldStates.captcha.isValid = isValid;
        
        if (!isValid && formMessage) {
            formMessage.textContent = 'Por favor, completa el CAPTCHA';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        }
        
        updateSubmitButton();
        return isValid;
    }
    
    // Mostrar mensaje de éxito/error
    function showFormMessage(message, isSuccess = true) {
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.className = isSuccess ? 'form-message success' : 'form-message error';
        formMessage.style.display = 'block';
        
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    // Configurar event listeners para validación en tiempo real
    function setupRealTimeValidation() {
        Object.entries(fields).forEach(([fieldName, field]) => {
            if (!field) return;
            
            // Validar después de escribir (con debounce)
            let timeout;
            field.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    validateField(fieldName);
                }, 500);
            });
            
            // Validar al perder el foco
            field.addEventListener('blur', () => {
                validateField(fieldName);
            });
        });
        
        // Validar CAPTCHA periódicamente
        if (typeof grecaptcha !== 'undefined') {
            setInterval(validateCaptcha, 1000);
        }
    }
    
    // Limpiar números de teléfono (quitar espacios y guiones)
    function cleanPhoneNumber() {
        if (fields.phone) {
            fields.phone.addEventListener('input', function(e) {
                // Permitir solo números
                this.value = this.value.replace(/[^\d]/g, '');
                
                // Limitar a 10 dígitos
                if (this.value.length > 10) {
                    this.value = this.value.slice(0, 10);
                }
            });
        }
    }
    
    // Prevenir envío del formulario si no es válido
    function preventInvalidSubmit() {
        form.addEventListener('submit', function(e) {
            if (!validateAllFields()) {
                e.preventDefault();
                showFormMessage('Por favor, corrige los errores en el formulario', false);
                
                // Scroll al primer error
                const firstError = form.querySelector('.invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            } else {
                // Formulario válido, mostrar estado de carga
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                }
            }
        });
    }
    
    // Inicializar validación
    function initValidation() {
        // Validar campos inicialmente
        Object.keys(fields).forEach(fieldName => {
            validateField(fieldName);
        });
        
        // Configurar validación en tiempo real
        setupRealTimeValidation();
        
        // Limpiar formato de teléfono
        cleanPhoneNumber();
        
        // Prevenir envío inválido
        preventInvalidSubmit();
        
        // Actualizar estado inicial del botón
        updateSubmitButton();
        
        console.log('✅ Validación inicializada');
    }
    
    // Iniciar todo
    initValidation();
});