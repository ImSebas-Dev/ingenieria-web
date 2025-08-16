document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const submitBtn = document.querySelector('.submit-btn');
    const successMessage = document.getElementById('successMessage');
    const closeSuccessBtn = document.getElementById('closeSuccess');
    
    // Configurar fecha máxima para nacimiento (13 años mínimo)
    const birthDateInput = document.getElementById('birthDate');
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    birthDateInput.max = maxDate.toISOString().split('T')[0];
    
    // Expresiones regulares para validación
    const patterns = {
        fullName: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        phone: /^[0-9]{10,15}$/
    };
    
    // Toggle para mostrar/ocultar contraseña
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
    
    // Validación en tiempo real
    form.addEventListener('input', function(e) {
        validateField(e.target);
        checkFormValidity();
    });
    
    // Validación al perder foco
    form.addEventListener('focusout', function(e) {
        validateField(e.target);
        checkFormValidity();
    });
    
    // Validación del checkbox
    const termsCheckbox = document.getElementById('terms');
    termsCheckbox.addEventListener('change', function() {
        validateField(this);
        checkFormValidity();
    });
    
    // Función para validar un campo
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        // Resetear estado
        formGroup.classList.remove('valid', 'invalid');
        errorMessage.textContent = errorMessage.dataset.originalMessage || '';
        
        // Validar campo requerido vacío
        if (field.required && !field.value.trim()) {
            formGroup.classList.add('invalid');
            return false;
        }
        
        // Validaciones específicas por tipo de campo
        let isValid = true;
        
        switch (field.id) {
            case 'fullName':
                isValid = patterns.fullName.test(field.value);
                if (!isValid) errorMessage.textContent = 'Ingresa un nombre válido (3-50 caracteres, solo letras)';
                break;
                
            case 'email':
                isValid = patterns.email.test(field.value);
                if (!isValid) errorMessage.textContent = 'Ingresa un correo electrónico válido';
                break;
                
            case 'password':
                isValid = patterns.password.test(field.value);
                if (!isValid) errorMessage.textContent = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
                break;
                
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                isValid = field.value === password;
                if (!isValid) errorMessage.textContent = 'Las contraseñas no coinciden';
                break;
                
            case 'birthDate':
                const selectedDate = new Date(field.value);
                isValid = selectedDate <= maxDate;
                if (!isValid) errorMessage.textContent = 'Debes tener al menos 13 años';
                break;
                
            case 'phone':
                isValid = patterns.phone.test(field.value);
                if (!isValid) errorMessage.textContent = 'Ingresa un número válido (10-15 dígitos)';
                break;
                
            case 'terms':
                isValid = field.checked;
                if (!isValid) errorMessage.textContent = 'Debes aceptar los términos y condiciones';
                break;
        }
        
        // Aplicar clases de validación
        if (field.value.trim() && isValid) {
            formGroup.classList.add('valid');
        } else if (!isValid) {
            formGroup.classList.add('invalid');
        }
        
        return isValid;
    }
    
    // Función para verificar si todo el formulario es válido
    function checkFormValidity() {
        const fields = form.querySelectorAll('input, select, textarea');
        let allValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) {
                allValid = false;
            }
        });
        
        submitBtn.disabled = !allValid;
        return allValid;
    }
    
    // Envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (checkFormValidity()) {
            // Simular envío
            submitBtn.classList.add('loading');
            
            // Simular retraso de red
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                successMessage.classList.add('show');
                
                // Resetear formulario después de mostrar el mensaje
                form.reset();
                form.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('valid', 'invalid');
                });
                submitBtn.disabled = true;
            }, 1500);
        }
    });
    
    // Cerrar mensaje de éxito
    closeSuccessBtn.addEventListener('click', function() {
        successMessage.classList.remove('show');
    });
});