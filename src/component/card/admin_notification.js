import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelGroup,
  Button,
  Form,
  Input,
  Modal,
  Rate
} from 'rsuite';
import { mockUsers } from '../../data/mock';
import { Mode } from '@mui/icons-material';
import { collection, doc, setDoc, addDoc, serverTimestamp, getDoc, query, where,getDocs } from "firebase/firestore";
import { db, storage } from '../../firebase';
import { onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateDoc } from "firebase/firestore";

const data = mockUsers(20);
// const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const AdminNotification = () => {
    const [open, setOpen] = React.useState(false);
    const [formValue, setFormValue] = React.useState({
      review: ''
    });

    const [data, setData] = useState([]);
const auth = getAuth();
    const user = auth.currentUser;
    const [userStatus, setUserStatus] = useState(null);
    const [currentProviderId, setCurrentProviderId] = useState(null);



useEffect(() => {
        const fetchData = async () => {
          onAuthStateChanged(auth, async (user) => {
            if (user) {
              const uid = user.uid;
              // 获取用户状态
              const docRef = doc(db, "completedOrder", uid); 
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                console.log('completedOrder:', docSnap.data());
                setUserStatus(docSnap.data().status);
           
              } else {
                console.log("No such document!");
              }
    
              // 获取服务数据
              const servicesRef = collection(db, "completedOrder");
              const serviceSnapshot = await getDocs(query(servicesRef, where("status", "==", "completed")));
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

  
    const handleOpen = (targetProviderId) => {
      setCurrentProviderId(targetProviderId);
      setOpen(true);
    };
      // 当点击"Confirm"按钮时，更新服务提供商的状态为"removed"
    const handleClose = async () => {
      if (currentProviderId) {
        const providerRef = doc(db, 'serviceProviders', currentProviderId);
        await updateDoc(providerRef, { status: 'removed' });
      }
      setOpen(false);
    };

      
    const Card = ({ id, name, description, rating,onReview }) => (
      <Panel header={`Order ID: ${id}`} shaded bordered bodyFil style={{ width: '80%', marginBottom: 16 ,backgroundColor:'#fff'}}>
        <div>Provider ID: {id}</div>
        <div>Service provider name: {name}</div>
        <div>Service Description: {description}</div>
        <div>Rating: {rating}</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          color="red"
          appearance="primary" block
          onClick={() => onReview(id)}
          style={{width:'50%',marginTop: 16 }}
        >
          REMOVE
        </Button>
        </div>
      </Panel>
    );
  
    return (
      <>
      <div style={{ height: '100vh', overflow: 'auto' }}>
      <PanelGroup style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {data.map(item => (
          <Card
            key={item.id}
            id={item.targetProviderId}
            name={item.name}
            description={item.description}
            rating={item.rate}
            onReview={handleOpen}
          />
        ))}
      </PanelGroup>
      </div>
      <Modal open={open} onClose={handleClose} size="xs">
          <Modal.Header>
            <Modal.Title style={{color:'red'}}>WARN</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <p>Are you sure you want to remove the service provider?</p>
        </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} appearance="primary">
              Confirm
            </Button>
            <Button onClick={handleClose} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

export default AdminNotification;
