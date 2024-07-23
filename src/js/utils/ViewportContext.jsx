import React, { createContext, useContext, useState, useEffect } from 'react';
import { debounce } from "lodash";

const ViewportContext = createContext();

const getDeviceType = (width) => {
    if (width >= 1440) return 'desktop';
    if (width >= 1024) return 'laptop';
    if (width >= 768) return 'tablet';
    return 'mobile';
};

export const ViewportProvider = ({ children }) => {
    const [deviceType, setDeviceType] = useState(getDeviceType(window.innerWidth));

    useEffect(() => {
        const handleResize = debounce(() => {
            setDeviceType(getDeviceType(window.innerWidth));
        }, 200);

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <ViewportContext.Provider value={deviceType}>
            {children}
        </ViewportContext.Provider>
    );
};

export const useViewportContext = () => {
    return useContext(ViewportContext);
};
