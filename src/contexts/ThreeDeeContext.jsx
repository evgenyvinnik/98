import React, { createContext, useState, useContext, useCallback } from 'react';

const ThreeDeeContext = createContext();

export const useThreeDee = () => useContext(ThreeDeeContext);

export const ThreeDeeProvider = ({ children }) => {
    const [isThreeDeeEnabled, setThreeDeeEnabled] = useState(false);

    const toggleThreeDee = useCallback(() => {
        setThreeDeeEnabled(prev => !prev);
    }, []);

    const value = { isThreeDeeEnabled, toggleThreeDee };

    return (
        <ThreeDeeContext.Provider value={value}>
            {children}
        </ThreeDeeContext.Provider>
    );
};
