import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

document.addEventListener('DOMContentLoaded', async function () {
    // Configuración de Supabase
    const SUPABASE_URL = 'https://nbhrufenoymvnlhqqxgz.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHJ1ZmVub3ltdm5saHFxeGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzcwMDQsImV4cCI6MjA3MTIxMzAwNH0.4M9Zn1P2L3tY2E9d0oWLahGxCY6RGhiO0ZQ1dc3x59Y';

    // Inicializar cliente de Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

    // Callback para reCAPTCHA
    window.recaptchaCallback = function (response) {
        isRecaptchaValid = response !== null && response !== '';
        const recaptchaError = document.getElementById('recaptcha-error');

        if (isRecaptchaValid) {
            recaptchaError.style.display = 'none';
        } else {
            recaptchaError.style.display = 'block';
        }

        checkFormValidity();
    };

    // Toggle para mostrar/ocultar contraseña
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function () {
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
    form.addEventListener('input', function (e) {
        validateField(e.target);
        checkFormValidity();
    });

    // Validación al perder foco
    form.addEventListener('focusout', function (e) {
        validateField(e.target);
        checkFormValidity();
    });

    // Validación del checkbox
    const termsCheckbox = document.getElementById('terms');
    termsCheckbox.addEventListener('change', function () {
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

        // Si el campo está vacío pero no es requerido, es válido
        if (!field.value.trim() && !field.required) {
            return true;
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
                if (field.value) {
                    const selectedDate = new Date(field.value);
                    isValid = selectedDate <= maxDate;
                    if (!isValid) errorMessage.textContent = 'Debes tener al menos 13 años';
                }
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
        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let allValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                allValid = false;
            }
        });

        // Verificar reCAPTCHA
        const recaptchaError = document.getElementById('recaptcha-error');
        if (!isRecaptchaValid) {
            allValid = false;
            recaptchaError.style.display = 'block';
        } else {
            recaptchaError.style.display = 'none';
        }

        submitBtn.disabled = !allValid;
        return allValid;
    }

    // Función para mostrar errores del servidor
    function showServerErrors(errors) {
        Object.keys(errors).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                const formGroup = field.closest('.form-group');
                const errorMessage = formGroup.querySelector('.error-message');

                formGroup.classList.add('invalid');
                errorMessage.textContent = errors[fieldName];

                // Scroll al primer error
                if (Object.keys(errors)[0] === fieldName) {
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // Función para resetear todos los errores
    function resetAllErrors() {
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('invalid', 'valid');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = errorMessage.dataset.originalMessage || '';
            }
        });

        // Resetear reCAPTCHA
        isRecaptchaValid = false;
        document.getElementById('recaptcha-error').style.display = 'none';
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
        }
    }

    // Envío del formulario
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (checkFormValidity()) {
            submitBtn.classList.add('loading');

            // Obtener datos del formulario
            try {
                const formData = {
                    full_name: document.getElementById('fullName').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    password: document.getElementById('password').value.trim(),
                    birth_date: document.getElementById('birthDate').value,
                    phone: document.getElementById('phone').value.trim(),
                    terms: document.getElementById('terms').checked,
                };

                // 1. Registrar usuario en Auth de Supabase
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.full_name,
                            birth_date: formData.birth_date,
                            phone: formData.phone,
                        }
                    }
                });

                if (authError) {
                    throw authError;
                }

                // 2. Insertar datos adicionales en tu tabla de usuarios
                const { error: dbError } = await supabase
                    .from('users')
                    .insert({
                        id: authData.user.id,
                        full_name: formData.full_name,
                        email: formData.email,
                        birth_date: formData.birth_date,
                        phone: formData.phone,
                        created_at: new Date().toISOString(),
                    });

                if (dbError) {
                    throw dbError;
                }

                // Éxito
                submitBtn.classList.remove('loading');
                successMessage.classList.add('show');

                // Resetear formulario
                form.reset();
                form.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('valid', 'invalid');
                });
                submitBtn.disabled = true;

                // Resetear reCAPTCHA
                resetAllErrors();
            } catch (error) {
                submitBtn.classList.remove('loading');
                console.error('Error en el registro:', error);

                // Resetear reCAPTCHA en caso de error
                if (typeof grecaptcha !== 'undefined') {
                    grecaptcha.reset();
                }
                isRecaptchaValid = false;

                // Manejar errores específicos
                if (error.message.includes('already registered')) {
                    showServerErrors({ email: 'El correo electrónico ya está registrado' });
                } else if (error.message.includes('password')) {
                    showServerErrors({ password: 'Error en la contraseña' });
                } else {
                    showServerErrors({ general: 'Error en el registro. Por favor, inténtalo de nuevo.' });
                }
            }
        }
    });

    // Cerrar mensaje de éxito
    closeSuccessBtn.addEventListener('click', function () {
        successMessage.classList.remove('show');
    });

    // Cerrar mensaje de éxito con ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && successMessage.classList.contains('show')) {
            successMessage.classList.remove('show');
        }
    });

    // Cerrar mensaje de éxito al hacer clic fuera
    successMessage.addEventListener('click', function (e) {
        if (e.target === successMessage) {
            successMessage.classList.remove('show');
        }
    });
});