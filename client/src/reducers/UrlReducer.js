export const UrlReducer = (state, action) => {
    switch (action.type) {
        case "VISIT":
            return {
                url: action.payload
            };
        default:
            return state;
    }
};
