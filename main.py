import secrets
import pyodbc
import flask
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)

cn_str = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=ADMIN-PC;DATABASE=Fruitables;Trusted_Connection=yes'
conn = pyodbc.connect(cn_str)

# account management
@app.route("/templates/login")
def login_page():
    return flask.render_template("login.html")

@app.route("/")
def home():
    return flask.render_template("index.html")

@app.route("/login", methods=["POST"])
def login():
    data = flask.request.get_json(force=True)

    username = data.get("Phone")
    password = data.get("password")

    cursor = conn.cursor()
    cursor.execute(
        "select * from tblAccount where AccountID = ? and Password = ?",
        (username, password)
    )

    row = cursor.fetchone()

    if not row:
        return flask.jsonify({"error": "Sai tài khoản"}), 401

    token = secrets.token_hex(32)

    return flask.jsonify({
        "message": "login success",
        "token": token,
        "user": row[0]
    })
# API lấy danh sách sản phẩm cho file shop.js của bạn
# API lấy danh sách sản phẩm
@app.route("/api/products", methods=["GET"])
def get_products():
    cursor = conn.cursor()
    # Bổ sung thêm Stock và Discount vào câu query
    cursor.execute("SELECT ProductID, Name, Category, Price, Stock, Description, Discount, Image FROM tblProduct")
    
    rows = cursor.fetchall()
    result = []
    for row in rows:
        result.append({
            "ProductID": row[0],
            "Name": row[1],
            "Category": row[2],
            "Price": float(row[3]), 
            "Stock": row[4], 
            "Description": row[5],
            "Discount": row[6],    
            "Image": row[7]
        })
    return flask.jsonify(result)
if __name__ == "__main__":
    app.run(port=5000)

