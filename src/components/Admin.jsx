import React, { useState, useEffect } from 'react';
import axios from 'axios';

const initialBook = {
  title: '',
  isbn: '',
  author_id: '',
  category_id: '',
  description: '',
  price: '',
  stock_quantity: '',
  year_written: '',
  cover_image: '',
  book_text: '',
};

const Admin = () => {
  const [book, setBook] = useState(initialBook);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/authors');
        setAuthors(response.data);
      } catch (err) {
        setAuthors([]);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/categories');
        setCategories(response.data);
      } catch (err) {
        setCategories([]);
      }
    };
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/books');
        setBooks(response.data);
      } catch (err) {
        setBooks([]);
      }
    };
    fetchAuthors();
    fetchCategories();
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/api/books', book);
      if (response.data.success) {
        setSuccess('Книга успешно добавлена!');
        setBook(initialBook);
        // обновить список книг
        const booksResp = await axios.get('http://localhost:3001/api/books');
        setBooks(booksResp.data);
      } else {
        setError('Ошибка при добавлении книги');
      }
    } catch (err) {
      setError('Ошибка при добавлении книги');
    } finally {
      setLoading(false);
    }
  };

  // --- Редактирование ---
  const handleEdit = (book) => {
    setEditingBook({
      ...book,
      book_text: book.book_text || ''
    });
  };
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingBook(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setSuccess('');
    setError('');
    try {
      const response = await axios.put(`http://localhost:3001/api/books/${editingBook.id}`, editingBook);
      if (response.data.success) {
        setSuccess('Книга успешно обновлена!');
        setEditingBook(null);
        // обновить список книг
        const booksResp = await axios.get('http://localhost:3001/api/books');
        setBooks(booksResp.data);
      } else {
        setError('Ошибка при обновлении книги');
      }
    } catch (err) {
      setError('Ошибка при обновлении книги');
    } finally {
      setEditLoading(false);
    }
  };
  // --- Удаление ---
  const handleDelete = async (id) => {
    if (!window.confirm('Удалить книгу?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/books/${id}`);
      setBooks(books.filter(b => b.id !== id));
    } catch {
      alert('Ошибка при удалении книги');
    }
  };
 
  return ( 
    <div className='block-books-admin mb-3'>
      <div className='add-books'>
      <h2 class="text-gray-500">Добавить книгу</h2>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <div className="mb-5">
        <label for="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Название</label>
        <input name="title" required value={book.title} onChange={handleChange} maxLength={30} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      </div>
      <div className="mb-5">
        <label for="author_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Выберите автора</label>
        <select name="author_id" required value={book.author_id} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option></option>
          {authors.map(author => (
            <option key={author.id} value={author.id}>{author.first_name} {author.last_name}</option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <label for="category_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Выберите категорию</label>
        <select name="category_id" required value={book.category_id} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option></option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <label for="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Описание</label>
        <textarea id="description" name="description" value={book.description} onChange={handleChange}  rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Введите описание..."></textarea>
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
            <label for="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Цена</label>
            <input name="price" required value={book.price} onChange={handleChange} placeholder=" " type="number" step="0.01"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div className="relative z-0 w-full mb-5 group">
            <label for="stock_quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Количество на складе</label>
            <input name="stock_quantity" required value={book.stock_quantity} onChange={handleChange} placeholder=" " className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <label for="isbn" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ISBN</label>
          <input name="isbn" value={book.isbn} onChange={handleChange} maxLength={13} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <label for="year_written" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Год написания</label>
          <input name="year_written" value={book.year_written} type="number" min="1901" max="2099"  onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        </div>
      </div>

      <div className="mb-5">
        <label for="cover_image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL обложки</label>
        <input name="cover_image" value={book.cover_image} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      </div>
      <div className="mb-5">
        <label for="book_text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Текст книги</label>
        <textarea id="book_text" name="book_text" required value={book.book_text} onChange={handleChange}  rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Введите описание..."></textarea>
      </div>

       
       
        <button type="submit" disabled={loading} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          {loading ? 'Добавление...' : 'Добавить книгу'}
        </button>
        
        {success && <div style={{color:'green',marginTop:8}}>{success}</div>}
        {error && <div style={{color:'red',marginTop:8}}>{error}</div>}
      </form>
      </div>
      <div class="edit-books">
      <h2 class="text-gray-500">Список книг</h2>
      <ul style={{maxWidth:700}} className=''>
        {books.map(b => (
          <li key={b.id} className='block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-white mb-2'>
             <b>{b.title}</b>
            <button style={{marginLeft:12}} onClick={() => handleEdit(b)}>Редактировать</button>
            <button style={{marginLeft:8}} onClick={() => handleDelete(b.id)}>Удалить</button>
          </li>
        ))}
      </ul>

      {editingBook && (
        <form onSubmit={handleUpdate} style={{ maxWidth: 500, marginTop: 24, background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
          <h3>Редактировать книгу</h3>
          <input name="title" value={editingBook.title} onChange={handleEditChange} placeholder="Название" required style={{width:'100%',marginBottom:8}} />
          <input name="isbn" value={editingBook.isbn} onChange={handleEditChange} placeholder="ISBN" maxLength={13} style={{width:'100%',marginBottom:8}} />
          <select name="author_id" value={editingBook.author_id} onChange={handleEditChange} required style={{width:'100%',marginBottom:8}}>
            <option value="">Выберите автора</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>{author.first_name} {author.last_name}</option>
            ))}
          </select>
          <select name="category_id" value={editingBook.category_id} onChange={handleEditChange} required style={{width:'100%',marginBottom:8}}>
            <option value="">Выберите категорию</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <textarea name="description" value={editingBook.description} onChange={handleEditChange} placeholder="Описание" style={{width:'100%',marginBottom:8}} />
          <input name="price" value={editingBook.price} onChange={handleEditChange} placeholder="Цена" type="number" step="0.01" style={{width:'100%',marginBottom:8}} />
          <input name="stock_quantity" value={editingBook.stock_quantity} onChange={handleEditChange} placeholder="Количество на складе" type="number" style={{width:'100%',marginBottom:8}} />
          <input name="year_written" type="number" min="1901" max="2099" value={editingBook.year_written || ''} onChange={handleEditChange} placeholder="Год написания" style={{width:'100%',marginBottom:8}} />
          <input name="cover_image" value={editingBook.cover_image} onChange={handleEditChange} placeholder="URL обложки" style={{width:'100%',marginBottom:8}} />
          <textarea name="book_text" value={editingBook.book_text || ''} onChange={handleEditChange} placeholder="Текст книги" style={{width:'100%',marginBottom:8, minHeight: 120}} />
          <div style={{margin: 'auto'}}>
            <button type="submit" disabled={editLoading} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              {editLoading ? 'Сохранение...' : 'Сохранить изменения'}
           </button>
           <button type="button" onClick={() => setEditingBook(null)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-3">Отмена</button>
          </div>
        </form>
      )}
      
    </div>
    </div>
  );
};

export default Admin; 