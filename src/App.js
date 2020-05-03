import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import MenuBar from "./components/MenuBar";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import { AuthProvider } from './context/auth'
import AuthRouter from './utils/AuthRouter'
import { SubmittedCtx } from './components/PostForm';
import SinglePost from './components/SinglePost'


function App() {
  return (
    <AuthProvider>
      <SubmittedCtx.Provider>
        <Router>
          <Container>
            <MenuBar />
            <Route exact path="/" component={Home} />
            <AuthRouter exact path="/login" component={Login} />
            <AuthRouter exact path="/register" component={Register} />
            <Route exact path="/user-profile" component={UserProfile} />
            <Route exact path='/posts/:postId' component={SinglePost} />
          </Container>
        </Router>
        </SubmittedCtx.Provider>
    </AuthProvider>
  );
}

export default App;
