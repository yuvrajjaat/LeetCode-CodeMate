import { createContext, useReducer, useEffect } from "react";
import { UserReducer } from "@/reducers/UserReducer";

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(UserReducer, { user: null });

    useEffect(() => {
        chrome.storage.local.get(["user"]).then((result) => {
            if (result.user) {
                dispatch({ type: "LOGIN", payload: result.user });
            }
        });
    }, []);

    return (
        <UserContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};
