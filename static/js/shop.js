// Hàm format tiền tệ
const formatVND = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const fetchProducts = () => {
    const apiUrl = 'http://127.0.0.1:5000/api/products';
    const container = document.getElementById('product-container');

    fetch(apiUrl)
        .then(res => res.json())
        .then(products => {
            if (!products || products.length === 0) {
                container.innerHTML = '<p>Không có sản phẩm nào.</p>';
                return;
            }

            // Render dữ liệu
            container.innerHTML = products.map(product => `
                <div class="col-md-6 col-lg-6 col-xl-4">
                    <div class="rounded position-relative fruite-item border border-secondary border-bottom-0 h-100 d-flex flex-column">
                        <div class="fruite-img">
                            <img src="${product.Image}" class="img-fluid w-100 rounded-top" alt="${product.Name}" 
                                 onerror="this.src='img/fruite-item-1.jpg'">
                        </div>
                        <div class="text-white bg-secondary px-3 py-1 rounded position-absolute" style="top: 10px; left: 10px;">
                            ${product.Category}
                        </div>
                        <div class="p-4 border border-secondary border-top-0 rounded-bottom flex-grow-1 d-flex flex-column">
                            <h4>${product.Name}</h4>
                            <p class="flex-grow-1">${product.Description || 'Trái cây tươi ngon nhập khẩu mỗi ngày...'}</p>
                            <div class="d-flex justify-content-between flex-lg-wrap">
                                <p class="text-dark fs-5 fw-bold mb-0">${formatVND(product.Price)}</p>
                                <a href="javascript:void(0)" onclick="addToCart(${product.ProductID})" 
                                   class="btn border border-secondary rounded-pill px-3 text-primary">
                                    <i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<p class="text-danger">Lỗi tải dữ liệu!</p>';
        });
};

// Gọi hàm khi trang web tải xong
document.addEventListener('DOMContentLoaded', fetchProducts);