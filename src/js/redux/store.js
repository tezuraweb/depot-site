import { configureStore } from '@reduxjs/toolkit';
import formReducer from './reducers/formReducer';

const saveToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('formData', serializedState);
    } catch (e) {
        console.warn("Error saving state", e);
    }
};

const localStorageMiddleware = store => next => action => {
    const result = next(action);
    const state = store.getState();
    saveToLocalStorage({ formData: state.form.formData });
    return result;
};

const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('formData');
        if (serializedState === null) return undefined;
        return { form: JSON.parse(serializedState) };
    } catch (e) {
        console.warn("Error loading state", e);
        return undefined;
    }
};

const preloadedState = loadFromLocalStorage();

const store = configureStore({
    reducer: {
        form: formReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
    preloadedState,
});

export default store;