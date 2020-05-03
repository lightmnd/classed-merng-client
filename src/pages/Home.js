import React, { useState, useContext, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FETCH_POSTS_QUERY } from './../queries/FETCH_POSTS_QUERY';
import UIWrapper from './../UIWrapper';
import { Grid, Button, Label, Icon, Form, Divider, Transition } from 'semantic-ui-react';
import PostCard from './../components/PostCard';
import { PostForm, SubmittedCtx } from './../components/PostForm';
import { AuthContext } from './../context/auth'

function Home() {
	const { user } = useContext(AuthContext)
	//const { submitted } = useContext(SubmittedCtx)

	const [formState, setFormState] = useState(false)
	const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		if (data) {
			setPosts(data.getPosts);
		}
	}, [data]);

	function openForm() {
		setFormState(!formState)
	}

	if (error) return <h1>Someting went wrong :(</h1>
	if (loading) return <h1>loading...</h1>
	if (data) {
		return (
			<UIWrapper>
				<Grid columns={3}>
					<Grid.Row className={'page-title'}>
						{user && <div>
							{!formState ? (
								<Button as='div' labelPosition='right' onClick={openForm}>
									<Label basic color='teal'>
										<Icon name='write alternate' />
										<p>Create new Post!</p>
									</Label>
								</Button>
							) : (
									<Button as='div' labelPosition='right' onClick={openForm}>
										<Label basic color='teal'>
											<Icon name='close alternate' />
											<p>&nbsp; Close</p>
										</Label>
									</Button>
								)}
							{formState && (
								<>
									<Divider horizontal>
										<Icon name='write alternate' />
										<p>&nbsp; Write your post...</p>
									</Divider>
									<Grid.Column>
										<PostForm />
									</Grid.Column>
								</>
							)}
						</div>}
						{data &&
							data.getPosts.length === 0 ? <h2>Ops, there are no posts...</h2> : <h2>Recent Posts</h2>}
					</Grid.Row>
					<Grid.Row>
						{loading ? (
							<h1>loading posts...</h1>
						) : (
								<Transition.Group>
									{posts &&
										posts
											//.slice(0, 4)
											.map(post => (
												<Grid.Column key={`${post.id}`} style={{ marginBottom: 25 }}>
													<PostCard post={post} />
												</Grid.Column>
											))
									}
								</Transition.Group>
							)
						}
					</Grid.Row>
				</Grid>
			</UIWrapper>
		);
	}
}

export default Home;
