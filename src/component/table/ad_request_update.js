import React from 'react';
import {
  Drawer,
  Button,
  Form,
  SelectPicker,
  Input,
} from 'rsuite';

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const AdminUpdate = (props) => {
  const { onClose, ...rest } = props;
  
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
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel>The reason and content of the update request for provider</Form.ControlLabel>
            <Form.Control rows={5} name="Description" accepter={Textarea} />
          </Form.Group>   
        </Form>
      </Drawer.Body>
    </Drawer>
  );
};

export default AdminUpdate;