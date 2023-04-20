import React from 'react';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import axios from 'axios';
import { validationSchema } from '../utils/validation';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../globalState/atom';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userState);
  const login = async (values) => {
    axios
      .post(process.env.REACT_APP_BASE_URL + '/users/login', values, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem('accessToken', res.data.token);
        navigate('/');
      })
      .catch((err) => console.log(err.response.data));
  };

  return (
    <div className='h-screen flex justify-center items-center'>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => login(values)}
      >
        {(props) => (
          <Form className='flex flex-col'>
            <Field
              autoComplete='off'
              name='username'
              placeholder='username'
              className='border'
            />
            <div className='text-red-400'>
              <ErrorMessage name='username' />
            </div>
            <Field
              autoComplete='off'
              name='password'
              type='password'
              placeholder='password'
              className='border'
            />
            <div className='text-red-400'>
              <ErrorMessage className='bg-red-400' name='password' />
            </div>
            <button type='submit'>Login</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
