loadProduct();

// 1. Hàm tải danh sách sản phẩm
function loadProduct() {
    $.ajax({
        url: "http://127.0.0.1:5000/product/getByCate",
        method: "GET",
        contentType: "application/json",
        data: { category: '' },
        success: function (res) {
            var container = ``;
            // Đoạn code bên trong vòng lặp success của loadProduct
            res.forEach(product => {
                const html = `
                <tr>
                    <td><img src="/static/img/products/${product.ProductImage}"></td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.category}</td>
                    <td>
                        <button class="btn btn-danger btn-sm me-2" onclick="deleteProduct('${product.id}')"> Xóa </button>
                        <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#addModal" onclick="editProduct(${JSON.stringify(product).replace(/"/g, '&quot;')})"> Sửa </button>
                    </td>
                </tr>
                `;
                container += html;
            });
            $('#productTable').html(container);
        },
        error: function (err) {
            console.log(err);
            alert("Không thể tải danh sách sản phẩm");
        }
    });
}

// 2. Hàm khi nhấn nút Sửa: Điền dữ liệu vào Modal
function editProduct(product) {
    // Hiện ô ID lên khi sửa (tùy chọn) hoặc chỉ gán giá trị ẩn
    const idInput = document.getElementById("id");
    idInput.value = product.id;
    idInput.style.display = "block"; // Hiện lên để người dùng thấy ID
    idInput.readOnly = true;        // Khóa không cho sửa ID
    idInput.style.backgroundColor = "#eee";

    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("category").value = product.category;
    document.getElementById("image").value = product.image;

    document.getElementById("modalTitle").innerText = "Chỉnh sửa sản phẩm";
}

// 3. Hàm Lưu (Gọi API Thêm hoặc Sửa)
function saveProduct() {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").value;

    if (!name || !price) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const productData = { name, price, category, image };

    // Logic: Nếu có ID thì gọi API Update, nếu không thì gọi API Add
    let url = id ? `http://127.0.0.1:5000/product/update` : `http://127.0.0.1:5000/product/add`;
    if (id) productData.id = id;

    $.ajax({
        url: url,
        method: "POST", // Hoặc PUT tùy API của bạn
        contentType: "application/json",
        data: JSON.stringify(productData),
        success: function () {
            alert("Lưu thành công!");
            loadProduct();
            bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
        },
        error: function () {
            alert("Lỗi khi lưu sản phẩm!");
        }
    });
}

function deleteProduct(productId) {
    // Kiểm tra xem ID có hợp lệ trước khi gửi không
    console.log("Đang thực hiện xóa sản phẩm có ID:", productId);

    if (!productId) {
        alert("Không tìm thấy ID sản phẩm để xóa!");
        return;
    }

    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        $.ajax({
            // QUAN TRỌNG: Phải nối tham số ?id= vào URL
            url: "http://127.0.0.1:5000/product/DeleteById?id=" + productId,
            type: "DELETE",
            success: function (res) {
                alert(res.message); // Sẽ hiện "Xóa thành công"
                loadProduct();      // Tải lại danh sách sản phẩm
            },
            error: function (xhr) {
                console.error("Lỗi xóa:", xhr);
                let msg = xhr.responseJSON ? xhr.responseJSON.message : "Lỗi kết nối server";
                alert("Thất bại: " + msg);
            }
        });
    }
}
// 5. Reset Form
function resetForm() {
    document.getElementById("id").value = "";
    document.getElementById("id").style.display = "none";
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("category").value = "";
    document.getElementById("image").value = "";
    document.getElementById("modalTitle").innerText = "Thêm sản phẩm";
}

document.getElementById('addModal').addEventListener('hidden.bs.modal', resetForm);