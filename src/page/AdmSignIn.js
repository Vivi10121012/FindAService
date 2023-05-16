// import React from 'react';
import React, { Component, useContext } from 'react';
import { Form, Button, Panel, IconButton, Stack, Divider, Modal } from 'rsuite';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider} from "../firebase"
import { Input } from "rsuite";
import { AuthContext } from '../context/AuthContext';
import Brand from '../component/Brand';

const AdmSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const {dispatch} = useContext(AuthContext)

  const signIn = (e) => {
    //todo:sign in
    e.preventDefault();
    if(email === "admin" && password === "admin"){
      navigate("/admin");
    }else{
      setError(true);
    }
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

        <Panel bordered style={{ background: '#fff', width: 400 }} header={<h3>Admin Sign In</h3>}>

          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Username</Form.ControlLabel>
              {/* <Input type='text' value={email} onChange={(e) => setEmail(e.target.value)}/> */}
              <Input type='email' value={email} onChange={(value) => setEmail(value)}/>
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>
                <span>Password</span>
                <a style={{ float: 'right' }}>Forgot password?</a>
              </Form.ControlLabel>
              {/* <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/> */}
              <Input type="password" value={password} onChange={(value) => setPassword(value)}/>
            </Form.Group>
            <Form.Group>
              
              <Stack spacing={6} divider={<Divider vertical />}>
                <Button appearance="primary" onClick={signIn}>Sign in</Button>
                { error && <sapn style={{
                  fontSize: '10px',
                  color: 'red'
                }}>Wrong Email or Password!</sapn>}
              </Stack>
            </Form.Group>
          </Form>
        </Panel>
      </Stack>
    );
  }


export default AdmSignIn;