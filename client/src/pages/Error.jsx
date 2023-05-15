import React from 'react';
import Header from '../components/Header';

function Error() {

  return (
    <div style={{ width: '100%' }}>
      <Header prev={false} title='  ' />
      <div className="container errorPage marginHeader">
        <p className="errorPage__topRow">
          Ошибка
        </p>
        <p className="errorPage__middleRow">
          404
        </p>
        <p className="errorPage__bottomRow">
          Страница не найдена
        </p>
      </div>
    </div>
  );
}

export default Error;