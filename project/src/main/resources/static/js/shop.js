// Product data: grid filters, sorting state, cart updates, dynamic product visibility.

document.addEventListener("DOMContentLoaded", () => {

    /* PRODUCT GRID */
    const productGrid = document.querySelector(".product-grid");
    if (!productGrid) return;
    let products = Array.from(productGrid.querySelectorAll(".product-card"));

    /* FILTERS */
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const filter = btn.dataset.filter;
            products.forEach(p => {
                const category = p.dataset.category;
                if (filter === "all" || filter === category) {
                    p.style.display = "block";
                } else {
                    p.style.display = "none";
                }
            });
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    /* SORTING */
    const sortSelect = document.getElementById("sortProducts");
    sortSelect?.addEventListener("change", () => {
        const sort = sortSelect.value;
        products.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            if (sort === "asc") return priceA - priceB;
            if (sort === "desc") return priceB - priceA;
            return 0;
        });
        products.forEach(p => productGrid.appendChild(p));
    });

    /* CART UPDATES */
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartDisplay() {
        const cartCount = document.getElementById("cartCount");
        if (cartCount) cartCount.textContent = cart.length;
    }
    function addToCart(productId) {
        const product = products.find(p => p.dataset.id === productId);
        if (!product) return;
        cart.push({
            id: productId,
            name: product.dataset.name,
            price: parseFloat(product.dataset.price),
            quantity: 1
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
        alert(`${product.dataset.name} added to cart!`);
    }

    products.forEach(p => {
        const addBtn = p.querySelector(".add-to-cart");
        addBtn?.addEventListener("click", () => addToCart(p.dataset.id));
    });
    updateCartDisplay();

    /* QUICK VIEW MODAL */
    const modal = document.getElementById("productModal");
    const modalContent = modal?.querySelector(".modal-content");
    const closeModal = modal?.querySelector(".close");
    products.forEach(p => {
        const viewBtn = p.querySelector(".view-btn");
        viewBtn?.addEventListener("click", () => {
            if (!modal || !modalContent) return;
            modalContent.innerHTML = `
                <h3>${p.dataset.name}</h3>
                <p>Price: $${p.dataset.price}</p>
                <p>${p.dataset.description || ""}</p>
            `;
            modal.classList.add("show");
            modal.classList.remove("hidden");
        });
    });

    closeModal?.addEventListener("click", () => {
        modal?.classList.remove("show");
        setTimeout(() => modal?.classList.add("hidden"), 400);
    });
    window.addEventListener("click", e => {
        if (e.target === modal) {
            modal?.classList.remove("show");
            setTimeout(() => modal?.classList.add("hidden"), 400);
        }
    });
});