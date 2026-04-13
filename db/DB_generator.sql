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
