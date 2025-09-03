document.addEventListener('DOMContentLoaded', function() {
    // Animación de las barras de habilidades al aparecer
    const skillBars = document.querySelectorAll('.skill-level');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    };
    
    // Intersection Observer para animar al hacer scroll
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
    
    // Efecto hover para tarjetas
    const cards = document.querySelectorAll('.skill-category, .soft-skill-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const x = e.clientX - card.getBoundingClientRect().left;
            const y = e.clientY - card.getBoundingClientRect().top;
            
            const centerX = card.offsetWidth / 2;
            const centerY = card.offsetHeight / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
    
    // Descargar CV (simulado)
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simular descarga
            this.innerHTML = '<i class="fas fa-check"></i> Descargando...';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-download"></i> Descargar CV';
                alert('Descarga simulada. En una implementación real, esto descargaría tu CV en PDF.');
            }, 2000);
        });
    }
});