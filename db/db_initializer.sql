USE Fruitables;
GO
DBCC CHECKIDENT ('tblAccount', RESEED, 0);
DBCC CHECKIDENT ('tblProduct', RESEED, 0);
DBCC CHECKIDENT ('tblInvoice', RESEED, 0);
DBCC CHECKIDENT ('tblPayment', RESEED, 0);
DBCC CHECKIDENT ('tblOrder', RESEED, 0);
DBCC CHECKIDENT ('tblInvoiceDetail', RESEED, 0);

-- 1. tblAccount (bỏ AccountID)
INSERT INTO tblAccount
    (UserName, Passwd, UserAddress, Phone, AccountRole)
    (UserName, Passwd, UserAddress, Phone, AccountRole)
VALUES
    (N'Nguyễn Văn An', '123456', N'Hà Nội', '0900000001', 'USER'),
    (N'Vũ Minh Hiếu', '123456', N'Hải Phòng', '0900000002', 'USER'),
    (N'Hoàng Đức Trọng', '123456', N'Đà Nẵng', '0900000003', 'ADMIN'),
    (N'Phùng Tuấn Đạt', '123456', N'TP. Hồ Chí Minh', '0900000004', 'USER'),
    (N'Nguyễn Duy Minh', '123456', N'Cần Thơ', '0900000005', 'USER'),
    (N'admin', '123456', 'Kim Lan', '0859376293', 'USER');


-- 2. tblProduct (bỏ ProductID)
    (N'Nguyễn Văn An', '123456', N'Hà Nội', '0900000001', 'USER'),
    (N'Vũ Minh Hiếu', '123456', N'Hải Phòng', '0900000002', 'USER'),
    (N'Hoàng Đức Trọng', '123456', N'Đà Nẵng', '0900000003', 'ADMIN'),
    (N'Phùng Tuấn Đạt', '123456', N'TP. Hồ Chí Minh', '0900000004', 'USER'),
    (N'Nguyễn Duy Minh', '123456', N'Cần Thơ', '0900000005', 'USER'),
    (N'admin', '123456', 'Kim Lan', '0859376293', 'USER');


-- 2. tblProduct (bỏ ProductID)
INSERT INTO tblProduct
    (ProductName, Category, Price, Stock, DueDate, Descript, Discount, ProductImage)
    (ProductName, Category, Price, Stock, DueDate, Descript, Discount, ProductImage)
VALUES
    (N'Táo Mỹ', N'Trái cây', 50000, 100, '2026-12-31', N'Táo đỏ nhập khẩu, giòn và ngọt', 10, N'apple.jpg'),
    (N'Chuối', N'Trái cây', 20000, 200, '2026-10-10', N'Chuối chín tự nhiên, không hóa chất', 5, N'banana.jpg'),
    (N'Cam', N'Trái cây', 30000, 150, '2026-11-15', N'Cam sành mọng nước, nhiều vitamin C', 0, N'orange.jpg'),
    (N'Cà rốt', N'Rau củ', 25000, 120, '2026-09-20', N'Cà rốt Đà Lạt tươi sạch mỗi ngày', 15, N'carrot.jpg'),
    (N'Bông cải', N'Rau củ', 40000, 80, '2026-08-30', N'Bông cải xanh giàu chất xơ', 20, N'broccoli.jpg');


-- 3. tblInvoice
-- 3. tblInvoice
INSERT INTO tblInvoice
    (AccountID, TotalPayment, InvoiceState)
    (AccountID, TotalPayment, InvoiceState)
VALUES
    (1, 100000, N'Đã thanh toán'),
    (2, 200000, N'Chờ xử lý'),
    (3, 150000, N'Đã thanh toán'),
    (4, 300000, N'Đang giao hàng'),
    (5, 250000, N'Đã thanh toán');

    (1, 100000, N'Đã thanh toán'),
    (2, 200000, N'Chờ xử lý'),
    (3, 150000, N'Đã thanh toán'),
    (4, 300000, N'Đang giao hàng'),
    (5, 250000, N'Đã thanh toán');


-- 4. tblPayment (bỏ PaymentID)
-- 4. tblPayment (bỏ PaymentID)
INSERT INTO tblPayment
    (InvoiceID, Paying_method, Paying_date)
    (InvoiceID, Paying_method, Paying_date)
VALUES
    (1, N'Tiền mặt (COD)', '2026-04-01'),
    (2, N'Chuyển khoản', '2026-04-02'),
    (3, N'Ví MoMo', '2026-04-03'),
    (4, N'Tiền mặt (COD)', '2026-04-04'),
    (5, N'Chuyển khoản', '2026-04-05');

    (1, N'Tiền mặt (COD)', '2026-04-01'),
    (2, N'Chuyển khoản', '2026-04-02'),
    (3, N'Ví MoMo', '2026-04-03'),
    (4, N'Tiền mặt (COD)', '2026-04-04'),
    (5, N'Chuyển khoản', '2026-04-05');


-- 5. tblOrder (bỏ OrderID)
-- 5. tblOrder (bỏ OrderID)
INSERT INTO tblOrder
    (DeliveryMethod, InvoiceID, OrderAddress, Phone)
    (DeliveryMethod, InvoiceID, OrderAddress, Phone)
VALUES
    (N'Giao nhanh 2h', 1, N'Hà Nội', '0900000001'),
    (N'Giao tiết kiệm', 2, N'Hải Phòng', '0900000002'),
    (N'Giao hỏa tốc', 3, N'Đà Nẵng', '0900000003'),
    (N'Giao tiêu chuẩn', 4, N'TP. Hồ Chí Minh', '0900000004'),
    (N'Giao nhanh', 5, N'Cần Thơ', '0900000005');

    (N'Giao nhanh 2h', 1, N'Hà Nội', '0900000001'),
    (N'Giao tiết kiệm', 2, N'Hải Phòng', '0900000002'),
    (N'Giao hỏa tốc', 3, N'Đà Nẵng', '0900000003'),
    (N'Giao tiêu chuẩn', 4, N'TP. Hồ Chí Minh', '0900000004'),
    (N'Giao nhanh', 5, N'Cần Thơ', '0900000005');


-- 6. tblInvoiceDetail (bỏ InvoiceDetailID)
-- 6. tblInvoiceDetail (bỏ InvoiceDetailID)
INSERT INTO tblInvoiceDetail
    (InvoiceID, ProductID, Quantity)
    (InvoiceID, ProductID, Quantity)
VALUES
    (1, 1, 2),
    (2, 2, 5),
    (3, 3, 3),
    (4, 4, 4),
    (5, 5, 1);

    (1, 1, 2),
    (2, 2, 5),
    (3, 3, 3),
    (4, 4, 4),
    (5, 5, 1);


-- 7. tblCart (không có ID nên giữ nguyên)
-- 7. tblCart (không có ID nên giữ nguyên)
INSERT INTO tblCart
    (AccountID, ProductID, Quantity)
VALUES
    (1, 1, 2),
    (2, 2, 3),
    (3, 3, 1),
    (4, 4, 5),
    (5, 5, 2);


select *
from tblAccount
select *
from tblCart
select *
from tblInvoice
select *
from tblInvoiceDetail
select *
from tblOrder
select *
from tblPayment
select *
from tblProduct