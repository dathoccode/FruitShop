const API_BASE = "http://127.0.0.1:5000";
let currentProductList = []; // Biến lưu trữ danh sách sản phẩm hiện tại để sort



// ================== RENDER ==================
function renderProducts(products, isSorting = false) {
    const container = document.getElementById('product-container');
    if (!container) return;

    // Nếu không phải đang sort thì mới cập nhật danh sách gốc
    if (!isSorting) {
        currentProductList = products;
    }

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4>Không tìm thấy sản phẩm</h4>
            </div>`;
        return;
    }

    container.innerHTML = products.map(p => `
        <div class="col-md-6 col-lg-6 col-xl-4 mb-4">
            <div class="rounded position-relative fruite-item border border-secondary h-100 d-flex flex-column shadow-sm">
                <div class="fruite-img">
                    <img src="/static/img/products/${p.ProductImage || 'default.jpg'}"
                        class="img-fluid w-100 rounded-top"
                        style="height:250px; object-fit:cover;" alt="${p.ProductName}">
                </div>
                <div class="p-4 flex-grow-1 d-flex flex-column">
                    <h4 class="text-primary">${p.ProductName}</h4>
                    <p class="flex-grow-1 text-muted text-truncate">
                        ${p.Descript || 'Trái cây sạch, tươi ngon mỗi ngày...'}
                    </p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <p class="text-dark fs-5 fw-bold mb-0">
                            ${formatVND(p.Price)}
                        </p>
                        <button onclick="addToCart(${p.ProductID})"
                            class="btn border border-secondary rounded-pill px-3 text-primary">
                            <i class="fa fa-shopping-bag me-2"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ================== SORT LOGIC ==================
function sortProducts(criteria) {
    if (!currentProductList || currentProductList.length === 0) return;

    // Sao chép mảng để không ảnh hưởng mảng gốc khi sort
    let sortedData = [...currentProductList];

    switch (criteria) {
        case "price-asc":
            sortedData.sort((a, b) => a.Price - b.Price);
            break;
        case "price-desc":
            sortedData.sort((a, b) => b.Price - a.Price);
            break;
        case "name-asc":
            sortedData.sort((a, b) => a.ProductName.localeCompare(b.ProductName));
            break;
        case "name-desc":
            sortedData.sort((a, b) => b.ProductName.localeCompare(a.ProductName));
            break;
        default:
            // Mặc định hoặc "Nothing": giữ nguyên/sắp xếp theo ID
            sortedData.sort((a, b) => a.ProductID - b.ProductID);
            break;
    }

    // Render lại nhưng báo hiệu đây là hành động sort (không ghi đè currentProductList)
    renderProducts(sortedData, true);
}

// ================== LOAD DATA ==================
function shopLoadProducts(param = "") {
    let url = "";
    if (!param || param === "All") {
        url = `${API_BASE}/product/getAllProduct`;
    }
    else if (param.startsWith("http")) {
        url = param;
    }
    else {
        url = `${API_BASE}/product/search?keyword=${encodeURIComponent(param)}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            renderProducts(data);
            // Reset ô chọn sort về mặc định mỗi khi load dữ liệu mới (search/filter)
            const sortSelect = document.getElementById('fruits');
            if (sortSelect) sortSelect.value = "default";
        })
        .catch(err => {
            console.error("Lỗi API:", err);
            document.getElementById('product-container').innerHTML =
                `<p class="text-center text-danger">Lỗi kết nối server!</p>`;
        });
}

// ================== FILTER CATEGORY ==================
function filterCategory(categoryName) {
    if (categoryName === "All") {
        shopLoadProducts();
    } else {
        shopLoadProducts(`${API_BASE}/product/category/${encodeURIComponent(categoryName)}`);
    }
}

// (Giữ nguyên hàm loadCategoryCounts của bạn...)
function loadCategoryCounts() {
    $.ajax({
        url: `${API_BASE}/product/getAllProduct`,
        type: "GET",
        success: function (data) {
            let counts = { all: data.length, rau: 0, fruit: 0, bread: 0, meat: 0 };
            data.forEach(p => {
                if (p.Category === "Rau củ") counts.rau++;
                else if (p.Category === "Trái cây") counts.fruit++;
                else if (p.Category === "Bánh mì") counts.bread++;
                else if (p.Category === "Thịt") counts.meat++;
            });
            $("#count-all").text(`(${counts.all})`);
            $("#count-rau").text(`(${counts.rau})`);
            $("#count-fruit").text(`(${counts.fruit})`);
            $("#count-bread").text(`(${counts.bread})`);
            $("#count-meat").text(`(${counts.meat})`);
        }
    });
}

// ================== SEARCH ==================
function setupSearch() {
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');
    if (!input || !btn) return;

    const doSearch = () => shopLoadProducts(input.value.trim());
    btn.addEventListener('click', doSearch);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });

    let timer;
    input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(doSearch, 400);
    });
}

// ================== ADD TO CART ==================
function addToCart(productId) {
    const userId = localStorage.getItem("accountID");
    if (!userId) {
        alert("Vui lòng đăng nhập!");
        window.location.href = "login.html";
        return;
    }
    fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: userId, product_id: productId })
    })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(() => alert("Đã thêm vào giỏ hàng!"))
        .catch(() => alert("Không thể thêm vào giỏ hàng!"));
}

// ================== INIT ==================
document.addEventListener('DOMContentLoaded', () => {
    shopLoadProducts();
    setupSearch();
    loadCategoryCounts();

    // 👉 Lắng nghe sự kiện Sort
    const sortSelect = document.getElementById('fruits'); // ID 'fruits' khớp với HTML bạn gửi
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }
});