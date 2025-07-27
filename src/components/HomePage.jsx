import React, { useState } from 'react';
import Admin from './Admin';
import User from './User';

const HomePage = () => {
  const [selectedInterface, setSelectedInterface] = useState(() => {
    return localStorage.getItem('role') || null;
  });

  const handleInterfaceSelect = (interfaceType) => {
    setSelectedInterface(interfaceType);
    localStorage.setItem('role', interfaceType);
  };

  const handleLogout = () => {
    setSelectedInterface(null);
    localStorage.removeItem('role');
  };

  if (selectedInterface === 'admin') {
    return (
      <div>
        <div className="w-full px-3 py-3 mx-auto lg:flex max-w-8xl lg:px-3 items-baseline">
          <button type="button" onClick={handleLogout} className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Выйти</button>
          <div className="text-gray-500 md:text-lg dark:text-gray-400">Вы зашли как администратор</div>
        </div>
        <Admin />
      </div>
    );
  }

  if (selectedInterface === 'user') {
    return (
      <div> 
        <div className="w-full px-3 py-3 mx-auto lg:flex max-w-8xl lg:px-3 items-baseline"> 
          <button type="button" onClick={handleLogout} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Выйти</button>
          <div className="text-gray-500 md:text-lg dark:text-gray-400">Вы зашли как гость</div>
        </div> 
        <User />
      </div>
    );
  }

  return (
  <div>
    <div className="mb-4 text-4xl font-bold tracking-tight text-gray-900 lg:font-extrabold lg:text-6xl lg:leading-none dark:text-white lg:text-center xl:px-36 lg:mb-7">
      <h1>Добро пожаловать в книжный магазин</h1>
    </div>
    <div className="max-w-lg mx-auto mt-10">
      <div className="flex justify-center gap-4 mt-10">
        <div className="text-center p-4">
          <div className="card-icon text-4xl mb-2 text-yellow-400 hover:text-yellow-500 transition-colors duration-300">👨‍💼</div>
          <button className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900" onClick={() => handleInterfaceSelect('admin')}>Войти как администратор</button>
        </div>
        
        <div className="text-center p-4">
          <div className="card-icon text-4xl mb-2 text-yellow-400 hover:text-yellow-500 transition-colors duration-300">👤</div>
          <button className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={() => handleInterfaceSelect('user')}>Войти как пользователь</button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default HomePage; 