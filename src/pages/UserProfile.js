import React, { useState, useContext } from "react";
import { Form, Button, List, Image } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useForm } from "./../utils/hooks";
import { AuthContext } from "./../context/auth";

function UserProfile(props) {
  const context = useContext(AuthContext);
  const { user } = context;
  // const [values, setValues] = useState({
  // 	username: '',
  // 	email: '',
  // 	password: '',
  // 	confirmPassword: '',
  // });

  const { data } = useQuery(AVATAR_IMAGE_QUERY);

  console.log('AAFAYA', data)

  const initialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  const [errors, setError] = useState({});

  const { onChange, onSubmit, values } = useForm(register, initialState);

  // const onChange = event => {
  // 	setValues({ ...values, [event.target.name]: event.target.value });
  // };

  const [addNewUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setError(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  const { userData, userLoading, userError } = useQuery(FETCH_USER_QUERY);

    console.log(userData)

  function register() {
    addNewUser();
  }

  // const onSubmit = event => {
  // 	event.preventDefault();
  // 	addNewUser();
  // };

  return (
	user &&
    <div className="form-container">
      <List>
        <List.Item>
          <List.Icon name="users" />
          <List.Content>
            {user.username}
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="mail" />
          <List.Content>
            <a href="mailto:jack@semantic-ui.com">
              {user.email}
            </a>
          </List.Content>
        </List.Item>
        <List.Item>
          {data && data.files.length > 0
            ? data.files.map(x =>
                <Image
                  floated="left"
                  size="mini"
                  key={x}
                  src={`http://localhost:4000/images/${x}`}
                  alt={x}
                />
              )
            : <Image
                floated="left"
                size="mini"
                src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
              />}
        </List.Item>
      </List>

      <hr />
      <hr />
      <hr />

      {/* Update User info */}
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Update your info</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          type="text"
          name="username"
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
        />
        <Form.Input
          label="Email"
          type="text"
          placeholder="Email.."
          name="email"
          value={values.email}
          onChange={onChange}
          error={errors.email ? true : false}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword ? true : false}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.values(errors).length > 0 &&
        <div className="ui error message">
          <ul>
            {Object.values(errors).map(obj => {
              return (
                <li key={`${obj}`}>
                  {obj}
                </li>
              );
            })}
          </ul>
        </div>}
    </div>
  );
}

const AVATAR_IMAGE_QUERY = gql`
  {
    files
  }
`;

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

const FETCH_USER_QUERY = gql`
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

export default UserProfile;
