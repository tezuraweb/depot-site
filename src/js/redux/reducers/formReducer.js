const initialState = {
    formData: null,
};

const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_FORM_DATA':
            return {
                ...state,
                formData: action.payload,
            };
        case 'RESET_FORM_DATA':
            return {
                ...state,
                formData: null,
            };
        default:
            return state;
    }
};

export default formReducer;