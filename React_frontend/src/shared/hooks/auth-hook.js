import { useCallback, useEffect, useState } from "react";

let logOutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [expDate, setExpDate] = useState(null);
    const [userId, setUserId] = useState(null);

    const login = useCallback((uid, token, exp) => {
        setToken(token);
        setUserId(uid);
        const tokExpDate = exp || new Date(new Date().getTime() + 1000 * 60 * 60);
        setExpDate(tokExpDate);
        localStorage.setItem('userData', JSON.stringify({
        userId: uid, 
        token: token, 
        expiration: tokExpDate.toISOString()
        }));
    },[]);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setExpDate(null);
        localStorage.removeItem('userData');
    },[]);

    useEffect(() => {
        if(token && expDate) {
        const remTime = expDate.getTime() - new Date().getTime()
        logOutTimer = setTimeout(logout, remTime)
        } else {
        clearTimeout(logOutTimer);
        }
    }, [logout, token, expDate]);

    useEffect(() => {
        let storedData = JSON.parse(localStorage.getItem('userData'));
        if(storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
        login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);

    return { token, login, logout, userId };
};