import React, { useContext, useState, useRef } from 'react';
import {
	Grid,
	Image,
	Card,
	Button,
	Label,
	Icon,
	Form,
	Popup
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import moment from 'moment';
import { AuthContext } from './../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

function SinglePost (props) {
  console.log(props);
  const {
		id,
		body,
		createdAt,
		username,
		comments,
		likes,
		likeCount,
		commentCount
	} = props;
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;
  const commentRef = useRef(null);
  const [comment, setComment] = useState('');

  const { data, loading, error } = useQuery(FETCH_POST_QUERY, {
    variables: { postId }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT, {
    update () {
      setComment('');
      commentRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  });

  function deletePostCallback () {
    props.history.push('/');
  }

	// let postMarkup;

	// if (!data.getPost) {
	//     postMarkup = <p>Loading post...</p>
	// } else if (data && data.getPost) {
	//     //const { id, body, createdAt, username, likeCount, likes, commentCount, comments } = data.getPost

	//     postMarkup = <Grid>
	//         <Grid.Row>
	//             <Grid.Column width='2'>
	//                 <Image
	//                     floated='right'
	//                     size='mini'
	//                     src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
	//                 />
	//                 <Grid.Column width='10' />
	//             </Grid.Column>
	//         </Grid.Row>
	//     </Grid>
	// }

	// console.log(loading)
	// const { id, body, createdAt, username, likeCount, likes, commentCount, comments } = data.getPost
  return !loading && data && data.getPost
		? <Grid>
  <Grid.Row>
    <Grid.Column width='2'>
      <Image
        floated='right'
        size='mini'
        src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
						/>
    </Grid.Column>
    <Grid.Column width='10'>
      <Card fluid>
        <Card.Content>
          <Card.Header>
            {data.getPost.username}
          </Card.Header>
          <Card.Meta>
            {moment(data.getPost.createdAt).fromNow()}
          </Card.Meta>
          <Card.Description>
            {data.getPost.body}
          </Card.Description>
        </Card.Content>
        <hr />
        <Card.Content extra>
          <LikeButton
            post={{
              likes: data.getPost.likes,
              likeCount: data.getPost.likeCount,
              id: data.getPost.id
            }}
            user={user}
								/>

          <Popup
            inverted
            content={data.getPost.likes.length > 0 ? 'Like' : 'Unlike'}
            trigger={
              <Button
                labelPosition='right'
                // onClick={commentOnPost}
                as={Link}
                // to={`/post/${data.getPost.id}`}
										>
                <Button basic color='blue'>
                  <Icon
                    name={
														data.getPost.commentCount === 1
															? 'comment'
															: 'comments'
													}
												/>
                </Button>
                <Label basic color='blue' pointing='left'>
                  {data.getPost.commentCount}
                </Label>
              </Button>
									}
								/>

          {data &&
									user &&
									user.username === data.getPost.username &&
									<DeleteButton
  postId={data.getPost.id}
  callback={deletePostCallback}
									/>}
        </Card.Content>
      </Card>
      {user &&
      <Card fluid>
        <Card.Content>
          <p>Post a comment</p>
          <Form>
            <div className='ui action input fluid'>
              <input
                type='text'
                placeholder='Comment...'
                name='comment'
                value={comment}
                onChange={e => setComment(e.target.value)}
                ref={commentRef}
											/>
              <button
                type='submit'
                className='ui button teal'
                disabled={comment.trim() === ''}
                onClick={submitComment}
											>
												Submit
											</button>
            </div>
          </Form>
        </Card.Content>
      </Card>}
      {data.getPost.comments.map(comment =>
        <Card fluid key={comment.id}>
          <Card.Content>
            {user &&
										user.username === comment.username &&
										<DeleteButton
  postId={data.getPost.id}
  commentId={comment.id}
										/>}
            <Card.Header>
              {comment.username}
            </Card.Header>
            <Card.Meta>
              {moment(comment.createdAt).fromNow()}
            </Card.Meta>
            <Card.Description>
              {comment.body}
            </Card.Description>
          </Card.Content>
        </Card>
						)}
    </Grid.Column>
  </Grid.Row>
			</Grid>
		: <p>Loading post...</p>;
}

const SUBMIT_COMMENT = gql`
	mutation($postId: String!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			comments {
				id
				body
				createdAt
				username
			}
			commentCount
		}
	}
`;

const FETCH_POST_QUERY = gql`
	query($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			createdAt
			username
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

export default SinglePost;
