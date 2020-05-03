import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Icon, Label, Button, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';

function LikeButton ({ user, post: { likeCount, likes, id } }) {
  const [liked, setLiked] = useState(false);

  useEffect(
		() => {
  if (user && likes.find(like => like.username === user.username)) {
    setLiked(true);
  } else {
    setLiked(false);
  }
},
		[user, likes]
	);

  const [likePost] = useMutation(LIKE_POST_MUTAITON, {
    variables: { postId: id }
  });

  const likeButton = user
		? liked
			? <Button color='teal'>
  <Icon name='heart' />
				</Button>
			: <Button basic color='teal'>
  <Icon name='heart' />
				</Button>
		: <Button as={Link} to={'/login'} color='teal' basic>
  <Icon name='heart' />
			</Button>;

  return (
    <Button as='div' labelPosition='right' onClick={likePost}>
      <Popup
        inverted
        content={liked ? 'Like' : 'Unlike'}
        trigger={likeButton}
			/>
      <Label basic color='teal' pointing='left'>
        {likeCount}
      </Label>
    </Button>
  );
}

const LIKE_POST_MUTAITON = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`;

export default LikeButton;
