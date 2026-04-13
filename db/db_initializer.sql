INSERT INTO tblAccount
    (AccountID, Name, Password, Address, Phone, Role)
VALUES
    (1, 'Nguyen Van An', '123456', 'Ha Noi', '0900000001', 'USER'),
    (2, 'Vu Minh Hieu', '123456', 'Hai Phong', '0900000002', 'USER'),
    (3, 'Hoang Duc Trong', '123456', 'Da Nang', '0900000003', 'ADMIN'),
    (4, 'Phung Tuan Dat', '123456', 'HCM', '0900000004', 'USER'),
    (5, 'Nguyen Duy Minh', '123456', 'Can Tho', '0900000005', 'USER');

INSERT INTO tblProduct
    (ProductID, Name, Category, Price, Stock, DueDate, Description, Discount, Image)
VALUES
    (1, 'Táo Mỹ', 'Trái cây', 50000, 100, '2026-12-31', 'Táo nhập khẩu', 10, 'img/products/apple.jpg'),
    (2, 'Chuối', 'Trái cây', 20000, 200, '2026-10-10', 'Chuối tươi', 5, 'img/products/banana.jpg'),
    (3, 'Cam', 'Trái cây', 30000, 150, '2026-11-15', 'Cam sành', 0, 'img/products/orange.jpg'),
    (4, 'Cà rốt', 'Rau củ', 25000, 120, '2026-09-20', 'Cà rốt Đà Lạt', 15, 'img/products/carrot.jpg'),
    (5, 'Bông cải', 'Rau củ', 40000, 80, '2026-08-30', 'Bông cải xanh', 20, 'img/products/broccoli.jpg');
INSERT INTO tblInvoice
    (InvoiceID, AccountID, TotalPayment, State)
VALUES
    (1, 1, 100000, 'PAID'),
    (2, 2, 200000, 'PENDING'),
    (3, 3, 150000, 'PAID'),
    (4, 4, 300000, 'SHIPPING'),
    (5, 5, 250000, 'PAID');
INSERT INTO tblPayment
    (PaymentID, InvoiceID, Paying_method, Paying_date)
VALUES
    (1, 1, 'COD', '2026-04-01'),
    (2, 2, 'BANK', '2026-04-02'),
    (3, 3, 'MOMO', '2026-04-03'),
    (4, 4, 'COD', '2026-04-04'),
    (5, 5, 'BANK', '2026-04-05');
INSERT INTO tblOrder
    (OrderID, DeliveryMethod, InvoiceID, Address, Phone)
VALUES
    (1, 'Giao nhanh', 1, 'Ha Noi', '0900000001'),
    (2, 'Giao thường', 2, 'Hai Phong', '0900000002'),
    (3, 'Giao nhanh', 3, 'Da Nang', '0900000003'),
    (4, 'Giao tiết kiệm', 4, 'HCM', '0900000004'),
    (5, 'Giao nhanh', 5, 'Can Tho', '0900000005');
INSERT INTO tblInvoiceDetail
    (InvoiceDetailID, InvoiceID, ProductID, Quantity)
VALUES
    (1, 1, 1, 2),
    (2, 2, 2, 5),
    (3, 3, 3, 3),
    (4, 4, 4, 4),
    (5, 5, 5, 1);

INSERT INTO tblCart
    (AccountID, ProductID, Quantity)
VALUES
    (1, 1, 2),
    (2, 2, 3),
    (3, 3, 1),
    (4, 4, 5),
    (5, 5, 2);
