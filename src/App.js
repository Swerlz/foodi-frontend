import React, { useState, useEffect } from 'react';
import './App.css';
import Cookies from 'js-cookie';
import LoginPage from './components/loginPage';
import Dashboard from './components/dashboard';
function App() {
  const [user, setUser] = useState('');
  const [userID, setUserID] = useState(0);

  useEffect(() => {
    let cookie = Cookies.get('user');

    if (cookie !== undefined) {
      let user = JSON.parse(cookie);

      setUser(user.name);
      setUserID(user.u_id);
    }

  }, [])

  const checkUser = (data) => {
    setUser(data.name);
    setUserID(data.u_id);
  }

  return (
    <>
      {!user?
        <LoginPage checkUser={checkUser}/>
        :
        <Dashboard user={user} userID={userID}/>
      }
    </>
  );
}

export default App;
