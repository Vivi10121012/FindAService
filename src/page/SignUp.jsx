import React, { useState }from 'react'
import { auth } from "../firebase"
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Form, Button, Panel, InputGroup, Stack, Checkbox, Divider,Input, Schema, toaster, Message} from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import 'rsuite/dist/rsuite.min.css';
import {Link} from 'react-router-dom';
import Brand from '../component/Brand';
import { useNavigate } from "react-router-dom";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, doc, setDoc } from "firebase/firestore";

const { StringType, Ty } = Schema.Types;


const Field = React.forwardRef((props, ref) => {
  const { name, message, label, accepter, error, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-10`} ref={ref} className={error ? 'has-error' : ''} style={{marginBottom:'0'}}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} errorMessage={error} {...rest} />
    </Form.Group>
  );
});

const SignUp = () => {
    const formRef = React.useRef();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState("disagree");
    const navigate = useNavigate();
    const functions = getFunctions();

    const signUp = (e) => {
      if (!formRef.current.check()) {
        toaster.push(<Message type="error">Please fill it out as required</Message>);
        return;
      } else {
        //todo:sign in
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const addCustomerRole = httpsCallable(functions, 'addCustomerRole');
          console.log(userCredential);
          const db = getFirestore();
          setDoc(doc(db, "customers", userCredential.user.uid), {
            customerId: userCredential.user.uid,
            email: email,
            username: username,
            role: "customer"
          });
          navigate("/cus");
        }).catch((error) => {
          console.log(error);
        })
      }
    }
    const [visible, setVisible] = useState(false);

    const model = Schema.Model({
      email: StringType()
        .isEmail('Please enter a valid email address.')
        .isRequired('Please enter your acount email.'),
      password: StringType()
        .addRule((password) => {
          console.log("pass" + password);
        })
        .isRequired('Please enter your password.')
        .minLength(6, 'at least 6 characters.'),
      username: StringType()
        .isRequired('Please enter the username.')
        .minLength(3, 'at least three characters.'),
      verifyPassword: StringType()
        .addRule((value) => {
          console.log("Password: " + password);
          console.log("Verify Password: " + value);
  
          if (value !== password) {
            return false;
          }
  
          return true;
        }, 'The two passwords do not match')
        .isRequired('This field is required.'),
      agree: StringType()
      .isRequired('Please agree')
    })

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
        <Panel
          header={<h3>Create an Account</h3>}
          bordered
          style={{ background: '#fff', width: 400 }}
        >
          <p>
            <span>Already have an account?</span> <Link to="/SignIn">Sign in here</Link>
          </p>
  
          <Divider>OR</Divider>
  
          <Form fluid model={model} ref={formRef}>
            <Form.Group>
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Field type='text' name="username" value={username} onChange={(value) => setUsername(value)} />
            </Form.Group>
  
            <Form.Group>
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Field type='text' name="email" value={email} onChange={(value) => setEmail(value)} />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Field
                value={password}
                type={visible ? 'text' : 'password'}
                autoComplete="off"
                onChange={(value) => setPassword(value)}
                name="password"
              />
            </Form.Group>
  
            <Form.Group>
              <Form.ControlLabel>Confirm Password</Form.ControlLabel>
              <Field name="verifyPassword" type="password" />
            </Form.Group>
  
            <Form.Group>
              <Stack style={{ marginLeft: -10 }}>
                <Field accepter={Checkbox} name="agree" value="agree" onChange={(value) => setAgree(value)}>I Agree</Field>
                <Field accepter={Button} name="terms" appearance="link">Terms and conditions.</Field>
              </Stack>
            </Form.Group>
  
            <Form.Group>
              <Stack spacing={6}>
                <Button appearance="primary" onClick={signUp}>Submit</Button>
              </Stack>
            </Form.Group>
          </Form>
        </Panel>
      </Stack>

        // <div className='sign-in-container'>
        //     <form onSubmit={signUp}>
        //         <h1>Create Account</h1>
        //         <input
        //          type='email' 
        //          placeholder='Enter your email' 
        //                 value={email}
        //                 onChange={(e) => setEmail(e.target.value)}
        //                 ></input>
        //         <input 
        //         type='password' 
        //         placeholder='Enter your password' 
        //                 value={password}
        //                 onChange={(e) => setPassword(e.target.value)}
        //                 ></input>
        //                 <button type='submit'>Sign Up</button>
        //     </form>
        // </div>
    )
    }

export default SignUp;