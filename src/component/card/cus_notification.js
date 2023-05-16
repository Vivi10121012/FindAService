import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelGroup,
  Button,
  Form,
  Input,
  Modal,
  Rate,
  Notification,
} from 'rsuite';
import { mockUsers } from '../../data/mock';
import { collection, doc, setDoc, addDoc, serverTimestamp, getDoc, query, where, getDocs } from "firebase/firestore";
import { db, storage } from '../../firebase';
import { onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateDoc } from "firebase/firestore";

// const data = mockUsers(20);
// const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const Cusnotification = () => {


  const [data, setData] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const [userStatus, setUserStatus] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [review, setReview] = React.useState('');

  useEffect(() => {
    const fetchData = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          // 获取用户状态
          const docRef = doc(db, "completedOrder", uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log('User document data:', docSnap.data());
            setUserStatus(docSnap.data().status);

          } else {
            console.log("No such document!");
          }

          // 获取服务数据
          const servicesRef = collection(db, "completedOrder");
          const serviceSnapshot = await getDocs(query(servicesRef, where("customerId", "==", uid)));
          let list = [];
          serviceSnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setData(list);
        } else {
          console.log("User is not logged in or data is not loaded yet.");
        }
      });

      // ...
    };

    fetchData();
  }, []);

  //弹窗
  const handlesuccedClose = () => {
    setsucsetOpen(false);
  };
  const handlesuccedOpen = () => {
    setsucsetOpen(true);
  };
  const Message = React.forwardRef(({ type, ...rest }, ref) => {
    return (
      <Notification ref={ref} {...rest} type={type} header={type}>
        <p style={{ width: 280 }}>Successful operation!</p>
      </Notification>
    );
  });

  const [open, setOpen] = React.useState(false);
  const [sucopen, setsucsetOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({
    review: '',
    rate: ''
  });
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (id) => {
    setCurrentOrderId(id);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (currentOrderId && formValue) {
      const orderRef = doc(db, 'completedOrder', currentOrderId);
      await updateDoc(orderRef, {
        review: formValue.review,
        rate: formValue.rate,
      });
      console.log('review' + formValue.review);
      console.log('rate' + formValue.rate);
      // Close the modal and reset formValue
      setOpen(false);
      setFormValue({
        review: '',
        rate: 0,
      });
      setsucsetOpen(true);
    } else {
      console.error('No order selected or form is empty');
    }
  };

  const handleReview = (id) => {
    console.log(`Review button clicked for service ID: ${id}`);
  };

  const Card = ({ id, name, description, onReview }) => (
    <Panel header={`Order ID: ${id}`} shaded bordered style={{ width: '80%', marginBottom: 16, backgroundColor: '#fff' }}>
      <div>Order ID: {id}</div>
      <div>Service name: {name}</div>
      <div>Service Description: {description}</div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          color="orange"
          appearance="ghost" block
          onClick={() => onReview(id)}
          style={{ width: '50%', marginTop: 16 }}
        >
          Add a Review
        </Button>
      </div>
    </Panel>
  );

  return (
    <>
      <div style={{ height: '100vh', overflow: 'auto' }}>
        <PanelGroup style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {data.map(item => (
            <Card
              key={item.id}
              id={item.id}
              name={item.firstName}
              description={item.description}
              onReview={handleOpen}
            />
          ))}
        </PanelGroup>
      </div>
      <Modal open={open} onClose={handleClose} size="xs">
        <Modal.Header>
          <Modal.Title>ADD REVIEW</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={setFormValue} formValue={formValue}>
            <Form.Group controlId="rate">
              <Form.ControlLabel>Rate:</Form.ControlLabel>
              {/* <Form.Control name="rate" value ={formValue.rate} accepter={Rate}/> */}
              <Form.Control
                name="rate"
                value={formValue.rate}
                accepter={Rate}
              />
            </Form.Group>
            <Form.Group controlId="textarea-9">
              <Form.ControlLabel>Textarea</Form.ControlLabel>
              <input
                type="text"
                placeholder="Add review here"
                value={formValue.review}
                style={{ width: '100%' }}
                onChange={event => setFormValue({ ...formValue, review: event.target.value })}
              />
            </Form.Group>


          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Confirm
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal sucopen={sucopen} onClose={handlesuccedClose} size="xs">
        <Message type="success" />
      </Modal>
    </>
  );
};

export default Cusnotification;
