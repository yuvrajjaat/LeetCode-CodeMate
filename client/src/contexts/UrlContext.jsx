import { UrlReducer } from "@/reducers/UrlReducer";
import { createContext, useEffect, useReducer } from "react";

export const UrlContext = createContext(null);

export const UrlContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(UrlReducer, { url: null });

    useEffect(() => {
        const queryInfo = { active: true, lastFocusedWindow: true };

        chrome.tabs && chrome.tabs.query(queryInfo, (tabs) => {
            if (tabs && tabs.length > 0 && tabs[0].url) {
                dispatch({ type: "VISIT", payload: tabs[0].url });
            }
        });
    }, []);

    return (
        <UrlContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UrlContext.Provider>
    );
};
