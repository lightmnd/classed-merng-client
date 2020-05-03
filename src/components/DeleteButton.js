import React, { useState } from "react";
import { Icon, Button, Confirm, Popup} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { FETCH_POSTS_QUERY } from './../queries/FETCH_POSTS_QUERY';


function DeleteButton(props) {
    const {postId, commentId, callback} = props
    const [confirmOpen, setConfirmOpen] = useState(false)

    const mutation = props.commentId ? DELETE_COMMENT : DELETE_POST

    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false)
            if(!commentId) {
              const data = proxy.readQuery({query: FETCH_POSTS_QUERY})
                proxy.writeQuery({query: FETCH_POSTS_QUERY,  data: data.getPosts.filter((p) => p.id !== postId )}) // Remove Post from cache
              if(callback) callback()
            }
        },
        refetchQueries: refetchPosts => [{ query: FETCH_POSTS_QUERY }],
        variables: {
            postId,
            commentId
        }
    })

  return (
    <>
    <Popup 
    inverted
    content={!commentId ? 'Delete post' : "Delete comment"} 
    trigger={
        <Button
        as="div"
        color="red"
        onClick={() => setConfirmOpen(true)}
        floated="right"
      >
        <Icon name={"trash"} style={{ margin: 0 }} />
      </Button>
      }
      
      />
      <Confirm
          open={confirmOpen} 
          onCancel={() => setConfirmOpen(false)}
          onConfirm={deletePostOrMutation}
          />
      </>  
  );
}

const DELETE_POST = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT = gql`
    mutation deleteComment($postId: ID! $commentId: ID!) {
      deleteComment(postId: $postId, commentId: $commentId) {
        id
        comments {
          id username createdAt body
        }
        commentCount
      }
    }
`

export default DeleteButton