import { useEffect, useState, useCallback } from 'react';

  let logoutTimer;
  
  export const useAuth = () => {

    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);
    
    const login = useCallback((uid, token, expirationDate) => {
      setToken(token);
      setTokenExpirationDate(null)
      setUserId(uid);
      const tokenExpiration = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 )
      setTokenExpirationDate(tokenExpiration);
      localStorage.setItem(
        'userData',
        JSON.stringify({ userId: uid , token: token, expiration: tokenExpiration.toISOString() })
        );
      }, []);
      
      useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (
          storedData &&
          storedData.token &&
          new Date(storedData.expiration) > new Date()
        ) {
          login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
      }, [login])
      
    const logout = useCallback(() => {
      setToken(null);
      setUserId(null);
      localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
      if (token && tokenExpirationDate) {
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        clearTimeout(logoutTimer);
      }
    }, [token, logout, tokenExpirationDate]);

    return { token, login, logout, userId}
 }