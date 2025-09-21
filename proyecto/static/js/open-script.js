document.addEventListener('DOMContentLoaded', function () {
    // Menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    const gridContainer = document.querySelector('.grid-container');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    let allItems = [];
    let categories = [];

    // Función para cargar items desde el CMS
    async function loadItems() {
        try {
            // Aquí implementarías la conexión con tu backend Django
            // Ejemplo:
            /*
            const response = await fetch('/api/books/');
            const data = await response.json();
            allItems = data.items;
            categories = data.categories;
            */

            // Datos de ejemplo (eliminar en implementación real)
            allItems = [
                {
                    id: 1,
                    title: "Clean Code",
                    summary: "Un libro fundamental sobre principios de programación limpia.",
                    description: "Robert C. Martin nos enseña cómo escribir código limpio, mantenible y eficiente. Un must-read para cualquier desarrollador.",
                    image: "https://via.placeholder.com/300x200?text=Clean+Code",
                    keywords: ["Programación", "Buenas prácticas", "Desarrollo"],
                    category: "Tecnología"
                },
                {
                    id: 2,
                    title: "El Designio Divino",
                    summary: "Una novela intrigante sobre misterio y fe.",
                    description: "Una fascinante historia que entreteje elementos de suspense con profundas reflexiones espirituales.",
                    image: "https://via.placeholder.com/300x200?text=El+Designio+Divino",
                    keywords: ["Ficción", "Misterio", "Espiritualidad"],
                    category: "Ficción"
                },
                {
                    id: 3,
                    title: "Sapiens",
                    summary: "Una breve historia de la humanidad.",
                    description: "Yuval Noah Harari hace un recorrido por la historia de la humanidad, desde la evolución hasta la actualidad.",
                    image: "https://via.placeholder.com/300x200?text=Sapiens",
                    keywords: ["Historia", "Antropología", "No ficción"],
                    category: "Historia"
                }
            ];

            // Extraer categorías únicas
            categories = [...new Set(allItems.map(item => item.category))];

            displayItems(allItems);
            populateCategoryFilter();

        } catch (error) {
            gridContainer.innerHTML = '<div class="no-results">Error al cargar los elementos. Por favor, intenta nuevamente más tarde.</div>';
        }
    }

    // Función para mostrar items en la cuadrícula
    function displayItems(items) {
        if (!items || items.length === 0) {
            gridContainer.innerHTML = '<div class="no-results">No se encontraron elementos.</div>';
            return;
        }

        gridContainer.innerHTML = '';

        items.forEach(item => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';

            gridItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="item-image">
                <div class="item-content">
                    <h3 class="item-title">${item.title}</h3>
                    <p class="item-summary">${item.summary}</p>
                    <div class="item-keywords">
                        ${item.keywords.map(keyword => `<span class="keyword">${keyword}</span>`).join('')}
                    </div>
                    <a href="/book-detail/${item.id}" class="item-link">Ver detalles</a>
                </div>
            `;

            gridContainer.appendChild(gridItem);
        });
    }

    // Función para poblar el filtro de categorías
    function populateCategoryFilter() {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Función para filtrar items
    function filterItems() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        const filteredItems = allItems.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm) ||
                item.summary.toLowerCase().includes(searchTerm) ||
                item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm));

            const matchesCategory = selectedCategory === '' || item.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        displayItems(filteredItems);
    }

    // Event listeners para filtros
    searchInput.addEventListener('input', filterItems);
    categoryFilter.addEventListener('change', filterItems);

    // Cargar items al iniciar la página
    loadItems();
});