import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  username: yup
    .string('Invalid username')
    .required('Please provide a username')
    .typeError('Invalid username'),
  password: yup
    .string('Invalid password')
    .required('Please provide a password'),
});