import React, {useState} from 'react';
import { Form, Button, Panel, InputGroup, Stack, Checkbox, Divider,Input, Schema, toaster, Message } from 'rsuite';
import { auth } from "../firebase"
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import 'rsuite/dist/rsuite.min.css';
import {BrowserRouter, Link} from 'react-router-dom';
import Brand from '../component/Brand';
import SelectA from '../component/SelectA';
import SelectC from '../component/SelectC';
import {db} from "../firebase"
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, doc, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
import TextArea from 'antd/es/input/TextArea';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useNavigate } from 'react-router-dom';

const { StringType, Ty } = Schema.Types;


const Field = React.forwardRef((props, ref) => {
  const { name, message, label, accepter, error, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-10`} ref={ref} className={error ? 'has-error' : ''} style={{ marginBottom: '0' }}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} errorMessage={error} {...rest} />
    </Form.Group>
  );
});

const Textarea = React.forwardRef(function (props, ref) {
  return React.createElement(Input, { ...props, as: "textarea", ref: ref });
});

const SerSignUp = () => {
    const formRef = React.useRef();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [postcode, setPostcode] = useState('');
    const [address, setAddress] = useState('');
    const [description,setDescription] = useState('')
    const [agree, setAgree] = useState("disagree");
    const functions = getFunctions();
    const navigate = useNavigate();

    const signUp = (e) => {
      if (!formRef.current.check()) {
        toaster.push(<Message type="error">Please fill it out as required</Message>);
        return;
      } else {
      e.preventDefault();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const userId = userCredential.user.uid;
          const userRef = doc(db, "serviceProviderRequests", userId); // 注意这里更改了collection的名称
          setDoc(userRef, {
            username: username,
            email: email,
            postcode: postcode,
            address: address,
            description: description,
            status: "pending",
            role: "serviceProvider"
          })
          .then(() => {
            const addServiceProviderRole = httpsCallable(functions, 'addServiceProviderRole');
            console.log("User data stored successfully");
            navigate("/provider");
          })
          .catch((error) => {
            console.error("Error storing user data: ", error);
          });
        })
        .catch((error) => {
          console.error("Error signing up: ", error);
        });
      }
    };

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
        .isRequired('Please agree'),
      postcode: StringType()
        .isRequired('Please enter the postcode'),
      address: StringType()
        .isRequired('Please enter the Address'),
      description: StringType()
        .isRequired('Please enter the description.'),
      
      })


    const [visible, setVisible] = useState(false);
    return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="column"
      style={{
        height: '150vh'
      }}
    >
      <Brand style={{ marginBottom: 10 }} /> 
      <Panel
        header={<h3>Create an Account</h3>}
        bordered
        style={{ background: '#fff', width: 400 }}
      >
        <p>
          <span>Already have an account?</span> <Link to="/SerSignIn">Sign in here</Link>
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
            <Form.ControlLabel>Address</Form.ControlLabel>
            <Stack style={{ width: '40vh' }}>
              {/* <Field
                accepter={SelectA}
                style={{ marginTop: '2vh' }}
                name="selectA"
                onChange={(value) => console.log("Selected Country: " + value)}
              /> */}
              <SelectA style={{ marginRight: '6vh' }} />
              <SelectC style={{ marginLeft: '6vh' }} />
            </Stack>
            <Field type='text' value={postcode} onChange={(value) => setPostcode(value)} name="postcode" />
            <Form.HelpText>Enter the postcode</Form.HelpText>
            <Field type='text' value={address} onChange={(value) => setAddress(value)} name="address" />
            <Form.HelpText>Enter the Address</Form.HelpText>
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
            <Form.ControlLabel>Description</Form.ControlLabel>
            <Field
              name="description"
              rows={5}
              value={description}
              accepter = {Textarea}
              onChange={(value) => setDescription(value)}
              type = "text"
            />
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
  );
}
    export default SerSignUp;