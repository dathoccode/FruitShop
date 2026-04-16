const API_BASE = "http://127.0.0.1:5000";
const renderProducts = (products) => {
    const container = document.getElementById('product-container');
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = `<p class="text-center">Không tìm thấy sản phẩm</p>`;
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="col-md-6 col-lg-6 col-xl-4">
            <div class="rounded position-relative fruite-item border border-secondary h-100 d-flex flex-column">
                
                <div class="fruite-img">
                    <img src="/static/img/products/${product.ProductImage}" 
                         class="img-fluid w-100 rounded-top" 
                         alt="${product.ProductName}">
                </div>

                <div class="p-4 flex-grow-1 d-flex flex-column">
                    <h4>${product.ProductName}</h4>

                    <p class="flex-grow-1 text-truncate">
                        ${product.Descript || 'Trái cây tươi ngon...'}
                    </p>

                    <div class="d-flex justify-content-between flex-lg-wrap">
                        <p class="text-dark fs-5 fw-bold mb-0">
                            ${formatVND(product.Price)}
                        </p>

                        <button onclick="addToCart(${product.ProductID})"
                            class="btn border border-secondary rounded-pill px-3 text-primary">
                            <i class="fa fa-shopping-bag me-2"></i> Add
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `).join('');
};

// ===== FETCH ALL =====
const fetchProducts = () => {
    fetch(`${API_BASE}/product/getAllProduct`)
        .then(res => res.json())
        .then(renderProducts)
        .catch(() => alert("Lỗi load sản phẩm"));
};

// ===== SEARCH =====
const searchProducts = (keyword) => {
    fetch(`${API_BASE}/product/search?keyword=${encodeURIComponent(keyword)}`)
        .then(res => res.json())
        .then(renderProducts)
        .catch(() => alert("Lỗi search"));
};

// ===== ADD TO CART =====
function addToCart(productId) {
    const userId = localStorage.getItem("accountID");

    if (!userId) {
        alert("Bạn cần đăng nhập!");
        window.location.href = "login.html";
        return;
    }

    fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            account_id: userId,
            product_id: productId
        })
    })
        .then(res => res.json())
        .then(() => alert("Đã thêm vào giỏ hàng!"))
        .catch(() => alert("Lỗi server!"));
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');

    if (!input || !btn) return;

    // Click search
    btn.addEventListener('click', () => {
        const keyword = input.value.trim();
        keyword ? searchProducts(keyword) : fetchProducts();
    });

    // Enter search
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const keyword = input.value.trim();
            keyword ? searchProducts(keyword) : fetchProducts();
        }
    });

    // Realtime search (debounce)
    let timeout;
    input.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const keyword = input.value.trim();
            keyword ? searchProducts(keyword) : fetchProducts();
        }, 300);
    });
});