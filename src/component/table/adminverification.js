import React, { useState, useEffect } from 'react';
import {
  Input,
  InputGroup,
  Table,
  Button,
  DOMHelper,
  Stack,
  SelectPicker,
  ButtonToolbar,
  IconButton,
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
// import MoreIcon from '@rsuite/icons/legacy/More';
// import DrawerView from './DrawerView';
import { mockUsers } from '../../data/mock';
import { NameCell, ImageCell } from '../cells';
import CollaspedOutlineIcon from '@rsuite/icons/CollaspedOutline';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import AddServiceForm from './addserviceform';
import { useNavigate } from "react-router-dom";
import AdminUpdate from './ad_request_update';
import {db} from "../../firebase"
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";


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
      </div>
      <p>Type: {rowData.jobType}</p>
      <p>Description: {rowData.street}</p>
    </div>
  );
};

const AdminVeriTable = () => {
  const [data, setData] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [rating, setRating] = useState(null);;
  const [compact, setCompact] = React.useState(true);
  //可展开
  const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  //点击传递数据给
  const navigate = useNavigate();
  const handleClick = (rowData) => {
    navigate("/ProductDetails", { state: { data: rowData.id } });
    console.log(rowData.id);
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "serviceProviderRequests"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        console.log("doc.data(): ", doc.data());
        list.push({id: doc.id, ...doc.data()});
      });
      setData(list);
    }, (error) => {
      console.log(error);
      console.log(data);
    });
  
    // Cleanup function
    return () => {
      unsub();
    }
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


  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  const filteredData = () => {
    const filtered = data.filter(item => {
      // 检查 item.name 是否存在，如果不存在，返回 false
      if (searchKeyword && (!item.name || !item.name.includes(searchKeyword))) {
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
  console.log(filteredData());

  // Reject the request
  const handleReject = async (rowData) => {
    try {
      await setDoc(doc(db, "serviceProviders", rowData.id), {...rowData, status: 'rejected'});
      await deleteDoc(doc(db, "serviceProviderRequests", rowData.id));
      console.log(`Service provider request ${rowData.id} rejected.`);
      // ... (refresh table data, show success message, etc.)
    } catch (error) {
      console.log(rowData);
      console.log(rowData.status);
      console.error("Error rejecting service provider request: ", error);
      // ... (show error message, etc.)
    }
  };


  // //recept the request
  // const handleApprove = async (rowData) => {
  //   try {
  //     await setDoc(doc(db, "serviceProviders", rowData.id), rowData);
  //     await deleteDoc(doc(db, "serviceProviderRequests", rowData.id));
  //     console.log(`Service provider request ${rowData.id} approved.`);
  //     // ... (refresh table data, show success message, etc.)
  //   } catch (error) {
  //     console.error("Error approving service provider request: ", error);
  //     // ... (show error message, etc.)
  //   }
  // };

  // Accept the request
const handleApprove = async (rowData) => {
  try {
    await setDoc(doc(db, "serviceProviders", rowData.id), {...rowData, status: 'approved'});
    await deleteDoc(doc(db, "serviceProviderRequests", rowData.id));
    console.log(`Service provider request ${rowData.id} approved.`);
    // ... (refresh table data, show success message, etc.)
  } catch (error) {
    console.error("Error approving service provider request: ", error);
    // ... (show error message, etc.)
  }
};

  //request update the service
  const handleRequestUpdate = async (rowData) => {
    try {
      // 存储更新请求到数据库中，以服务商的唯一标识符作为索引
      await setDoc(doc(db, "serviceProviderRequests", rowData.id), { updateRequested: true, ...rowData });
      console.log(`Update requested for service provider ${rowData.id}.`);
      // ... (显示成功消息等)
    } catch (error) {
      console.error("Error requesting service update: ", error);
      // ... (显示错误消息等)
    }
  };

  return (
    <>
      <Table
        height={Math.max(getHeight(window) - 150, 400)}
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
      >
        <Column width={60} align="center" fixed sortable>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={70} align="center">
          <HeaderCell>#</HeaderCell>
          <ExpandCell dataKey="id" expandedRowKeys={expandedRowKeys} onChange={handleExpanded} />
        </Column> 

         {/* <Column width={80} align="center">
          <HeaderCell>Services</HeaderCell>
          <ImageCell dataKey="pic" />
        </Column>  */}

         {/* <Column minWidth={100} flexGrow={1} sortable>  */}

        <Column width={300} sortable flexGrow={1}>
          <HeaderCell>Service Provider Name</HeaderCell>
          <NameCell dataKey="username" />
        </Column>

        <Column width={100} sortable>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>

        <Column width={150} sortable>
          <HeaderCell>Address</HeaderCell>
          <Cell dataKey="address" />
        </Column>
        
        <Column width={100} sortable>
          <HeaderCell>description</HeaderCell>
          <Cell dataKey="description" />
        </Column>


        <Column width={115}>
          <HeaderCell></HeaderCell>
          <Cell style={{ padding: '5px' }}>
          {rowData => (
              <Button color="green" appearance="primary" onClick={() => handleApprove(rowData)}>
                APPROVE
              </Button>
            )}
           </Cell>    
        </Column>

        <Column width={100}>
          <HeaderCell>operations</HeaderCell>
          <Cell style={{ padding: '5px' }}>
            {rowData => (
              <Button color="red" appearance="primary" onClick={() => handleReject(rowData)}>
                REJECT
              </Button>
            )}
          </Cell>   
        </Column>

        <Column width={150} flexGrow={1}>
          <HeaderCell></HeaderCell>
          <Cell style={{ padding: '5px' }}>
          {rowData => (
              <Button color="blue" appearance="primary" onClick={() => handleRequestUpdate(rowData)}>
                REQUSET UPDATE
              </Button>
            )}
           </Cell>    
        </Column>
      </Table>

      <AdminUpdate open={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  );
};

export default AdminVeriTable;