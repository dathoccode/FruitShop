from ast import keyword
import secrets
import pyodbc
from functools import wraps
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

cn_str = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=ADMIN-PC;DATABASE=Fruitables;Trusted_Connection=yes;MARS_Connection=yes'
conn = pyodbc.connect(cn_str, autocommit=True)
tokens = {}  # Lưu trữ token và AccountID tương ứng

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        
        auth = request.headers.get("Authorization")
        if not auth:
            return jsonify({"error":"Missing token"}),401

        parts = auth.split(" ")
        if len(parts) != 2:
            return jsonify({"error":"Invalid token format"}),401

        token = parts[1]

        if token not in tokens:
            return jsonify({"error":"Invalid token"}),401

        request.account_id = tokens[token]

        return f(*args, **kwargs)

    return decorated

@app.route("/register", methods=["POST"])
def register_api():
    cursor = None
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        phone = data.get("phone")
        address = data.get("address")

        cursor = conn.cursor()
        
        # 1. Kiểm tra trùng (Dùng COUNT cho nhanh)
        cursor.execute("SELECT COUNT(*) FROM tblAccount WHERE UserName = ?", (username,))
        if cursor.fetchone()[0] > 0:
            return jsonify({"error": "Tên người dùng đã tồn tại"}), 409

        # 2. Thêm tài khoản
        cursor.execute(
            "INSERT INTO tblAccount (UserName, Passwd, UserAddress, Phone, AccountRole) VALUES (?, ?, ?, ?, 'USER')",
            (username, password, address, phone)
        )
        conn.commit() # Bắt buộc phải commit để lưu vào DB

        # 3. Lấy lại AccountID vừa tự tăng
        cursor.execute("SELECT AccountID FROM tblAccount WHERE UserName = ?", (username,))
        row = cursor.fetchone()
        
        if row:
            account_id = row[0]
            token = secrets.token_hex(32)
            tokens[token] = account_id
            return jsonify({
                "message": "register success",
                "token": token,
                "accountID": account_id,
                "user": username
            })
        
        return jsonify({"error": "Lỗi lấy dữ liệu sau đăng ký"}), 500

    except Exception as e:
        print(f"LỖI SQL CHI TIẾT: {e}") 
        if conn: conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close() 
        
# API Đăng nhập
@app.route("/login", methods=["POST"])
def login_api(): 
    data = request.get_json(force=True)
    username = data.get("username")
    password = data.get("password")

    #kiểm tra xem tài khoản mật khẩu có đúng không
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT AccountID, UserName FROM tblAccount WHERE UserName = ? AND Passwd = ?",
            (username, password)
        )
        row = cursor.fetchone()

    if not row:
        return jsonify({"error": "Sai tài khoản hoặc mật khẩu"}), 401


    token = secrets.token_hex(32)
    accountID = row[0]

    # cập nhật token nếu tài khoản đang đăng nhập, nếu chưa thì thêm token hiện tại vào.
    with conn.cursor() as cursor:
        cursor.execute(
            """
            IF EXISTS (SELECT 1 FROM tblToken WHERE AccountID = ?)
                UPDATE tblToken SET token = ? WHERE AccountID = ?
            ELSE
                INSERT INTO tblToken (token, AccountID) VALUES (?, ?)
            """,
            (accountID, token, accountID, token, accountID)
        )
        cursor.commit()

    tokens[token] = accountID
    return jsonify({
        "message": "login success",
        "token": token,
        "accountID": row[0],
        "user": row[1]
    })

# đăng xuất
@app.route("/logout", methods=["POST"])
@token_required
def logout():

    auth = request.headers.get("Authorization")
    token = auth.split(" ")[1]

    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM tblToken WHERE Token=?",
        (token,)
    )

    conn.commit()
    cursor.close()

    return jsonify({"message": "Logged out"})

@app.route("/account/getInfor", methods=["GET"])
@token_required
def get_info():
    id = request.account_id

    cursor = conn.cursor()
    cursor.execute("""
        SELECT AccountID, UserName, Passwd, UserAddress, Phone, AccountRole 
        FROM tblAccount WHERE AccountID = ?
        """, (id,)
    )

    row = cursor.fetchone()
    
    if row:
        return jsonify({
            "id": row[0],
            "name": row[1],
            "password": row[2],
            "address": row[3],
            "phone": row[4],
            "role": row[5]
        })
    
    conn.commit()
    cursor.close()

@app.route("/product/getAllProduct", methods=["GET"])
def get_all_products():
    # Sử dụng 'with' để tự động đóng cursor khi lấy xong dữ liệu
    with conn.cursor() as cursor:
        cursor.execute("SELECT ProductID, ProductName, Category, Price, Stock, Descript, Discount, ProductImage FROM tblProduct")
        rows = cursor.fetchmany(100)
        
    result = []
    for row in rows:
        result.append({
            "ProductID": row[0], "ProductName": row[1], "Category": row[2],
            "Price": float(row[3]), "Stock": row[4], "Descript": row[5],
            "Discount": row[6], "ProductImage": row[7]
        })
    return jsonify(result)

@app.route('/cart/add', methods=['POST'])
def add_to_cart():
    data = request.json
    acc_id = data.get('account_id')
    prod_id = data.get('product_id')
    
    cursor = conn.cursor()
    # Kiểm tra tồn tại để Tăng số lượng hoặc Thêm mới
    sql = """
    IF EXISTS (SELECT * FROM tblCart WHERE AccountID=? AND ProductID=?)
        UPDATE tblCart SET Quantity = Quantity + 1 WHERE AccountID=? AND ProductID=?
    ELSE
        INSERT INTO tblCart (AccountID, ProductID, Quantity) VALUES (?, ?, 1)
    """
    cursor.execute(sql, (acc_id, prod_id, acc_id, prod_id, acc_id, prod_id))
    conn.commit()
    return jsonify({"message": "Success"})

