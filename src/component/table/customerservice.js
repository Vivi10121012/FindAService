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
  Rate
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { mockUsers } from '../../data/mock';
import { NameCell, ImageCell } from '../cells';
import CollaspedOutlineIcon from '@rsuite/icons/CollaspedOutline';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import RequestForm from './requestserviceform';
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase"
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { updateDoc, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import ProductDetails from '../../page/ServiceDetails';
import { getAuth, onAuthStateChanged, auth } from "firebase/auth";

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
const ProviderInfo = ({ providerId }) => {
  const [providerName, setProviderName] = useState("");

  useEffect(() => {
    const fetchProvider = async () => {
      const providerDoc = await getDoc(doc(db, "serviceProviders", providerId));
      setProviderName(providerDoc.exists() ? providerDoc.data().username : "Unknown");
    };

    fetchProvider();
  }, [providerId]);

  return <p>Provider: {providerName}</p>;
};
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
      <ProviderInfo providerId={rowData.providerId} />
      <p>Type: {rowData.type}</p>
      <p>Provider: {rowData.id}</p>
      <p>Description: {rowData.description}</p>
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

const CusServicetable = () => {
  const [data, setData] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [rating, setRating] = useState(null);;
  //可展开
  const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const servicesRef = collection(db, "services");
    const unsub = onSnapshot(servicesRef, (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setData(list);
    }, (error) => {
      console.error("Error fetching services: ", error);
    });

    return () => {
      unsub();
    };
  }, []);



  const handleClick = (rowData) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("这里是服务提供商的数据：", user.providerData);
      }
    });
    console.log('Row Data:', rowData);
    const categoryName = rowData.type;
    const providerId = rowData.providerId;
    console.log('Row Data 在这里是:', rowData);
    console.log('Category Name:', categoryName);
    console.log('providerId:', providerId);
    navigate(
      //false
      // pathname: '/cus/ProductDetails',
      // state: { providerId: rowData.id, categoryName: rowData.type }
      '/cus/ProductDetails',
      {
        state: { providerId: rowData.providerId, categoryName: rowData.type ,serviceName: rowData.name,
          pic: rowData.pic,description:rowData.description,ServiceName:rowData.name}
      });
  };

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
      <Stack className="table-toolbar" style={{ padding: '10px', background: '#fff', borderRadius: '4px 4px 0 0', justifyContent: 'right' }}>

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
        onRowClick={rowData => {
          console.log(rowData);
        }}
        renderRowExpanded={renderRowExpanded}
        rowExpandedHeight={200}
      >
        <Column width={60} align="center" fixed sortable>
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
          <NameCell dataKey="name" />
        </Column>

        <Column width={120} sortable>
          <HeaderCell>type</HeaderCell>
          <Cell dataKey="type">
          </Cell>
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

        <Column width={300} flexGrow={1} >
          <HeaderCell>operations</HeaderCell>
          {/* <Cell dataKey="email" /> */}
          <Cell style={{ padding: '5px' }}>
            {rowData => (
              <Button color="cyan" appearance="ghost" onClick={() => handleClick(rowData)}>
                CHECK
              </Button>
            )}
          </Cell>
        </Column>
      </Table>

      <RequestForm open={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  );
};

export default CusServicetable;