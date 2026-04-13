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
CREATE DATABASE Fruitables;
GO
USE Fruitables;
GO

-- 1. Tạo bảng tblAccount
CREATE TABLE tblAccount
(
    AccountID INT PRIMARY KEY,
    Name NVARCHAR(255),
    Password VARCHAR(255),
    Address NVARCHAR(255),
    Phone VARCHAR(20),
    Role VARCHAR(50)
);

-- 2. Tạo bảng tblProduct
CREATE TABLE tblProduct
(
    ProductID INT PRIMARY KEY,
    Name NVARCHAR(255),
    Category NVARCHAR(100),
    Price DECIMAL(18, 2),
    Stock INT,
    DueDate DATE,
    Description NVARCHAR(MAX),
    Discount INT,
    Image NVARCHAR(500)
);

-- 3. Tạo bảng tblInvoice
CREATE TABLE tblInvoice
(
    InvoiceID INT PRIMARY KEY,
    AccountID INT,
    TotalPayment DECIMAL(18, 2),
    State NVARCHAR(50),
    CONSTRAINT FK_Invoice_Account FOREIGN KEY (AccountID) REFERENCES tblAccount(AccountID)
);

-- 4. Tạo bảng tblPayment
CREATE TABLE tblPayment
(
    PaymentID INT PRIMARY KEY,
    InvoiceID INT,
    Paying_method NVARCHAR(100),
    -- Sửa sang NVARCHAR
    Paying_date DATE,
    CONSTRAINT FK_Payment_Invoice FOREIGN KEY (InvoiceID) REFERENCES tblInvoice(InvoiceID)
);

-- 5. Tạo bảng tblOrder
CREATE TABLE tblOrder
(
    OrderID INT PRIMARY KEY,
    DeliveryMethod NVARCHAR(100),
    InvoiceID INT,
    Address NVARCHAR(255),
    Phone VARCHAR(20),
    CONSTRAINT FK_Order_Invoice FOREIGN KEY (InvoiceID) REFERENCES tblInvoice(InvoiceID)
);

-- 6. Tạo bảng tblInvoiceDetail
CREATE TABLE tblInvoiceDetail
(
    InvoiceDetailID INT PRIMARY KEY,
    InvoiceID INT,
    ProductID INT,
    Quantity INT,
    CONSTRAINT FK_Detail_Invoice FOREIGN KEY (InvoiceID) REFERENCES tblInvoice(InvoiceID),
    CONSTRAINT FK_Detail_Product FOREIGN KEY (ProductID) REFERENCES tblProduct(ProductID)
);

-- 7. Tạo bảng tblCart
CREATE TABLE tblCart
(
    AccountID INT,
    ProductID INT,
    Quantity INT,
    PRIMARY KEY (AccountID, ProductID),
    CONSTRAINT FK_Cart_Account FOREIGN KEY (AccountID) REFERENCES tblAccount(AccountID),
    CONSTRAINT FK_Cart_Product FOREIGN KEY (ProductID) REFERENCES tblProduct(ProductID)
);

USE Fruitables;
GO

-- 1. Chèn dữ liệu vào tblAccount
INSERT INTO tblAccount
    (AccountID, Name, Password, Address, Phone, Role)
VALUES
    (1, N'Nguyễn Văn An', '123456', N'Hà Nội', '0900000001', 'USER'),
    (2, N'Vũ Minh Hiếu', '123456', N'Hải Phòng', '0900000002', 'USER'),
    (3, N'Hoàng Đức Trọng', '123456', N'Đà Nẵng', '0900000003', 'ADMIN'),
    (4, N'Phùng Tuấn Đạt', '123456', N'TP. Hồ Chí Minh', '0900000004', 'USER'),
    (5, N'Nguyễn Duy Minh', '123456', N'Cần Thơ', '0900000005', 'USER');

-- 2. Chèn dữ liệu vào tblProduct
-- Lưu ý: Đường dẫn ảnh để dạng /static/img/... để Flask dễ nhận diện
INSERT INTO tblProduct
    (ProductID, Name, Category, Price, Stock, DueDate, Description, Discount, Image)
VALUES
    (1, N'Táo Mỹ', N'Trái cây', 50000, 100, '2026-12-31', N'Táo đỏ nhập khẩu, giòn và ngọt', 10, N'/img/products/apple.jpg'),
    (2, N'Chuối', N'Trái cây', 20000, 200, '2026-10-10', N'Chuối chín tự nhiên, không hóa chất', 5, N'/img/products/banana.jpg'),
    (3, N'Cam', N'Trái cây', 30000, 150, '2026-11-15', N'Cam sành mọng nước, nhiều vitamin C', 0, N'/img/products/orange.jpg'),
    (4, N'Cà rốt', N'Rau củ', 25000, 120, '2026-09-20', N'Cà rốt Đà Lạt tươi sạch mỗi ngày', 15, N'/img/products/carrot.jpg'),
    (5, N'Bông cải', N'Rau củ', 40000, 80, '2026-08-30', N'Bông cải xanh giàu chất xơ', 20, N'/img/products/broccoli.jpg');

-- 3. Chèn dữ liệu vào tblInvoice
INSERT INTO tblInvoice
    (InvoiceID, AccountID, TotalPayment, State)
VALUES
    (1, 1, 100000, N'Đã thanh toán'),
    (2, 2, 200000, N'Chờ xử lý'),
    (3, 3, 150000, N'Đã thanh toán'),
    (4, 4, 300000, N'Đang giao hàng'),
    (5, 5, 250000, N'Đã thanh toán');

-- 4. Chèn dữ liệu vào tblPayment
INSERT INTO tblPayment
    (PaymentID, InvoiceID, Paying_method, Paying_date)
VALUES
    (1, 1, N'Tiền mặt (COD)', '2026-04-01'),
    (2, 2, N'Chuyển khoản', '2026-04-02'),
    (3, 3, N'Ví MoMo', '2026-04-03'),
    (4, 4, N'Tiền mặt (COD)', '2026-04-04'),
    (5, 5, N'Chuyển khoản', '2026-04-05');

-- 5. Chèn dữ liệu vào tblOrder
INSERT INTO tblOrder
    (OrderID, DeliveryMethod, InvoiceID, Address, Phone)
VALUES
    (1, N'Giao nhanh 2h', 1, N'Hà Nội', '0900000001'),
    (2, N'Giao tiết kiệm', 2, N'Hải Phòng', '0900000002'),
    (3, N'Giao hỏa tốc', 3, N'Đà Nẵng', '0900000003'),
    (4, N'Giao tiêu chuẩn', 4, N'TP. Hồ Chí Minh', '0900000004'),
    (5, N'Giao nhanh', 5, N'Cần Thơ', '0900000005');

-- 6. Chèn dữ liệu vào tblInvoiceDetail
INSERT INTO tblInvoiceDetail
    (InvoiceDetailID, InvoiceID, ProductID, Quantity)
VALUES
    (1, 1, 1, 2),
    (2, 2, 2, 5),
    (3, 3, 3, 3),
    (4, 4, 4, 4),
    (5, 5, 5, 1);

-- 7. Chèn dữ liệu vào tblCart
INSERT INTO tblCart
    (AccountID, ProductID, Quantity)
VALUES
    (1, 1, 2),
    (2, 2, 3),
    (3, 3, 1),
    (4, 4, 5),
    (5, 5, 2);
select *
from tblProduct