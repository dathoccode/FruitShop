
CREATE DATABASE Fruitables;
GO
USE Fruitables;
GO

-- 1. Tạo bảng tblAccount
CREATE TABLE tblAccount
(
    AccountID INT PRIMARY KEY IDENTITY(1,1),
    UserName NVARCHAR(255),
    Passwd VARCHAR(255),
    UserAddress NVARCHAR(255),
    Phone VARCHAR(20),
    AccountRole VARCHAR(50)
);

-- 2. Tạo bảng tblProduct
CREATE TABLE tblProduct
(
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(255),
    Category NVARCHAR(100),
    Price DECIMAL(18, 2),
    Stock INT,
    DueDate DATE,
    Descript NVARCHAR(MAX),
    Discount INT,
    ProductImage NVARCHAR(500)
);

-- 3. Tạo bảng tblInvoice
CREATE TABLE tblInvoice
(
    InvoiceID INT PRIMARY KEY IDENTITY(1,1),
    AccountID INT,
    TotalPayment DECIMAL(18, 2),
    InvoiceState NVARCHAR(50),
    CONSTRAINT FK_Invoice_Account FOREIGN KEY (AccountID) REFERENCES tblAccount(AccountID)
);

-- 4. Tạo bảng tblPayment
CREATE TABLE tblPayment
(
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    InvoiceID INT,
    Paying_method NVARCHAR(100),
    Paying_date DATE,
    CONSTRAINT FK_Payment_Invoice FOREIGN KEY (InvoiceID) REFERENCES tblInvoice(InvoiceID)
);

-- 5. Tạo bảng tblOrder
CREATE TABLE tblOrder
(
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    DeliveryMethod NVARCHAR(100),
    InvoiceID INT,
    OrderAddress NVARCHAR(255),
    Phone VARCHAR(20),
    CONSTRAINT FK_Order_Invoice FOREIGN KEY (InvoiceID) REFERENCES tblInvoice(InvoiceID)
);

-- 6. Tạo bảng tblInvoiceDetail
CREATE TABLE tblInvoiceDetail
(
    InvoiceDetailID INT PRIMARY KEY IDENTITY(1,1),
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