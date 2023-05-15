import React, {useState} from 'react';
import InputRegister from '../components/InputRegister';
import ButtonRegister from '../components/ButtonRegister';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Register() {

  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')

  const [errorName, setErrorName] = useState('none')
  const [errorSurname, setErrorSurname] = useState('none')
  const [errorMail, setErrorMail] = useState('none')
  const [errorPassword, setErrorPassword] = useState('none')
  const [errorPassword2, setErrorPassword2] = useState('none')

  const [colorErrorSurname, setColorErrorSurname] = useState('')
  const [colorErrorName, setColorErrorName] = useState('')
  const [colorErrorMail, setColorErrorMail] = useState('')
  const [colorErrorPassword, setColorErrorPassword] = useState('')
  const [colorErrorPassword2, setColorErrorPassword2] = useState('')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^[0-9a-zA-Z]{8,}$/;

  const checkData = async () => {

    setColorErrorSurname('')
    setColorErrorName('')
    setColorErrorMail('')
    setColorErrorPassword('')
    setColorErrorPassword2('')

    setErrorSurname('none')
    setErrorName('none')
    setErrorMail('none')
    setErrorPassword('none')
    setErrorPassword2('none')

    if (!surname){
      setErrorSurname('block')
      setColorErrorSurname('#ff0000')
    } else if (!name) {
      setErrorName('block')
      setColorErrorName('#ff0000')
    } else if (!emailRegex.test(mail)) {
      setErrorMail('block')
      setColorErrorMail('#ff0000')
    } else if (!passwordRegex.test(password)) {
      setErrorPassword('block')
      setColorErrorPassword('#ff0000')
    } else if (password !== password2) {
      setErrorPassword2('block')
      setColorErrorPassword2('#ff0000')
    } else {
      const data = {
        name: name,
        surname: surname,
        email: mail,
        password: password
      }
      let response = await fetch('/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      let result = await response.json();
      localStorage.setItem('userId', result);
      window.location.replace('/');
    }
  }

  return (
    <div className="enterPage container">
      <h1 className="enterPage_title">Регистрация</h1>
      <InputRegister 
        placeholder='Ваша фамилия' 
        value={surname}
        onChange={e => setSurname(e.target.value)}
        style={{borderBottom: `1px solid ${colorErrorSurname}`}}
      />
      <p 
        className='error__input' 
        style={{ display: errorSurname }}
      >
        Данное поле не может быть пустым
      </p>
      <InputRegister 
        placeholder='Ваше имя' 
        value={name}
        onChange={e => setName(e.target.value)}
        style={{borderBottom: `1px solid ${colorErrorName}`}}
      />
      <p 
        className='error__input' 
        style={{ display: errorName }}
      >
        Данное поле не может быть пустым
      </p>
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
      <InputRegister 
        type='password' 
        placeholder='Введите пароль еще раз' 
        value={password2}
        onChange={e => setPassword2(e.target.value)}
        style={{borderBottom: `1px solid ${colorErrorPassword2}`}}
      />
      <p 
        className='error__input' 
        style={{ display: errorPassword2 }}
      >
        Пароли должны совпадать
      </p>
      <div className="enter__buttons">
        <ButtonRegister onClick={checkData}>
          Зарегистрироваться
        </ButtonRegister>
        <Link to="/" className="enter__register">Есть аккаунт?</Link>
      </div>
    </div>
  );
}

export default Register;