import React, {useEffect, useState} from 'react';
import {
  Drawer,
  DrawerProps,
  Button,
  Form,
  Stack,
  InputNumber,
  InputGroup,
  Slider,
  Rate,
  SelectPicker,
  Input,
  Uploader, Message, Loader, useToaster
} from 'rsuite';
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro';
import { collection, doc, setDoc, addDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { async} from "@firebase/util"
import { db, storage } from '../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase'; 
import { getAuth, onAuthStateChanged } from "firebase/auth";



const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
//type
const data = ['Cleaning', 'Babysitting', 'Pest control', 'Plumbing', 'Electrical Repairs', 'Beauty'].map(
  item => ({ label: item, value: item })
);

function previewFile(file, callback) {
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

const AddServiceForm = (props) => {
  const { onClose, ...rest } = props;
  const toaster = useToaster();
  const [uploading, setUploading] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [imageFile, setImageFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const navigate = useNavigate();
  const [userStatus, setUserStatus] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  // Add states for form data
  const [serviceName, setServiceName] = React.useState('');
  const [serviceType, setServiceType] = React.useState('');
  const [city, setCity] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [availability, setAvailability] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [isLoadingUserStatus, setIsLoadingUserStatus] = React.useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log('User object: ', user);
      if (user) {
        const docRef = doc(db, "serviceProviders", user.uid);
        const docSnap = await getDoc(docRef);
        console.log('Document snapshot: ', docSnap);
        if (docSnap.exists()) {
          const status = docSnap.data().status;
          setUserStatus(status); // 更新 userStatus 状态
          console.log('User status in useEffect: ', status);
          if (status !== 'approved') {
            toaster.push(<Message type="error">You are not authorized to add a service</Message>);
            return;
          }
        } else {
          console.log('Document does not exist');  // Add this line
        }
      }
      setIsLoadingUserStatus(false);
    };

    fetchData();
}, [user]);

  const handleAdd = async (e) => {
    
    e.preventDefault();
    // Don't allow the user to submit the form if the user status is still loading
    if (isLoadingUserStatus) {
      toaster.push(<Message type="error">Please wait while we're loading your data</Message>);
      return;
    }

    console.log('User status in handleAdd: ', userStatus);
    if (userStatus !== 'approved') {
      toaster.push(<Message type="error">You are not authorized to add a service</Message>);
      return;
    }


    // Validation
    if (!serviceName || !serviceType || !city || !availability || !description || !imageFile) {
      toaster.push(<Message type="error">Please fill in all fields and select a file to upload</Message>);
      return;
    }
    setLoading(true);
   
  
    try {
      // Upload the image to Firebase Storage
      const storageRef = ref(storage, 'images/' + imageFile.name);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // Handle the upload progress
        }, 
        (error) => {
          console.error("Error uploading image: ", error);
          toaster.push(<Message type="error">Error uploading image: {error.message}</Message>);
          setLoading(false);
        }, 
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Use the download URL when adding a document
            addService(downloadURL, user.uid);
            toaster.push(<Message type="success">Image uploaded successfully</Message>);
          });
        }
      );
    } catch (error) {
      console.error("Error adding document: ", error);
      toaster.push(<Message type="error">Error adding service: {error.message}</Message>);
      setLoading(false);
    }
  };

  const addService = async (imageUrl, providerId) => {
    try {
      const res = await addDoc(collection(db, "services"), {
        name: serviceName,
        type: serviceType,
        city: city,
        availability: availability,
        description: description,
        pic: imageUrl,
        providerId: providerId,
        price:price,
        timeSamp: serverTimestamp()
      });

      //after add services go back to preview page
      navigate(0);
      console.log(res);
      toaster.push(<Message type="success">Service added successfully</Message>);
      setLoading(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      toaster.push(<Message type="error">Error adding service: {error.message}</Message>);
      setLoading(false);
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const handleUpload = (file) => {
    try {
      setImageFile(file.blobFile);
      previewFile(file.blobFile);  // Add this line
      toaster.push(<Message type="success">Image selected successfully</Message>); // Add this line
    } catch (error) {
      console.error('Error handling upload: ', error);
    }
    return false;  // Return false to prevent the default upload behavior
  };
  
  return (
    <Drawer backdrop="static" size="sm" placement="right" onClose={onClose} {...rest}>
      <Drawer.Header>
        <Drawer.Title>Add a new Service</Drawer.Title>
        <Drawer.Actions>
          <Button onClick={handleAdd} appearance="primary" loading={loading}>
            Confirm
          </Button>
          <Button onClick={onClose} appearance="subtle">
            Cancel
          </Button>
        </Drawer.Actions>
      </Drawer.Header>

      <Drawer.Body>
        <Form fluid>
            <Form.Group>
            <Form.ControlLabel>Service Name</Form.ControlLabel>
            <Form.Control name="ServiceName" value={serviceName} onChange={value => setServiceName(value)} />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Service Type</Form.ControlLabel>
            <Form.Control name="Type" data={data} accepter={SelectPicker} value={serviceType} onChange={value => setServiceType(value)} />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>City</Form.ControlLabel>
            <Form.Control name="City" value={city} onChange={value => setCity(value)} />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Price</Form.ControlLabel>
            <Form.Control name="Price" value={price} onChange={value => setPrice(value)} />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Availability</Form.ControlLabel>
            <Form.Control rows={2} name="Availability" accepter={Textarea} value={availability} onChange={value => setAvailability(value)} />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Description</Form.ControlLabel>
            <Form.Control rows={5} name="Description" accepter={Textarea} value={description} onChange={value => setDescription(value)} />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Pic</Form.ControlLabel>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Control 
              name="Pic" 
              action="#"  // Add this line
              accepter={Uploader} 
              fileListVisible={false}
              listType='picture' 
              onChange={(fileList) => {
              
                const latestFile = fileList[fileList.length - 1];
                handleUpload(latestFile);
                setFileInfo(latestFile);
              }}
              autoUpload={false}
              style={{ flex: '1' }}
            />
            {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: '70px', maxHeight: '70px', marginLeft: '0.5em' }} />}
          </div>
          </Form.Group>
    
        </Form>
      </Drawer.Body>
    </Drawer>
  );
};

export default AddServiceForm;
