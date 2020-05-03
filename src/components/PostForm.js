import React, { useContext, useState, createContext } from 'react';
import { Form, Card, Icon, Label, Button, Image } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth'
import { useMutation } from '@apollo/react-hooks';
import { useForm } from './../utils/hooks'
import gql from 'graphql-tag';
import { FETCH_POSTS_QUERY } from './../queries/FETCH_POSTS_QUERY';

const SubmittedCtx = createContext({})

function PostForm(props) {
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		body: ''
	})

	//const [errors, setError] = useState({})
	const [createPost, { error }] = useMutation(CREATE_POST, {
		variables: values,
		update(proxy, result) {
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY
			});
			const new_post = result.data.createPost;
			proxy.writeQuery({
				query: FETCH_POSTS_QUERY,
				data: { getPosts: [new_post, ...data.getPosts] }
			});
			values.body = '';
		},
		onError(err) {
			//setError(err.graphQLErrors[0].extensions.exception.stacktrace[0])
			console.log(err.graphQLErrors[0].extensions.exception.stacktrace[0])
		},
		refetchQueries: refetchPosts => [{ query: FETCH_POSTS_QUERY }]
	});


	const [submitted, setSubmitted] = useState(false)
	function createPostCallback() {
		createPost()
		setSubmitted(true)
	}
	return (
		<div className='form-container'>
			<Form onSubmit={onSubmit} className={'post-form'}>
				<Form.Field>
					<Form.Input
						placeholder='Your post'
						name='body'
						onChange={onChange}
						value={values.body}
						error={error ? true : false}
					/>
					<Button type='submit' color='teal'>Create</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className="ui error message">
					<ul className={'list'}>
						<li style={{fontSize: "0.5em"}}>{JSON.stringify(error.graphQLErrors[0].message)}</li>
					</ul>
				</div>)
			}
		</div>
	)
}

const CREATE_POST = gql`
	mutation createPost($body: String!) {
		createPost(
			body: $body
		) {
			id body createdAt username
		}
		
	}
`;

/*
likePost {
			id
			username
			createdAt
		}
		comments {
			id createdAt username body
		}
				commentCount

*/

export { SubmittedCtx, PostForm };
