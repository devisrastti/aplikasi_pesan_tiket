const express = require("express");
const app = express();
const port = 3003;
const API = "192.168.164.188";
// const API = "192.168.0.122";
const db = require("./koneksi");
const response = require("./response");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { CoreApi } = require("midtrans-client");
const coreApi = new CoreApi({
  isProduction: false, // Set true jika ingin menggunakan mode production
  serverKey: "SB-Mid-server-BGYfA4SBqkbbDqAgycBbBqIB",
  clientKey: "SB-Mid-client-LAESY4DvSHanXr5C",
});
const midtransClient = require("midtrans-client");
const socketIO = require("socket.io");
const http = require("http");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3003 });

wss.on("connection", (ws) => {
  console.log("WebSocket connected");

  ws.on("message", (message) => {
    // Handle received message
    console.log("Received message:", message);

    // Simulate sending updates back to the client
    setInterval(() => {
      ws.send(JSON.stringify({ status: "Pembayaran berhasil" }));
    }, 15000);
  });

  ws.on("close", () => {
    console.log("WebSocket disconnected");
  });
});

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://192.168.107.188:3003',
    methods: ['GET', 'POST'],
  },
});


io.on("connection", (socket) => {
  console.log("A client connected");

  //
  socket.on("fetchDataSuccess", (data) => {
    console.log("Fetch data success event received:", data);
   
    io.emit("newOrder", data);
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const checkQuery = "SELECT * FROM auth WHERE email = ? AND password = ?";
  const updateStatusQuery =
    "UPDATE auth SET status = 1 WHERE email = ? AND password = ?";

  db.query(checkQuery, [email, password], (error, results) => {
    if (error) {
      response(500, null, "Internal Server Error", res);
    } else {
      if (results.length === 0) {
        response(401, null, "Username or password is incorrect", res);
      } else {
        const user = results[0];
        db.query(
          updateStatusQuery,
          [email, password],
          (error, updateResult) => {
            if (error) {
              response(500, null, "Failed to update user status", res);
            } else {
              response(200, user, "Login successful", res);
            }
          }
        );
      }
    }
  });
});

app.post("/logout", (req, res) => {
  const { userId } = req.body;
  const updateQuery = "UPDATE auth SET status = 0 WHERE id = ?";
  db.query(updateQuery, [userId], (error, results) => {
    if (error) {
      console.log("Error updating user status:", error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Logout successful" });
    }
  });
});

app.post("/del-notif", (req, res) => {
  const { userId } = req.body;
  const updateQuery = "UPDATE pesanan SET status = 0 WHERE email = ?";
  db.query(updateQuery, [userId], (error, results) => {
    if (error) {
      console.log("Error updating user status:", error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Logout successful" });
    }
  });
});

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const checkQuery = "SELECT * FROM auth WHERE email = ?";
  db.query(checkQuery, [email], (error, results) => {
    if (error) {
      response(500, null, "Internal Server Error", res);
    } else {
      if (results.length > 0) {
        response(400, null, "Email already exists", res);
      } else {
        const insertQuery =
          "INSERT INTO auth (username, email, password) VALUES (?, ?, ?)";
        db.query(insertQuery, [username, email, password], (error, results) => {
          if (error) {
            response(500, null, "Internal Server Error", res);
          } else {
            response(200, null, "Registration Berhasil", res);
          }
        });
      }
    }
  });
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "putrabahari1006@gmail.com",
      pass: "taletpsmoesjdjfq",
    },
  });

  const generateResetToken = () => {
    const token = crypto.randomBytes(3).toString("hex");
    return token;
  };

  try {
    const resetToken = generateResetToken();
    console.log(resetToken);

    const insertTokenQuery = `INSERT INTO token (email, token) VALUES (?, ?)`;
    const insertTokenValues = [email, resetToken];

    const mailOptions = {
      from: "putrabahari1006@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `Halo,
    
    Anda telah meminta untuk mereset password Anda. Gunakan token berikut untuk mereset password:
    
    Token: 
    ${resetToken}
    
    Jika Anda tidak melakukan permintaan ini, silakan abaikan email ini.
    
    Salam,
    Terima Kasih`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent");

    db.query(insertTokenQuery, insertTokenValues, (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete("/delete-token", (req, res) => {
  const { email } = req.body;
  const deleteTokenQuery = `DELETE FROM token WHERE email = ?`;
  const deleteTokenValues = [email];

  db.query(deleteTokenQuery, deleteTokenValues, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

app.post("/verify-token", (req, res) => {
  const { token, email } = req.body;
  const verifyTokenQuery = `SELECT * FROM token WHERE token = ? AND email = ?`;
  const verifyTokenValues = [token, email];

  db.query(verifyTokenQuery, verifyTokenValues, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      if (results.length > 0) {
        res.sendStatus(200);
      } else {
        res.sendStatus(400);
      }
    }
  });
});

app.post("/update-password", (req, res) => {
  const { email, password } = req.body;
  const updatePasswordQuery = "UPDATE auth SET password = ? WHERE email = ?";
  const updatePasswordValues = [password, email];

  db.query(updatePasswordQuery, updatePasswordValues, (error, results) => {
    if (error) {
      console.error("Error updating password:", error);
      res.sendStatus(500);
    } else {
      console.log("Password updated successfully");
      res.sendStatus(200);
    }
  });
});

app.post("/check-email", (req, res) => {
  const { email } = req.body;

  const sql = "SELECT * FROM auth WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (result.length > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  });
});
app.post("/send-message", (req, res) => {
  const {
    id_pengirim,
    id_penerima,
    pesan,
    nama_pengirim,
    nama_penerima,
    status,
  } = req.body;

  const insertQuery =
    "INSERT INTO message (id_pengirim, id_penerima, pesan, nama_pengirim, nama_penerima , status) VALUES (?, ?, ?, ?, ?,?)";
  db.query(
    insertQuery,
    [id_pengirim, id_penerima, pesan, nama_pengirim, nama_penerima, status],
    (error, results) => {
      if (error) {
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Message sent" });
      }
    }
  );
});

app.put("/pesan/:id", (req, res) => {
  const { id } = req.params;

  const updateStatusQuery = `UPDATE message SET status = 0 WHERE id = ${id}`;
  db.query(updateStatusQuery, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

app.get("/pesan", (req, res) => {
  const getUsersQuery = "SELECT * FROM message";
  db.query(getUsersQuery, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/jadwal", (req, res) => {
  const getUsersQuery = "SELECT * FROM jadwal";
  db.query(getUsersQuery, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      res.status(200).json(results);
    }
  });
});


app.post("/pesanan", async (req, res) => {
  const { jadwalId, email, nama, noTelp, harga, jam, status } = req.body;

  if (!jadwalId || !email || !nama || !noTelp) {
    console.log("Please fill in all fields");
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: "SB-Mid-server-BGYfA4SBqkbbDqAgycBbBqIB",
    clientKey: "SB-Mid-client-LAESY4DvSHanXr5C",
  });

  const transactionDetails = {
    order_id: `ORDER_${Math.round(Math.random() * 100000)}`,
    gross_amount: harga,
    email: email,
  };

  const enabledPayments = ["credit_card", "cimb_clicks", "bca_klikbca"];

  const creditCardOptions = {
    save_card: false,
    secure: false,
  };

  const transaction = {
    transaction_details: transactionDetails,
    enabled_payments: enabledPayments,
    credit_card: creditCardOptions,
  };

  try {
    const transactionToken = await snap.createTransaction(transaction);
    const paymentToken = transactionToken.token;
    console.log("Payment token:", paymentToken);

    const paymentData = {
      payment_type: "gopay",
      transaction_details: transactionDetails,
      customer_details: {
        email: email,
      },
    };

    const paymentResponse = await snap.createTransaction(paymentData);
    const redirectUrl = paymentResponse.redirect_url;

    const insertOrderQuery =
      "INSERT INTO pesanan (jadwal, email, nama, no_telp, harga, jam, status , order_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      jadwalId,
      email,
      nama,
      noTelp,
      harga,
      jam,
      status,
      transactionDetails.order_id,
    ];

    db.query(insertOrderQuery, values, (error, results) => {
      if (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ error: "Error placing order" });
      }
      console.log("Order placed successfully:", results);
      // Emit the "newOrder" event to all connected clients
      io.emit("newOrder", { order_id: transactionDetails.order_id, status });
      res.status(200).json({ redirectUrl });
    });
  } catch (error) {
    console.error("Failed to create transaction:", error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});








app.post("/pesanans", async (req, res) => {
  const { jadwalId, email, nama, noTelp, harga, jam, status } = req.body;

  if (!jadwalId || !email || !nama || !noTelp) {
    console.log("Please fill in all fields");
    res.status(400).json({ error: "Please fill in all fields" });
    return;
  }

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: "SB-Mid-server-BGYfA4SBqkbbDqAgycBbBqIB",
    clientKey: "SB-Mid-client-LAESY4DvSHanXr5C",
  });

  const transactionDetails = {
    order_id: `ORDER_${Math.round(Math.random() * 100000)}`,
    gross_amount: harga,
    email: email,
  };

  const enabledPayments = ["credit_card", "cimb_clicks", "bca_klikbca"];

  const creditCardOptions = {
    save_card: false,
    secure: false,
  };

  const transaction = {
    transaction_details: transactionDetails,
    enabled_payments: enabledPayments,
    credit_card: creditCardOptions,
  };

  try {
    const transactionToken = await snap.createTransaction(transaction);
    const paymentToken = transactionToken.token;
    console.log("Payment token:", paymentToken);

    const paymentData = {
      payment_type: "gopay",
      transaction_details: transactionDetails,
      customer_details: {
        email: email,
      },
    };

    const paymentResponse = await snap.createTransaction(paymentData);
    const redirectUrl = paymentResponse.redirect_url;

    console.log("Order placed successfully");
    res.status(200).json({ redirectUrl });
  } catch (error) {
    console.error("Failed to create transaction:", error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

app.post("/sukses", (req, res) => {
  // Lakukan proses pembuatan pesanan dan pengiriman data ke Midtrans

  // Contoh pengembalian URL redirect dari Midtrans
  const redirectUrl =
    "https://app.sandbox.midtrans.com/snap/v3/redirection/e480d19f-8a2b-4b33-b4dd-f451c2d3ea46?order_id=ORDER_99983&status_code=200&transaction_status=settlement#/409";

  res.json({ redirectUrl });
});

app.post("/midtrans/notification", (req, res) => {
  const { order_id, transaction_status, transaction_id } = req.body;

  // Lakukan validasi terhadap respons Midtrans
  if (transaction_status === "settlement") {
    console.log("Payment successful for order ID:", order_id);
    console.log("Transaction ID:", transaction_id);

    // Kirim respons OK ke Midtrans
    res.sendStatus(200);
  } else {
    console.log("Payment failed for order ID:", order_id);
    console.log("Transaction ID:", transaction_id);

    // Kirim respons OK ke Midtrans
    res.sendStatus(200);
  }
});

app.get("/transaksi/:order_id", async (req, res) => {
  const order_id = req.params.order_id;

  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-BGYfA4SBqkbbDqAgycBbBqIB",
      clientKey: "SB-Mid-client-LAESY4DvSHanXr5C",
    });

    const transaction = await snap.transaction.status(order_id);
    console.log("Transaction data:", transaction);

    const email = transaction.customer_details.email;
    res.status(200).json({ email });
  } catch (error) {
    console.error("Failed to fetch transaction data:", error);
    res.status(500).json({ error: "Failed to fetch transaction data" });
  }
});

// Mendapatkan data pelanggan berdasarkan email
app.get("/customers/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const transactions = await snap.transaction.search({
      query: email,
      from: 0,
      count: 10,
    });

    const customerEmails = transactions.map(
      (transaction) => transaction.customer_details.email
    );

    const uniqueCustomerEmails = [...new Set(customerEmails)];

    console.log("Customer emails:", uniqueCustomerEmails);

    res.status(200).json({ customerEmails: uniqueCustomerEmails });
  } catch (error) {
    console.error("Failed to fetch customer data:", error);
    res.status(500).json({ error: "Failed to fetch customer data" });
  }
});

app.post("/midtrans-callback", (req, res) => {
  // Proses callback dari Midtrans di sini
  // Pastikan untuk memverifikasi signature dan memeriksa status pembayaran

  // Contoh penanganan status pembayaran
  const paymentStatus = req.body.transaction_status;
  if (paymentStatus === "capture") {
    // Pembayaran berhasil
    console.log("Payment successful");
    // Lakukan tindakan yang sesuai, seperti mengubah status pesanan atau mengirim notifikasi
  } else if (paymentStatus === "deny") {
    // Pembayaran ditolak
    console.log("Payment denied");
    // Lakukan tindakan yang sesuai
  } else if (paymentStatus === "expire") {
    // Pembayaran kadaluarsa
    console.log("Payment expired");
    // Lakukan tindakan yang sesuai
  } else if (paymentStatus === "cancel") {
    // Pembayaran dibatalkan
    console.log("Payment canceled");
    // Lakukan tindakan yang sesuai
  } else {
    // Status pembayaran lainnya
    console.log("Payment status:", paymentStatus);
    // Lakukan tindakan yang sesuai
  }

  res.sendStatus(200);
});

app.get('/pesanan', (req, res) => {
  const getUsersQuery = 'SELECT * FROM pesanan';
  db.query(getUsersQuery, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/users", (req, res) => {
  const getUsersQuery = "SELECT * FROM auth";
  db.query(getUsersQuery, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const getUserQuery = "SELECT * FROM auth WHERE id = ?";
  db.query(getUserQuery, [userId], (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      if (results.length > 0) {
        const user = results[0];
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    }
  });
});

app.listen(port, API, () => {
  console.log(`Example app listening on port ${API}:${port}`);
});