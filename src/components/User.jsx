import React, { useState, useEffect } from 'react';
import axios from 'axios';

const User = () => {
  const [books, setBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortCategory, setSortCategory] = useState('');
  const [sortAuthor, setSortAuthor] = useState('');
  const [sortYear, setSortYear] = useState('');
  const [rentingBookId, setRentingBookId] = useState(null);
  const [rentDuration, setRentDuration] = useState('2w');
  const [actionMessage, setActionMessage] = useState('');
  const [readingBook, setReadingBook] = useState(null); // для показа текста книги

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/books');
      setBooks(response.data);
    } catch (err) {
      setError('Ошибка при загрузке книг');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/user_books`);
      setUserBooks(response.data);
    } catch (err) {
      // обработка ошибки
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchUserBooks();
  }, []);



  // Получаем уникальные значения для селектов
  // Категории с названиями
  const categories = Array.from(
    new Map(
      books
        .filter(b => b.category_id && b.category_name)
        .map(b => [b.category_id, { id: b.category_id, name: b.category_name }])
    ).values()
  );
  // Авторы с именем и фамилией
  const authors = Array.from(
    new Map(
      books
        .filter(b => b.author_id && b.author_first_name && b.author_last_name)
        .map(b => [b.author_id, { id: b.author_id, name: `${b.author_first_name} ${b.author_last_name}` }])
    ).values()
  );
  const years = Array.from(new Set(books.map(b => b.year_written ? Number(b.year_written) : null)))
    .filter(Boolean)
    .sort((a, b) => b - a); // сортировка по убыванию

  // Фильтрация и сортировка
  let filteredBooks = books;
  if (sortCategory) filteredBooks = filteredBooks.filter(b => b.category_id == sortCategory);
  if (sortAuthor) filteredBooks = filteredBooks.filter(b => b.author_id == sortAuthor);
  if (sortYear) filteredBooks = filteredBooks.filter(b => b.year_written && Number(b.year_written) === Number(sortYear));

  const handleBuyAndRent = async (bookId,type) => {
    let data = '';
    let messageSuccess = '';
    let messageError = '';

    if(type == 'buy'){
      data = {purchased: true};
      messageSuccess = 'Книга успешно куплена!';
      messageError = 'Ошибка при покупке книги';
    }

    if(type == 'rent'){
      data = {duration: rentDuration};
      messageSuccess = 'Книга успешно арендована!';
      messageError = 'Ошибка при аренде книги';
    }

    setActionMessage('');
    try {
      const response = await axios.post('http://localhost:3001/api/user_books', { bookId, ...data });
      if (response.data.success) {
          setActionMessage(messageSuccess);
          fetchUserBooks();
      } else {
        setActionMessage(messageError);
      }
    } catch {
      setActionMessage(messageError);
    }
  };

  const getBookStatus = (bookId) => {
    const record = userBooks.find(ub => ub.book_id === bookId && (ub.is_purchased === 1 || (ub.is_purchased === 0 && ub.rent_end_date)));
    if (!record) return null;
    if (record.is_purchased) return 'Куплена';
    if (record.rent_end_date) {
      const end = new Date(record.rent_end_date);
      const now = new Date();
      if (end < now) {
        return 'Срок аренды истёк';
      } else {
        return `Арендована до ${end.toLocaleDateString()}`;
      }
    }
    return null;
  };

  return (
    <div>
      {loading && <div>Загрузка книг...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}
      {actionMessage && <div style={{color:'green',marginBottom:8}}>{actionMessage}</div>}
      {!loading && !error && (
        <>
          <div className="sorts-books w-full px-3" style={{marginBottom:16}}>
            <label>
              Категория:
              <select value={sortCategory} onChange={e => setSortCategory(e.target.value)} className="ml-2 mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="">Все</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </label>
            <label>
              Автор:
              <select value={sortAuthor} onChange={e => setSortAuthor(e.target.value)} className="ml-2 mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="">Все</option>
                {authors.map(auth => <option key={auth.id} value={auth.id}>{auth.name}</option>)}
              </select>
            </label>
            <label>
              Год:
              <select value={sortYear} onChange={e => setSortYear(e.target.value)} className="ml-2 mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="">Все</option>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
          </div>
          <div className='books-list'>
            {filteredBooks.map(book => {
              const status = getBookStatus(book.id);
              return (
                <div key={book.id} className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                  <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{book.title}</div>
                  {book.description && <div className="font-normal text-gray-700 dark:text-gray-400">{book.description}</div>}
                  {book.year_written && <div className="text-xs text-gray-700 dark:text-gray-400">Год выпуска: {book.year_written}</div>}
                  <div style={{width:120,height:200}}><img src={book.cover_image} className="py-4" style={{height:'100%',objectFit:'cover'}}/></div>
                  {book.price && <div className="text-xs text-gray-700 dark:text-gray-400 mb-2">Цена покупки: {book.price}</div>}
                  {(status && status != 'Срок аренды истёк') && (
                    <>
                      <span style={{marginRight:8, color: 'green'}}>{status}</span>
                      {book.book_text && (
                        <button className='focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900' onClick={() => setReadingBook(book)}>
                          Читать
                        </button>
                      )}
                    </>
                  )}
                  {(!status || status == 'Срок аренды истёк') && (
                    <>
 
                      <button onClick={() => handleBuyAndRent(book.id,'buy')} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Купить</button>
                      <button onClick={() => setRentingBookId(book.id)} className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Арендовать</button>
                      {rentingBookId === book.id && (
                        <span style={{marginLeft:8}}>
                          <select value={rentDuration} onChange={e => setRentDuration(e.target.value)} style={{marginRight:8}}>
                            <option value="2w">2 недели</option>
                            <option value="1m">1 месяц</option>
                            <option value="3m">3 месяца</option>
                          </select>
                          <button onClick={() => handleBuyAndRent(book.id,'rent')}>Подтвердить аренду</button>
                          <button style={{marginLeft:4}} onClick={() => setRentingBookId(null)}>Отмена</button>
                        </span>
                      )}
                      {(status == 'Срок аренды истёк' &&(<div className="text-xs" style={{color:'red'}}>{status}</div>))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
          {/* Модальное окно для чтения книги */}
          {readingBook && (
            <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{background:'#fff',padding:24,maxWidth:700,maxHeight:'80vh',overflowY:'auto',borderRadius:8,position:'relative'}}>
                <button onClick={() => setReadingBook(null)} style={{position:'absolute',top:8,right:8}}>Закрыть</button>
                <h2 style={{marginBottom:16}}>{readingBook.title}</h2>
                <div style={{whiteSpace:'pre-wrap',fontSize:18,lineHeight:1.6}}>{readingBook.book_text}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default User; 