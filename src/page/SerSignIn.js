// import React from 'react';
import React, { Component, useContext } from 'react';
import { Form, Button, Panel, IconButton, Stack, Divider, Model ,Schema,toaster,Message } from 'rsuite';
import { Link, useNavigate } from 'react-router-dom';
import GithubIcon from '@rsuite/icons/legacy/Github';
import FacebookIcon from '@rsuite/icons/legacy/Facebook';
import GoogleIcon from '@rsuite/icons/legacy/Google';
import WechatIcon from '@rsuite/icons/legacy/Wechat';
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider} from "../firebase"
import { Input } from "rsuite";
import { AuthContext } from '../context/AuthContext';
import Brand from '../component/Brand';

const { StringType } = Schema.Types;

const model = Schema.Model({
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('Please enter your acount email.'),
  password: StringType().isRequired('Please enter your password'),
});

function TextField(props) {
  const { name, label, accepter, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-3`}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
    </Form.Group>
  );
}

const SerSignIn = () => {
  const formRef = React.useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const {dispatch} = useContext(AuthContext)

  const signIn = (e) => {
    if (!formRef.current.check()) {
      toaster.push(<Message type="error">Please enter your email address and password correctly.</Message>);
      return;
    }else{
    //todo:sign in
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((useCredential) => {
        const user = useCredential.user;
        dispatch({ type: "SIGNIN", payload: user }); // Pass user object to dispatch
        console.log("User logged in:", user);
        navigate("/provider");
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });}
  };

    const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log(result);
        navigate("/provider")
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signInWithFacebook = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        console.log(result);
        navigate("/provider")
      })
      .catch((error) => {
        console.log(error);
      });
  };

    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="column"
        style={{
          height: '100vh'
        }}
      >
        <Brand style={{ marginBottom: 10 }} />

        <Panel bordered style={{ background: '#fff', width: 400 }} header={<h3>Service Sign In</h3>}>
          <p style={{ marginBottom: 10 }}>
            <span className="text-muted">New Here? </span>{' '}
            <Link to="/SerSignUp"> Create an Account</Link>
          </p>

          <Form fluid model={model} ref={formRef}>
            <Form.Group>
              <Form.ControlLabel>Username or email address</Form.ControlLabel>
              {/* <Input type='text' value={email} onChange={(e) => setEmail(e.target.value)}/> */}
              <TextField type='email' name = "email"  value={email} onChange={(value) => setEmail(value)}/>
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>
                <span>Password</span>
                <a style={{ float: 'right' }}>Forgot password?</a>
              </Form.ControlLabel>
              {/* <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/> */}
              <TextField type="password" name = "password"  value={password} onChange={(value) => setPassword(value)}/>
            </Form.Group>
            <Form.Group>
              
              <Stack spacing={6} divider={<Divider vertical />}>
                <Button appearance="primary" onClick={signIn}>Sign in</Button>
                { error && <span style={{
                  fontSize: '10px',
                  color: 'red'
                }}>Wrong Email or Password!</span>}
                <Stack spacing={6}>
                  <IconButton icon={<WechatIcon />} appearance="subtle" />
                  <IconButton icon={<GithubIcon />} appearance="subtle" />
                  <IconButton icon={<FacebookIcon />} appearance="subtle" onClick={signInWithFacebook}/>
                  <IconButton icon={<GoogleIcon />} appearance="subtle" onClick={signInWithGoogle}/>
                </Stack>
              </Stack>
            </Form.Group>
          </Form>
        </Panel>
      </Stack>
    );
  }


export default SerSignIn;