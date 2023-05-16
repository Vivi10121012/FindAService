import React from 'react';
import {
  Drawer,
  Button,
  Form,
  SelectPicker,
  Input,
  Uploader, Message, Loader, useToaster
} from 'rsuite';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase';

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const DemandForm = (props) => {
  const { onClose, customerId, requestId, ...rest } = props;

  const handleSubmit = async (rowData) => {
    console.log("这里的数据为：", rowData);
    try {
      const demandData = {
        customerId: customerId,
        requestId: requestId,
        updateRequest: rowData.Description
      };
      const docRef = await addDoc(collection(db, "demandRequests"), demandData);
      console.log("rowData在这里是:", rowData);
      console.log("Demand request added with ID: ", docRef.id);
      // ...（显示成功消息等）
      onClose();
    } catch (error) {
      console.error("Error adding demand request: ", error);
      // ...（显示错误消息等）
    }
  };

  return (
    <Drawer backdrop="static" size="sm" placement="right" onClose={onClose} {...rest}>
      <Drawer.Header>
        <Drawer.Title>Demand an Update</Drawer.Title>
        <Drawer.Actions>
          <Button onClick={onClose} appearance="primary">
            Confirm
          </Button>
          <Button onClick={onClose} appearance="subtle">
            Cancel
          </Button>
        </Drawer.Actions>
      </Drawer.Header>

      <Drawer.Body>
        <Form fluid onSubmit={handleSubmit}>
          <Form.Group>
            <Form.ControlLabel>The reason and content of the update request</Form.ControlLabel>
            <Input
              rows={5}
              name="Description"
              componentclass="textarea"
              accepter={Input}
            />
          </Form.Group>
          <Button type="submit" appearance="primary">
            Submit
          </Button>
        </Form>
      </Drawer.Body>
    </Drawer>
  );
};

export default DemandForm;