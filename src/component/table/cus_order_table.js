import React, { useState, useEffect } from 'react';
import {
    Input,
    InputGroup,
    Table,
    Button,
    DOMHelper,
    Stack,
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
import CusUpdateRe from './cus_update_requireform';
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

const CusOrderTable = () => {
    const [showDrawer, setShowDrawer] = useState(false);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [rating, setRating] = useState(null);
    const [data, setData] = useState([]);
    const [userStatus, setUserStatus] = useState(null);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchData = async () => {
          onAuthStateChanged(auth, async (user) => {
            if (user) {
              const uid = user.uid;
              // 获取用户状态
              const docRef = doc(db, "customer_requests", uid);  
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                console.log('User document data:', docSnap.data());
                setUserStatus(docSnap.data().status);
              } else {
                console.log("No such document!");
              }
    
              // 获取服务数据
              const servicesRef = collection(db, "customer_requests");
              const serviceSnapshot = await getDocs(query(servicesRef, where("customerId", "==", uid)));
              console.log(uid);
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
    

      
    //可展开
    const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);

    const handleUpdate = async (rowData) => {
        setShowDrawer(true);
        try {
            console.log("Handle Demand data:", rowData);
            const docRef = doc(db, "customer_requests", rowData.requestId); // 使用data.requestId获取请求的ID
            await updateDoc(docRef, { status: "demanded" });
            console.log(`Customer request ${rowData.requestId} demanded.`);

            // ...（刷新表格数据、显示成功消息等）
        } catch (error) {
            console.error("Error rejecting customer request: ", error);
            // ...（显示错误消息等）
        }
    };

    const renderRowExpanded = rowData => {
        return (
            <div>
                <p>Name: {rowData.name}</p>
                <p>Type: {rowData.address}</p>
                <p>Description: {rowData.description}</p>
                <Stack style={{justifyContent: 'right' }}>
                {/* 在这里实现，如果button里的内容是request further details，就可以点开出现更改按钮 */}
                {rowData.status === 'demanded' && (
                    <Button color="cyan" appearance="ghost" style={{marginRight:'5px'}}  onClick={() => { handleUpdate(rowData); }}>
                        UPDATE
                    </Button>
                )}
                {rowData.status === 'demanded' && (
                    <Button color="red" appearance="ghost">
                        REJECT
                    </Button>
                )}
                </Stack>
            </div>
        );
    };

    //点击传递数据给
    const navigate = useNavigate();
    const handleClick = (rowData) => {
        navigate("/ProductDetails", { state: { data: rowData.id } });
        console.log(rowData.id);
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

                <Stack spacing={6}>
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
                rowExpandedHeight={200}
            >
                <Column width={140} align="center" fixed sortable>
                    <HeaderCell>Request Number</HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <Column width={70} align="center">
                    <HeaderCell>#</HeaderCell>
                    <ExpandCell dataKey="id" expandedRowKeys={expandedRowKeys} onChange={handleExpanded} />
                </Column>

                {/* <Column minWidth={100} flexGrow={1} sortable> */}
                <Column width={200} sortable flexGrow={1}>
                    <HeaderCell>Service Name</HeaderCell>
                    <Cell dataKey="name" />
                </Column>

                <Column width={300} flexGrow={1}>
                    <HeaderCell>Status</HeaderCell>
                    <Cell style={{ padding: '5px' }}>
                        {rowData => (
                            <Button color="orange" appearance="primary" onClick={() => handleClick(rowData)} disabled>
                                {rowData.status} {/* 使用status字段显示状态 */}
                                <CusUpdateRe open={showDrawer} onClose={() => setShowDrawer(false)} rowData={rowData}  />
                            </Button>
                        )}
                    </Cell>
                </Column>

                <Column width={300} flexGrow={1}>
                    <HeaderCell></HeaderCell>
                    <Cell>
                    {rowData => (
                            <CusUpdateRe open={showDrawer} onClose={() => setShowDrawer(false)} rowData={rowData}  />
                        )}
                    </Cell>
                </Column>
            </Table>

            {/* <CusUpdateRe open={showDrawer} onClose={() => setShowDrawer(false)} /> */}
        </>
    );
};

export default CusOrderTable;