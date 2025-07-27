const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors());

const settingDB = {  
  host: "localhost",
  database: "bookstore",
  user: "root",
  password: ""
};

const db = mysql.createPool(settingDB);

app.get("/api/books", (req, res) => {
    const sqlSelect = "SELECT books.*, authors.first_name AS author_first_name, authors.last_name AS author_last_name, categories.name AS category_name FROM books LEFT JOIN authors ON books.author_id = authors.id LEFT JOIN categories ON books.category_id = categories.id"
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});


app.post("/api/books", (req, res) => {
  const {
    title,
    isbn,
    author_id,
    category_id,
    description,
    price,
    stock_quantity,
    year_written,
    cover_image,
    book_text
  } = req.body;

  if (!title || !author_id || !category_id || !price || !stock_quantity || !book_text) {
    return res.status(400).json({ error: "Необходимо заполнить все обязательные поля (название, картинки, стоимость)" });
  }

  const sql = `INSERT INTO books (title, isbn, author_id, category_id, description, price, stock_quantity, year_written, cover_image, book_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [
      title,
      isbn || null,
      author_id,
      category_id,
      description || null,
      price,
      stock_quantity,
      year_written,
      cover_image || null,
      book_text
    ],
    (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: "Ошибка при добавлении книги" });
      }
      res.json({ success: true, travel_id: result.insertId });
    }
  );
});


app.put("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const {
    title,
    isbn,
    author_id,
    category_id,
    description,
    price,
    stock_quantity,
    cover_image,
    book_text,
    year_written
  } = req.body;

  if (!bookId || !title || !author_id || !category_id || !price || !stock_quantity) {
    return res.status(400).json({ error: "Необходимо заполнить все обязательные поля (название, картинки, стоимость)" });
  }
  const sql = `UPDATE books SET title = ?, isbn = ?, author_id = ?, category_id = ?, description = ?, price = ?, stock_quantity = ?, cover_image = ?, book_text = ?, year_written = ? WHERE id = ?`;
  db.query(
    sql,
    [
      title,
      isbn || null,
      author_id,
      category_id,
      description || null,
      price,
      stock_quantity,
      cover_image || null,
      book_text,
      year_written,
      bookId,
    ],
    (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: "Ошибка при добавлении книги" });
      }
      res.json({ success: true, travel_id: result.insertId });
    }
  );
});

app.delete("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  if (!bookId) {
    return res.status(400).json({ error: "Отсутствую обязательные поля" });
  }
  const sql = `DELETE FROM books WHERE id = ?`;
  db.query(
    sql,
    [bookId],
    (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: "Ошибка при добавлении книги" });
      }
      res.json({ success: true, travel_id: result.insertId });
    }
  );
});

app.get("/api/user_books", (req, res) => {
  const sqlSelect = "SELECT * FROM user_books";
  db.query(sqlSelect, (err, result) => {
      res.send(result);
  });
});

app.post("/api/user_books", async (req, res) => {
  const book_id = req.body.bookId;
  const is_purchased = req.body.purchased;
  const duration = req.body.duration;
  let rent_end_date = null;
  

  if(duration){
    let today = new Date(); // Создаем объект Date для текущей даты
    rent_end_date = new Date(today); // Копируем текущую дату, чтобы не изменять исходную
    if(duration == '2w'){
      rent_end_date.setDate(today.getDate() + 14); // Добавляем 14 дней (2 недели)
    }else if(duration == '1m'){
      rent_end_date.setMonth(today.getMonth() + 1); // Добавляем 1 месяц
    }else if(duration == '3m'){
      rent_end_date.setMonth(today.getMonth() + 3); // Добавляем 3 месяца
    }
  }

  if (!book_id || (!is_purchased && !duration)) {
    return res.status(400).json({ error: "Отсутствую обязательные поля"});
  }

  const conn = await mysqlPromise.createConnection(settingDB);

    try {
      await conn.beginTransaction();
      // Пытаемся обновить
      const [updateResult] = await conn.execute(`UPDATE user_books SET is_purchased = ?, rent_end_date = ? WHERE book_id = ?`,
        [is_purchased || 0, rent_end_date || null, book_id]
      );
      // Если не было обновлений - вставляем новую запись
      if (updateResult.affectedRows === 0) {  // const sql = `INSERT INTO user_books (book_id, is_purchased, rent_end_date) VALUES (?, ?, ?)`;
        await conn.execute(`INSERT INTO user_books (book_id, is_purchased, rent_end_date) VALUES (?, ?, ?)`,
          [book_id, is_purchased || 0, rent_end_date || null]
        );
      }
      await conn.commit();
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: "Ошибка при добавлении покупки/аренды книги" });
        throw err;
    } finally {
        conn.end();
        res.json({ success: true });
    }
});


app.get("/api/authors", (req, res) => {
  const sqlSelect = "SELECT * FROM authors";
  db.query(sqlSelect, (err, result) => {
      res.send(result);
  });
});

app.get("/api/categories", (req, res) => {
  const sqlSelect = "SELECT * FROM categories";
  db.query(sqlSelect, (err, result) => {
      res.send(result);
  });
});



app.listen(3001, () => {
    console.log('running on port 3001');
});