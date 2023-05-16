import { updateDoc } from "firebase/firestore";
import React from 'react';
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
import { collection, doc, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { async} from "@firebase/util"
import { db, storage } from '../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { useNavigate } from 'react-router-dom';
// Import the necessary modules

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
//type
const data = ['Cleaning', 'Babysitting', 'Pest control', 'Plumbing', 'Electrical Repairs', 'Beauty'].map(
  item => ({ label: item, value: item })
);
// ...

const UpdateServiceForm = ({ service, onClose, ...rest }) => {
    const toaster = useToaster();
    const [uploading, setUploading] = React.useState(false);
    const [fileInfo, setFileInfo] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [imageFile, setImageFile] = React.useState(null);
    const [imageUrl, setImageUrl] = React.useState(null);
    const navigate = useNavigate();
  
    // Add states for form data
    const [serviceName, setServiceName] = React.useState('');
    const [serviceType, setServiceType] = React.useState('');
    const [city, setCity] = React.useState('');
    const [availability, setAvailability] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [previewUrl, setPreviewUrl] = React.useState(null);
  
    // Initialize the form data when the component is first mounted
    React.useEffect(() => {
      if (service) {
        setServiceName(service.name);
        setServiceType(service.type);
        setCity(service.city);
        setAvailability(service.availability);
        setDescription(service.description);
        setImageUrl(service.pic);  // Assuming that 'pic' is the URL of the image
        setPreviewUrl(service.pic);
      }
    }, [service]);
  
    const handleUpdate = async (e) => {
      e.preventDefault();
  
      // Validation
      // ...
  
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
              updateService(downloadURL);
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
  
    const updateService = async (imageUrl) => {
      try {
        // Update the document
        const serviceRef = doc(db, "services", service.id);
        await updateDoc(serviceRef, {
          name: serviceName,
          type: serviceType,
          city: city,
          availability: availability,
          description: description,
          pic: imageUrl,
          timeSamp: serverTimestamp()
        });
  
        // After updating the service, go back to the preview page
        navigate(0);
        console.log(serviceRef);
        toaster.push(<Message type="success">Service updated successfully</Message>);
        setLoading(false);
      } catch (error) {
        console.error("Error updating document: ", error);
        toaster.push(<Message type="error">Error updating service: {error.message}</Message>);
        setLoading(false);
      }
    };
  
    const previewFile = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    
      // const handleUpload = (file) => {
      //   try {
      //     setImageFile(file.blobFile);
      //   } catch (error) {
      //     console.error('Error handling upload: ', error);
      //   }
      //   return false;  // Return false to prevent the default upload behavior
      // };
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
          <Drawer.Title>Update this Service</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={handleUpdate} appearance="primary" loading={loading}>
              Confirm
            </Button>
            <Button onClick={onClose} appearance="subtle">
              Cancel
            </Button>
          </Drawer.Actions>
        </Drawer.Header>
  
        <Drawer.Body>
          <Form fluid onSubmit={handleUpdate}>
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
  
  export default UpdateServiceForm;
  