@app.route("/cart/getByUserId/<int:acc_id>", methods=["GET"])
def get_cart_items(acc_id):
    cursor = conn.cursor()
    query = """
    SELECT c.ProductID, p.ProductName, p.Price, p.ProductImage, c.Quantity
    FROM tblCart c
    JOIN tblProduct p ON c.ProductID = p.ProductID
    WHERE c.AccountID = ?
    """
    cursor.execute(query, (acc_id,))
    rows = cursor.fetchmany(100)
    cart = [{"ProductID": r[0], "ProductName": r[1], "Price": float(r[2]), "ProductImage": r[3], "Quantity": r[4]} for r in rows]
    return jsonify(cart)

@app.route("/cart/getProductAmount", methods=["GET"])
@token_required
def get_amount_by_id():

    id = request.account_id
    cursor = conn.cursor()
    cursor.execute("SELECT SUM(Quantity) FROM tblCart WHERE AccountID = ?", (id,))
    row = cursor.fetchone()

    amount = row[0] if row[0] is not None else 0

    cursor.close()

    return jsonify({"amount": amount}), 200

@app.route("/cart/remove", methods=["POST"])
def remove_cart():
    data = request.json
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tblCart WHERE AccountID=? AND ProductID=?", 
                  (data.get('account_id'), data.get('product_id')))
    conn.commit()
    return jsonify({"message": "Deleted"})

# 4. API Cập nhật số lượng (Dùng cho nút + / - trong cart.js)
@app.route('/cart/update', methods=['POST'])
def update_cart_quantity():
    data = request.json
    acc_id = data.get('account_id')
    prod_id = data.get('product_id')
    change = data.get('change') # +1 hoặc -1

    try:
        cursor = conn.cursor()
       
        cursor.execute("""
            UPDATE tblCart 
            SET Quantity = Quantity + ? 
            WHERE AccountID = ? AND ProductID = ?
        """, (change, acc_id, prod_id))
        
        # Xóa sản phẩm nếu Quantity <= 0 sau khi cập nhật
        cursor.execute("DELETE FROM tblCart WHERE AccountID = ? AND ProductID = ? AND Quantity <= 0", (acc_id, prod_id))
        
        conn.commit()
        return jsonify({"message": "Updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route("/product/search", methods=["GET"])
def search_products():
    keyword = request.args.get('keyword', '')
    with conn.cursor() as cursor:
        sql = """
    SELECT ProductID, ProductName, Category, Price, Stock, Descript, Discount, ProductImage 
    FROM tblProduct 
    WHERE ProductName COLLATE Latin1_General_CI_AI LIKE ?
    ORDER BY 
        CASE 
            WHEN ProductName LIKE ? THEN 1 -- Khớp chính xác cả dấu (Cà -> Cà rốt)
            WHEN ProductName COLLATE Latin1_General_CI_AI LIKE ? THEN 2 -- Khớp không dấu (Ca -> Cà rốt)
            ELSE 3 
        END, ProductName
"""
# Truyền keyword vào 3 lần cho 3 dấu hỏi chấm
        cursor.execute(sql, ('%' + keyword + '%', '%' + keyword + '%', '%' + keyword + '%'))
        rows = cursor.fetchall()
        
    result = [{"ProductID": r[0], "ProductName": r[1], "Category": r[2], 
               "Price": float(r[3]), "Stock": r[4], "Descript": r[5], 
               "Discount": r[6], "ProductImage": r[7]} for r in rows]
    return jsonify(result)
# 2. API Lọc sản phẩm theo danh mục (Category)
@app.route("/product/category/<category_name>", methods=["GET"])
def get_products_by_category(category_name):
    with conn.cursor() as cursor:
        cursor.execute("SELECT ProductID, ProductName, Category, Price, Stock, Descript, Discount, ProductImage FROM tblProduct WHERE Category = ?", (category_name,))
        rows = cursor.fetchall()
        
    result = [{"ProductID": r[0], "ProductName": r[1], "Category": r[2], "Price": float(r[3]), "Stock": r[4], "Descript": r[5], "Discount": r[6], "ProductImage": r[7]} for r in rows]
    return jsonify(result)
# API lấy 10 sản phẩm bán chạy nhất (Dựa trên tiêu chí sắp cháy hàng)
@app.route("/product/bestseller", methods=["GET"])
def get_best_sellers():
    with conn.cursor() as cursor:
        # Lấy Top 10 sản phẩm có tồn kho ít nhất (ASC = Tăng dần)
        cursor.execute("""
            SELECT TOP 10 ProductID, ProductName, Category, Price, Stock, Descript, Discount, ProductImage 
            FROM tblProduct 
            WHERE Stock > 0 -- Có thể thêm điều kiện này để không lấy các sản phẩm đã hết sạch (Stock = 0)
            ORDER BY Stock ASC
        """)
        rows = cursor.fetchall()
        
    result = []
    for r in rows:
        result.append({
            "ProductID": r[0], 
            "ProductName": r[1], 
            "Category": r[2], 
            "Price": float(r[3]), 
            "Stock": r[4], 
            "Descript": r[5], 
            "Discount": r[6], 
            "ProductImage": r[7]
        })
    return jsonify(result)
    
if __name__ == "__main__":
    app.run(port=5000, debug=True)