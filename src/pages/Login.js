import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { PromiseProvider } from 'mongoose';
import { useForm } from './../utils/hooks'
import { AuthContext } from './../context/auth'

function Login(props) {

    const context = useContext(AuthContext)

    const initialState = {
        username: '',
        password: '',
    };

    const [errors, setError] = useState({})

    const { onChange, onSubmit, values } = useForm(login, initialState)

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, {data: {login: userData}}) {
            context.login(userData)
            props.history.push('/')
        },
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.exception.errors)
            setError(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    });

    function login() {
        loginUser()
    }

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Register</h1>
                <Form.Input
                    label='Username'
                    placeholder='Username..'
                    type='text'
                    name='username'
                    value={values.username}
                    onChange={onChange}
                    error={errors.username ? true : false}
                />
                <Form.Input
                    label='Password'
                    placeholder='Password..'
                    name='password'
                    type='password'
                    value={values.password}
                    onChange={onChange}
                    error={errors.password ? true : false}
                />

                <Button type='submit' primary>
                    Login
				</Button>
            </Form>
            {Object.values(errors).length > 0 &&
                <div className="ui error message">
                    <ul>
                        {Object.values(errors).map((obj) => {
                            return (
                                <li key={`${obj}`}>{obj}</li>
                            )
                        }
                        )
                        }
                    </ul>
                </div>
            }
        </div>
    );
}

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(
			username: $username
			password: $password
		) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Login;
