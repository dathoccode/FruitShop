import secrets
import pyodbc
import flask 
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)

cn_str = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=DATPHUNG;DATABASE=Fruitables;Trusted_Connection=yes'
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

    username = data.get("username")
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
if __name__ == "__main__":
    app.run(port=5000)