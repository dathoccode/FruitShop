// Lắng nghe mỗi khi người dùng tick chọn loại phí ship
document.addEventListener('change', function (e) {
    if (e.target && e.target.name === 'shipping') {
        calculateFinalTotal();
    }
});
if (typeof formatVND !== 'function') {
    window.formatVND = function (n) {
        return n.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }).replace('VND', 'VNĐ');
    };
}
async function loadCheckoutData() {
    const userId = localStorage.getItem("accountID");
    const container = document.getElementById('checkout-cart-items');
    const subtotalEl = document.getElementById('subtotal');

    if (!container || !userId) return;

    try {
        const res = await fetch(`http://127.0.0.1:5000/cart/getByUserId/${userId}`);
        const cartItems = await res.json();
        let subtotal = 0;

        if (cartItems.length === 0) {
            container.innerHTML = '<tr><td colspan="5" class="text-center">Giỏ hàng trống</td></tr>';
            return;
        }

        container.innerHTML = cartItems.map(item => {
            const itemTotal = item.Price * item.Quantity;
            subtotal += itemTotal;


            return `
                <tr>
                    <th scope="row">
                        <div class="d-flex align-items-center mt-2">
                            <img src="/static/img/products/${item.ProductImage}" class="img-fluid rounded-circle" style="width: 80px; height: 80px; object-fit: cover;">
                        </div>
                    </th>
                    <td class="py-5">${item.ProductName}</td>
                    <td class="py-5">${formatVND(item.Price)}</td>
                    <td class="py-5 text-center">${item.Quantity}</td>
                    <td class="py-5">${formatVND(itemTotal)}</td>
                </tr>`;
        }).join('');
        subtotalEl.innerText = formatVND(subtotal);
        calculateFinalTotal();

    } catch (err) {
        console.error("Lỗi load checkout:", err);
    }
}
// 2. Hàm tính tổng tiền cuối cùng = Subtotal + Shipping
function calculateFinalTotal() {
    const subtotalText = document.getElementById('subtotal').innerText;
    // Chuyển đổi "260.000 VNĐ" thành số 260000
    const subtotal = parseInt(subtotalText.replace(/\D/g, '')) || 0;

    // Lấy giá trị phí ship từ radio button đang được chọn
    const shippingRadio = document.querySelector('input[name="shipping"]:checked');
    const shippingFee = shippingRadio ? parseInt(shippingRadio.value) : 0;

    const finalTotalEl = document.getElementById('final-total');
    if (finalTotalEl) {
        finalTotalEl.innerText = formatVND(subtotal + shippingFee);
    }
}

// 3. Lắng nghe sự kiện thay đổi phí ship khi người dùng click chọn
document.addEventListener('change', function (e) {
    if (e.target && e.target.name === 'shipping') {
        calculateFinalTotal();
    }
});

// Chạy khi trang web tải xong
document.addEventListener('DOMContentLoaded', loadCheckoutData);
function generateQRCode() {
    // Lấy số tiền từ giao diện (đã được render ở bước trên)
    const finalTotalText = document.getElementById('final-total').innerText;
    const realAmount = finalTotalText.replace(/\D/g, "");

    if (!realAmount || realAmount === "0") {
        alert("Giỏ hàng trống, không thể tạo mã thanh toán!");
        return;
    }

    let requestData = {
        "accountNo": "4530072005",
        "accountName": "Phùng Tuấn Đạt",
        "acqId": "970422",
        "addInfo": "Thanh toan don hang Fruitables",
        "amount": realAmount,
        "template": "compact"
    };

    $.ajax({
        url: 'https://api.vietqr.io/v2/generate',
        type: 'POST',
        headers: {
            'x-client-id': 'f8bf2599-d810-4cf6-bb1b-4fe0e3e994a4',
            'x-api-key': 'e2c07de0-971a-4b2e-8d6f-83802e736ea0',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(requestData),
        success: function (response) {
            if (response.code == "00") {
                $('#qr-image').attr('src', response.data.qrDataURL);
                $('#qr-amount').text(formatVND(parseInt(realAmount)));
                $('#qr-container').fadeIn();
                $('html, body').animate({
                    scrollTop: $("#qr-container").offset().top - 100
                }, 500);
            } else {
                alert("Lỗi tạo mã QR: " + response.desc);
            }
        },
        error: function () {
            alert("Không thể kết nối đến server VietQR");
        }
    });
}