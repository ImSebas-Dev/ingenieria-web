from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
import bcrypt
import re
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
import os
from dotenv import load_dotenv
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todos los dominios

# Configurar Supabase
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_KEY')

if not supabase_url or not supabase_key:
    logger.error("Supabase credentials not found!")
    raise ValueError("Missing Supabase credentials")

supabase: Client = create_client(supabase_url, supabase_key)

def validate_email(email):
    """Validar formato de email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validar formato de teléfono"""
    pattern = r'^\d{10,15}$'
    return re.match(pattern, phone) is not None

def validate_password(password):
    """Validar fortaleza de contraseña"""
    if len(password) < 8:
        return False
    if not any(char.isupper() for char in password):
        return False
    if not any(char.islower() for char in password):
        return False
    if not any(char.isdigit() for char in password):
        return False
    return True

def hash_password(password):
    """Hashear contraseña con bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def check_password(password, hashed):
    """Verificar contraseña hasheada"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def calculate_age(birth_date):
    """Calcular edad a partir de la fecha de nacimiento"""
    today = date.today()
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de salud para verificar que el servidor está funcionando"""
    return jsonify({'status': 'healthy', 'message': 'Server is running'})

@app.route('/signup', methods=['POST'])
def signup():
    try:
        logger.info("Received signup request")
        
        # Obtener datos del formulario
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data received'
            }), 400
        
        # Validaciones del servidor
        errors = {}
        
        # Validar nombre completo
        full_name = data.get('fullName', '').strip()
        if not full_name or len(full_name) < 3 or len(full_name) > 50:
            errors['fullName'] = 'Nombre completo inválido (3-50 caracteres)'
        
        # Validar email
        email = data.get('email', '').strip().lower()
        if not email or not validate_email(email):
            errors['email'] = 'Email inválido'
        
        # Validar contraseña
        password = data.get('password', '')
        if not validate_password(password):
            errors['password'] = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'
        
        # Validar confirmación de contraseña
        confirm_password = data.get('confirmPassword', '')
        if password != confirm_password:
            errors['confirmPassword'] = 'Las contraseñas no coinciden'
        
        # Validar fecha de nacimiento
        birth_date_str = data.get('birthDate', '')
        try:
            birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d').date()
            age = calculate_age(birth_date)
            if age < 13:
                errors['birthDate'] = 'Debes tener al menos 13 años'
        except (ValueError, TypeError):
            errors['birthDate'] = 'Fecha de nacimiento inválida'
        
        # Validar teléfono
        phone = data.get('phone', '').strip()
        if not phone or not validate_phone(phone):
            errors['phone'] = 'Número de teléfono inválido (10-15 dígitos)'
        
        # Validar términos
        terms = data.get('terms', False)
        if not terms:
            errors['terms'] = 'Debes aceptar los términos y condiciones'
        
        # Si hay errores, retornarlos
        if errors:
            logger.warning(f"Validation errors: {errors}")
            return jsonify({
                'success': False,
                'errors': errors
            }), 400
        
        # Verificar si el email ya existe
        try:
            existing_user = supabase.table('users').select('email').eq('email', email).execute()
            if existing_user.data:
                errors['email'] = 'Este email ya está registrado'
                return jsonify({
                    'success': False,
                    'errors': errors
                }), 400
        except Exception as e:
            logger.error(f"Error checking existing user: {e}")
            return jsonify({
                'success': False,
                'message': 'Error interno del servidor'
            }), 500
        
        # Hashear la contraseña
        hashed_password = hash_password(password)
        
        # Insertar usuario en Supabase
        user_data = {
            'full_name': full_name,
            'email': email,
            'password_hash': hashed_password,
            'birth_date': birth_date.isoformat(),
            'phone': phone,
            'terms_accepted': terms
        }
        
        result = supabase.table('users').insert(user_data).execute()
        
        logger.info(f"User created successfully: {email}")
        
        return jsonify({
            'success': True,
            'message': 'Usuario registrado exitosamente'
        }), 200
        
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error interno del servidor'
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_DEBUG', 'False').lower() == 'true')