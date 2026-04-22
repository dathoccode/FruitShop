// index.js

// 1. Hàm load toàn bộ sản phẩm (Dùng cho tab All và lúc tìm kiếm)
function loadProducts(apiUrl = "http://127.0.0.1:5000/product/getAllProduct") {
    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function (data) {
            const container = $('#product-list-api');
            container.empty();

            if (data.length === 0) {
                container.append('<div class="col-12 text-center py-5"><h3>Không tìm thấy sản phẩm nào!</h3></div>');
                return;
            }

            data.forEach(p => {
                let shortDesc = p.Descript ? p.Descript : "Chưa có mô tả cho sản phẩm này.";
                if (shortDesc.length > 50) shortDesc = shortDesc.substring(0, 50) + "...";

                const html = `
                <div class="col-md-6 col-lg-4 col-xl-3 mb-4">
                    <div class="rounded position-relative fruite-item border border-secondary h-100 d-flex flex-column">
                        <div class="fruite-img">
                            <img src="/static/img/products/${p.ProductImage}" class="img-fluid w-100 rounded-top" style="height:200px; object-fit:cover;" alt="${p.ProductName}">
                        </div>
                        <div class="p-4 flex-grow-1 d-flex flex-column">
                            <h4>${p.ProductName}</h4>
                            <p class="flex-grow-1 text-truncate" style="white-space: normal;">${shortDesc}</p>
                            <div class="d-flex justify-content-between flex-lg-wrap mt-auto">
                                <p class="text-dark fs-5 fw-bold mb-0">${p.Price.toLocaleString('vi-VN')} VNĐ</p>
                                <button onclick="addToCart(${p.ProductID})" class="btn border border-secondary rounded-pill px-3 text-primary">
                                    <i class="fa fa-shopping-bag me-2 text-primary"></i> Mua ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
                container.append(html);
            });
        },
        error: function (err) {
            console.error("Lỗi lấy dữ liệu:", err);
        }
    });
}

// 2. Hàm gọi API Tìm kiếm
function searchProducts() {
    const keyword = $('#search-input').val().trim();
    if (keyword === '') {
        loadProducts();
    } else {
        loadProducts(`http://127.0.0.1:5000/product/search?keyword=${encodeURIComponent(keyword)}`);
    }
}

// 3. Hàm gọi API Lọc theo danh mục
function filterCategory(categoryName) {
    if (categoryName === 'All') {
        loadProducts();
    } else {
        loadProducts(`http://127.0.0.1:5000/product/category/${encodeURIComponent(categoryName)}`);
    }
}

// 4. Hàm thêm vào giỏ hàng
function addToCart(productId) {
    const userId = localStorage.getItem("accountID");
    if (!userId) {
        alert("Bạn cần đăng nhập để mua hàng!");
        window.location.href = "login.html";
        return;
    }

    fetch('http://127.0.0.1:5000/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: userId, product_id: productId })
    })
        .then(res => res.json())
        .then(data => alert("Đã thêm vào giỏ hàng thành công!"))
        .catch(err => alert("Lỗi kết nối server!"));
}

// 5. Hàm lấy 10 sản phẩm bán chạy nhất (Chính là cái đang bị thiếu đây!)
function loadBestSellers() {
    $.ajax({
        url: "http://127.0.0.1:5000/product/bestseller",
        type: 'GET',
        success: function (data) {
            const container = $('#best-seller-container');

            // Xóa slider cũ nếu có để tránh lỗi trùng lặp khi load lại
            if (container.hasClass('owl-loaded')) {
                container.trigger('destroy.owl.carousel').removeClass('owl-loaded');
                container.find('.owl-stage-outer').children().unwrap();
            }

            container.empty();

            if (data.length === 0) {
                container.append('<div class="col-12 text-center py-5"><h3>Chưa có sản phẩm bán chạy!</h3></div>');
                return;
            }

            data.forEach(p => {
                let shortDesc = p.Descript ? p.Descript : "Sản phẩm bán chạy nhất trong tuần.";
                if (shortDesc.length > 50) shortDesc = shortDesc.substring(0, 50) + "...";

                const html = `
                <div class="border border-primary rounded position-relative vesitable-item h-100 d-flex flex-column m-2">
                    <div class="vesitable-img">
                        <img src="/static/img/products/${p.ProductImage}" class="img-fluid w-100 rounded-top" style="height:200px; object-fit:cover;" alt="${p.ProductName}">
                    </div>
                    <div class="text-white bg-primary px-3 py-1 rounded position-absolute" style="top: 10px; right: 10px;">${p.Category}</div>
                    <div class="p-4 rounded-bottom flex-grow-1 d-flex flex-column">
                        <h4>${p.ProductName}</h4>
                        <p class="flex-grow-1 text-truncate" style="white-space: normal;">${shortDesc}</p>
                        <div class="d-flex justify-content-between flex-lg-wrap mt-auto">
                            <p class="text-dark fs-5 fw-bold mb-0">${p.Price.toLocaleString('vi-VN')} đ</p>
                            <button onclick="addToCart(${p.ProductID})" class="btn border border-secondary rounded-pill px-3 text-primary">
                                <i class="fa fa-shopping-bag me-2 text-primary"></i> Add
                            </button>
                        </div>
                    </div>
                </div>`;
                container.append(html);
            });

            // "Phép thuật" nằm ở đây: Khởi tạo lại hiệu ứng trượt sau khi đã có dữ liệu
            container.owlCarousel({
                autoplay: true,
                smartSpeed: 1500,
                center: false,
                dots: true,
                loop: true,
                margin: 25,
                nav: true,
                navText: [
                    '<i class="bi bi-arrow-left"></i>',
                    '<i class="bi bi-arrow-right"></i>'
                ],
                responsiveClass: true,
                responsive: {
                    0: { items: 1 },
                    576: { items: 1 },
                    768: { items: 2 },
                    992: { items: 3 },
                    1200: { items: 4 }
                }
            });
        },
        error: function (err) {
            console.error("Lỗi lấy dữ liệu Best Seller:", err);
        }
    });
}

// 6. Chạy tự động lúc mới vào web
$(document).ready(function () {
    // Mình vẫn giữ lại loadProducts() phòng khi bạn chưa xóa HTML phần Our Organic Products
    loadProducts();

    // Gọi hàm load best seller
    setTimeout(function () {
        loadBestSellers();
    }, 500);
});