import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const response = await fetch('http://localhost:8000/api/users/me/', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUser({ loggedIn: true, ...data });
                    } else if (response.status === 401) {
                        // Attempt to refresh the access token
                        const refreshToken = localStorage.getItem('refresh_token');
                        if (refreshToken) {
                            try {
                                const refreshResponse = await fetch('http://localhost:8000/api/token/refresh/', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ refresh: refreshToken })
                                });
                                if (refreshResponse.ok) {
                                    const refreshData = await refreshResponse.json();
                                    const newAccessToken = refreshData.access;
                                    localStorage.setItem('access_token', newAccessToken);
                                    setToken(newAccessToken);
                                    return; // Return early; useEffect will trigger again with the new token
                                }
                            } catch (refreshErr) {
                                console.error('Failed to refresh token', refreshErr);
                            }
                        }
                        // If refresh failed or no refresh token, log out the user
                        setUser(null);
                        setToken(null);
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                    } else {
                        // Other server/gateway errors (e.g. 500, 502) - keep token so user is not logged out
                        setUser(null);
                    }
                } catch (err) {
                    console.error('Failed to fetch user due to network/CORS error', err);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    const login = async (username, password) => {
        const response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            setToken(data.access);
            return true;
        } else {
            throw new Error(data.detail || 'Login failed');
        }
    };

    const register = async (username, email, password) => {
        const response = await fetch('http://localhost:8000/api/users/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        if (response.ok) {
            return true;
        } else {
            const data = await response.json();
            throw new Error(JSON.stringify(data) || 'Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
    };

    const value = {
        token,
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
