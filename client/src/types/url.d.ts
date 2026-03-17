export interface UrlState {
    url: string | null
}

export type UrlAction = {
    type: "VISIT";
    payload: string;
}

export type UrlContextType = {
    url: string | null;
    dispatch: React.Dispatch<UrlAction>;
}

export type UrlContextProviderProps = {
    children: React.ReactNode;
}
