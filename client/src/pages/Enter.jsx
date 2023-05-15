import React, {useState} from 'react';
import { Link } from 'react-router-dom'
import InputRegister from '../components/InputRegister';
import ButtonRegister from '../components/ButtonRegister';

function Enter() {

  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')

  const [errorMail, setErrorMail] = useState('none')
  const [errorPassword, setErrorPassword] = useState('none')

  const [colorErrorMail, setColorErrorMail] = useState('')
  const [colorErrorPassword, setColorErrorPassword] = useState('')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^[0-9a-zA-Z]{8,}$/;

  const checkData = async () => {
    setErrorMail('none')
    setErrorPassword('none')
    setColorErrorMail('')
    setColorErrorPassword('')
    if (!emailRegex.test(mail)) {
      setColorErrorMail('#ff0000')
      setErrorMail('block')
    } else if (!passwordRegex.test(password)) {
      setColorErrorPassword('#ff0000')
      setErrorPassword('block')
    } else {
      
      const response = await fetch('/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: mail,
          password
        })
      });
      const responseData = await response.json();
      
      if (responseData.errorMassage) {
        alert(responseData.errorMassage)
      } else {
        localStorage.setItem('userId', responseData);
        window.location.reload();
      }
      
    }
  }

  return (
    <div className="enterPage container">
      <h1 className="enterPage_title">Войти</h1>
      <InputRegister 
        placeholder='Ваш email' 
        value={mail} 
        onChange={e => setMail(e.target.value)}
        style={{borderBottom: `1px solid ${colorErrorMail}`}}
      />
      <p 
        className='error__input' 
        style={{ display: errorMail }}
      >
        Неверный email
      </p>
      <InputRegister 
        type='password' 
        placeholder='Пароль' 
        value={password} 
        onChange={e => setPassword(e.target.value)}  
        style={{borderBottom: `1px solid ${colorErrorPassword}`}}
      />
      <p 
        className='error__input' 
        style={{ display: errorPassword }}
      >
        Пароль должен содержать минимум 8 символов
      </p>
      <div className="enter__buttons">
        <ButtonRegister onClick={checkData}>
          Войти
        </ButtonRegister>
        <Link to="/register" className="enter__register">Зарегистрироваться</Link>
      </div>
    </div>
  );
}

export default Enter;