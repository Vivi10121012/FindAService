import React, { useState, useEffect } from 'react';
import {
  Input,
  InputGroup,
  Table,
  Button,
  DOMHelper,
  Progress,
  Checkbox,
  Stack,
  SelectPicker,
  ButtonToolbar,
  IconButton,
  Rate,
  Modal
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
// import MoreIcon from '@rsuite/icons/legacy/More';
// import DrawerView from './DrawerView';
import { mockUsers } from '../../data/mock';
import { NameCell, ImageCell } from '../cells';
import CollaspedOutlineIcon from '@rsuite/icons/CollaspedOutline';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import AddServiceForm from './addserviceform';
import {db} from "../../firebase"
import { collection, getDocs, getDoc, query, where } from "firebase/firestore";
import { updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import UpdateServiceForm from "./UpdateServiceForm"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { message } from 'antd';
import { toast } from 'react-toastify';
import { notification } from 'antd';

// 数据是假的，随机生成的，需要自己导入
// const data = mockUsers(20);

const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;


//可展开
const rowKey = 'id';

const ExpandCell = ({ rowData, dataKey, expandedRowKeys, onChange, ...props }) => (
  <Cell {...props} style={{ padding: 5 }}>
    <IconButton
      appearance="subtle"
      onClick={() => {
        onChange(rowData);
      }}
      icon={
        expandedRowKeys.some(key => key === rowData[rowKey]) ? (
          <CollaspedOutlineIcon />
        ) : (
          <ExpandOutlineIcon />
        )
      }
    />
  </Cell>
);
//展开的内容
const renderRowExpanded = rowData => {
  return (
    <div>
      <div
        style={{
          width: 60,
          height: 60,
          float: 'left',
          marginRight: 10,
          background: '#eee'
        }}
      >
        <img src={rowData.pic} style={{ width: 60 }} />
      </div>
      <p>Name: {rowData.name}</p>
      <p>Type: {rowData.type}</p>
      <p>Description: {rowData.description}</p>
      <p>Availability: {rowData.availability}</p>
    </div>
  );
};

//获取rating星星,之后用于筛选框
const ratingList = Array.from({ length: 5 }).map((_, index) => {
  return {
    value: index + 1,
    label: Array.from({ length: index + 1 })
      .map(() => '⭐️')
      .join('')
  };
});



const AllServiceprotable = () => {
  const [data, setData] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [rating, setRating] = useState(null);;
  const [compact, setCompact] = React.useState(true);
  const [showModal, setShowModal] = useState(false);
  //可展开
  const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const [userStatus, setUserStatus] = useState(null); // new state for user status

  

  const checkForUpdateRequest = async () => {
    const docRef = doc(db, "serviceProviderRequests", user.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
  
    if (data && data.updateRequested) {
      notification.open({
        message: 'Admin Update Request',
        description: 'Please update your service.',
        duration: 15, // 持续时间（秒）
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          // 获取用户状态
          const docRef = doc(db, "serviceProviders", uid);  // 修改为 serviceProviders 集合
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log('User document data:', docSnap.data());
            setUserStatus(docSnap.data().status);
            checkForUpdateRequest();
          } else {
            console.log("No such document!");
          }

          // 获取服务数据
          const servicesRef = collection(db, "services");
          const serviceSnapshot = await getDocs(query(servicesRef, where("providerId", "==", uid)));
          let list = [];
          serviceSnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setData(list);
        } else {
          console.log("User is not logged in or data is not loaded yet.");
        }
      });
      checkForUpdateRequest();
      // ...
    };

    fetchData();
  }, []);


  const handleExpanded = (rowData, dataKey) => {
    let open = false;
    const nextExpandedRowKeys = [];

    expandedRowKeys.forEach(key => {
      if (key === rowData[rowKey]) {
        open = true;
      } else {
        nextExpandedRowKeys.push(key);
      }
    });

    if (!open) {
      nextExpandedRowKeys.push(rowData[rowKey]);
    }

    setExpandedRowKeys(nextExpandedRowKeys);
  };

  const handleDelete = async (id) => {
    if (userStatus !== 'approved') {
      // 显示警告
      message.warning('Operation restriction! You are not approved and cannot perform this operation.');
      return;
    }
    const docRef = doc(db, "services", id);
  
    try {
      await deleteDoc(docRef);
      console.log(`Document with ID ${id} deleted`);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleUpdateClick = (service) => {
    if (userStatus !== 'approved') {
      // 显示警告
      message.warning('Operation restriction! You are not approved and cannot perform this operation.');
      return;
    }
    setSelectedService(service);
    setShowUpdateForm(true);
    
  };

  const handleCloseUpdateForm = () => {
    setSelectedService(null);
    setShowUpdateForm(false);
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  const filteredData = () => {
    const filtered = data.filter(item => {
      if (!item.name.includes(searchKeyword)) {//搜索 这里搜索的是name
        return false;
      }

      if (rating && item.rating !== rating) {
        return false;
      }

      return true;
    });

    if (sortColumn && sortType) {
      return filtered.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];

        if (typeof x === 'string') {
          x = x.charCodeAt(0);
        }
        if (typeof y === 'string') {
          y = y.charCodeAt(0);
        }

        if (sortType === 'asc') {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return filtered;
  };


  
  return (
    <>
  
      <Stack className="table-toolbar" style={{ padding: '10px', background: '#fff', borderRadius: '4px 4px 0 0', justifyContent: 'space-between' }}>
        <Button appearance="primary" onClick={() => setShowDrawer(true)}>
          Add Services
        </Button>

        {/* rate筛选 */}
        <Stack spacing={6}>
          <SelectPicker
            label="Rating"
            data={ratingList}
            value={rating}
            onChange={setRating}
          />
          {/* 搜索框 */}
          <InputGroup inside>
            <Input placeholder="Search" value={searchKeyword} onChange={setSearchKeyword} />
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>
        </Stack>
      </Stack>

      <Table
        height={Math.max(getHeight(window) - 200, 400)}
        data={filteredData()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        rowKey={rowKey}
        expandedRowKeys={expandedRowKeys}
        onRowClick={data => {
          console.log(data);
        }}
        renderRowExpanded={renderRowExpanded}
        rowExpandedHeight = {200}
      >
        <Column width={100} align="center" fixed sortable>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={70} align="center">
          <HeaderCell>#</HeaderCell>
          <ExpandCell dataKey="id" expandedRowKeys={expandedRowKeys} onChange={handleExpanded} />
        </Column>

        <Column width={80} align="center">
          <HeaderCell>Services</HeaderCell>
          <ImageCell dataKey="pic" />
        </Column>

        {/* <Column minWidth={100} flexGrow={1} sortable> */}
        <Column width={300} sortable flexGrow={1}>
          <HeaderCell>Service Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column width={100} sortable>
          <HeaderCell>type</HeaderCell>
          <Cell dataKey="type" />
        </Column>

        <Column width={150} sortable>
          <HeaderCell>city</HeaderCell>
          <Cell dataKey="city" />
        </Column>

        <Column width={100} sortable>
          <HeaderCell>Rating</HeaderCell>
          <Cell dataKey="rating">
            {rowData =>
              Array.from({ length: rowData.rating }).map((_, i) => <span key={i}>⭐️</span>)
            }
          </Cell>
        </Column>

        <Column width={100} sortable>
          <HeaderCell>Price</HeaderCell>
          <Cell dataKey="price">{rowData => `$${rowData.price}`}</Cell>
        </Column>

        <Column width={300} flexGrow={1}>
          <HeaderCell>operations</HeaderCell>
          <Cell dataKey="id" style={{ padding: '5px' }}>
            {rowData => (
              <ButtonToolbar>
                <Button color="blue" appearance="ghost" onClick={() => handleUpdateClick(rowData)}>
                  UPDATE
                </Button>
                <Button color="red" appearance="ghost" onClick={() => handleDelete(rowData.id)}>
                  DELETE
                </Button>
              </ButtonToolbar>
            )}
          </Cell>
        </Column>
      </Table>
    

      <AddServiceForm open={showDrawer} onClose={() => setShowDrawer(false)} />

      {selectedService && (
        <UpdateServiceForm
          open={showUpdateForm}
          service={selectedService}
          onClose={handleCloseUpdateForm}
        />
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Admin Update Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please update your service.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
    
  );
};

export default AllServiceprotable;