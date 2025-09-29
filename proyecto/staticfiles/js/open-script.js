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

    const gridContainer = document.querySelector('.grid-container');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    let allItems = [];
    let categories = [];

    // Función para cargar items desde el CMS
    async function loadItems() {
        try {
            const response = await fetch('/open/api/canciones/');
            const data = await response.json();
            allItems = data;  // DRF devuelve lista JSON

            // categorías dinámicas (genres legibles)
            categories = [...new Set(allItems.map(item => item.category))];

            displayItems(allItems);
            populateCategoryFilter();
        } catch (error) {
            gridContainer.innerHTML = '<div class="no-results">Error al cargar canciones.</div>';
        }
    }

    // Función para mostrar items en la cuadrícula
    function displayItems(items) {
        if (!items || items.length === 0) {
            gridContainer.innerHTML = '<div class="no-results">No se encontraron canciones.</div>';
            return;
        }

        gridContainer.innerHTML = '';

        items.forEach(item => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';

            gridItem.innerHTML = `
            <img src="${item.cover_image}" alt="${item.title}" class="item-image">
            <div class="item-content">
                <h3 class="item-title">${item.title}</h3>
                <p class="item-summary">Artista: ${item.artist} | Álbum: ${item.album || '-'}</p>
                <div class="item-keywords">
                    ${item.keywords.map(keyword => `<span class="keyword">${keyword}</span>`).join('')}
                </div>
                <a href="${item.slug}" class="item-link">Ver detalles</a>
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