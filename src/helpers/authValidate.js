export const validate = values => {
    const errors = {};

    if (!values.password) {
        errors.password = 'This is a required field';
    } else if (values.password.length < 5) {
        errors.password = 'Must be more than 5 characters.';
    }

    if (!values.email) {
        errors.email = 'This is a required field';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    return errors;
};