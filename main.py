import secrets
import pyodbc
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

cn_str = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=ADMIN-PC;DATABASE=Fruitables;Trusted_Connection=yes'
conn = pyodbc.connect(cn_str, autocommit=True)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    username = data.get("username")
    password = data.get("password")

    cursor = conn.cursor()
    cursor.execute(
        "SELECT AccountID, UserName FROM tblAccount WHERE UserName = ? AND Passwd = ?",
        (username, password)
    )
    row = cursor.fetchone()

    if not row:
        return jsonify({"error": "Sai tài khoản hoặc mật khẩu"}), 401

    token = secrets.token_hex(32)
    return jsonify({
        "message": "login success",
        "token": token,
        "accountID": row[0],
        "user": row[1]
    })
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
    # JOIN với bảng sản phẩm để lấy thông tin hiển thị
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

@app.route("/cart/remove", methods=["POST"])
def remove_cart():
    data = request.json
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tblCart WHERE AccountID=? AND ProductID=?", 
                  (data.get('account_id'), data.get('product_id')))
    conn.commit()
    return jsonify({"message": "Deleted"})
# # 4. API Cập nhật số lượng (Dùng cho nút + / - trong cart.js)
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
    
if __name__ == "__main__":
    app.run(port=5000, debug=True)