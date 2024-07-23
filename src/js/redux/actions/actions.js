export const updateFormData = (data) => ({
    type: 'UPDATE_FORM_DATA',
    payload: data,
});

export const resetFormData = () => ({
    type: 'RESET_FORM_DATA',
});