import React, { useRef } from 'react';
import { Component } from 'react';
import {
  Stack,
  Badge,
  Avatar,
  IconButton,
  Button,
  Whisper,
  Popover,
  List,
  Modal,
  Input, Form
} from 'rsuite';
import NoticeIcon from '@rsuite/icons/Notice';
import GearIcon from '@rsuite/icons/Gear';
import HeartIcon from '@rsuite/icons/legacy/HeartO';
import SelectA from './SelectA';
import SelectC from './SelectC';

//侧边栏右侧内容页的header 右侧的头像设置，github标志等
//在js内更改css，只作用于当前组件
const Stack1 = {
  position: "absolute",
  right: "30px",
  top: "20px",
  cursor: "pointer",
  zIndex: "1",
};

// const renderNoticeSpeaker = (props, ref) => {
//   const notifications = [
//     ['Sorry, your description need to update.'],
//   ];

//   return (
//     <Popover ref={ref} className={props.className} style={{ left: props.left, top: props.top, width: 300 }} title="Last updates">
//       <List>
//         {notifications.map((item, index) => {
//           const [time, content] = item;
//           return (
//             <List.Item key={index}>
//               <p>{content}</p>
//               <Button onClick={handleOpen}>Click to Update</Button>
//             </List.Item>
//           );
//         })}
//       </List>
//       <div style={{ textAlign: 'center', marginTop: 20 }}>
//         <Button onClick={props.onClose}>More notifications</Button>
//       </div>
//     </Popover>
//   );
// };



// class Header extends Component {
//   render() {    
const Header = () => {
  const [open, setOpen] = React.useState(false);
  const trigger = useRef(null);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const renderNoticeSpeaker = (props, ref) => {
    const notifications = [
      ['Sorry, your description need to update.'],
    ];
  
    return (
      <Popover ref={ref} className={props.className} style={{ left: props.left, top: props.top, width: 300 }} title="Last updates">
        <List>
          {notifications.map((item, index) => {
            const [content] = item;
            return (
              <List.Item key={index} style={{textAlign: 'center'}}>
                <p style={{fontSize:'15px'}} >{content}</p>
                <Button onClick={handleOpen} appearance="primary"  color="green">Click to Update</Button>
              </List.Item>
            );
          })}
        </List>
        {/* <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button onClick={props.onClose}>More notifications</Button>
        </div> */}
      </Popover>
    );
  };
  return (
    <>
      <Stack className="header" spacing={8} style={Stack1}>
        <IconButton
          icon={<HeartIcon style={{ fontSize: 20 }} color="red" />}
          href=""
          target="_blank"
        />

        <Whisper placement="bottomEnd" trigger="click" ref={trigger} speaker={renderNoticeSpeaker}>
          <IconButton
            icon={
              //content 就是显示的数字
              <Badge content={0}> 
                <NoticeIcon style={{ fontSize: 20 }} />
              </Badge>
            }
          />
        </Whisper>

        <IconButton icon={<GearIcon style={{ fontSize: 20 }} />} />

        {/* 头像 */}
        <Avatar
          size="sm"
          circle
          src="https://avatars.githubusercontent.com/u/1203827"
          alt="@simonguo"
          style={{ marginLeft: 8 }}
        />

        <Button color="cyan" appearance="subtle" href='/'>
          Sign out
        </Button>
      </Stack>

      <Modal open={open} onClose={handleClose} size="xs">
        <Modal.Header>
          <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Address</Form.ControlLabel>
              <Stack style={{ width: '40vh' }}>
                <SelectA style={{ marginRight: '6vh' }} />
                <SelectC style={{ marginLeft: '6vh' }} />
              </Stack>
              <Input type='text' name="postcode" />
              <Form.HelpText>Enter the postcode</Form.HelpText>
              <Input type='text' name="address" />
              <Form.HelpText>Enter the Address</Form.HelpText>
            </Form.Group>
            <Form.Group >
              <Form.ControlLabel>Description</Form.ControlLabel>
              <Input as="textarea" rows={5} name='Description' />
            </Form.Group>
          </Form>
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


export default Header;