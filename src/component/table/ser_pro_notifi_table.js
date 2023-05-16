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
    Rate,
    Notification,
    Placeholder,
    Modal
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
// import MoreIcon from '@rsuite/icons/legacy/More';
// import DrawerView from './DrawerView';
import { mockUsers } from '../../data/mock';
import { NameCell, ImageCell } from '../cells';
import CollaspedOutlineIcon from '@rsuite/icons/CollaspedOutline';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import DemandForm from './demandform';
import { collection, doc, setDoc, addDoc, serverTimestamp, getDoc, query, where, getDocs } from "firebase/firestore";
import { db, storage } from '../../firebase';
import { onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateDoc } from "firebase/firestore";

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
            <p>Servicename: {rowData.name}</p>
            <p>CustomerId: {rowData.customerId}</p>
            <p>Address: {rowData.address}</p>
            <p>Date: {rowData.date}</p>
            <p>Description: {rowData.description}</p>
        </div>
    );
};


const Notifiprotable = () => {
    const [data, setData] = useState([]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [rating, setRating] = useState(null);;
    const [open, setOpen] = React.useState(false);
    const auth = getAuth();
    const user = auth.currentUser;
    const [userStatus, setUserStatus] = useState(null);
    //可展开
    const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);
    const [requestRef, setRequestRef] = useState(null);
    const [requestId, setRequestId] = useState("");

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
                    const serviceSnapshot = await getDocs(query(servicesRef, where("targetProviderId", "==", uid)));
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

    // accept

    const handleApprove = async (rowdata) => {
        setOpen(true);
        try {
            const docRef = doc(db, "customer_requests", rowdata.requestId);
            await updateDoc(docRef, { status: "approved" });
            console.log(`Customer request ${rowdata.requestId} approved.`);
            console.log('Status:', rowdata.status); // 获取status字段的值
            // ...（刷新表格数据、显示成功消息等）
        } catch (error) {
            console.error("Error approving customer request: ", error);
            // ...（显示错误消息等）
        }
    };

    //reject

    // Reject the request
    const handleReject = async (rowData) => {
        setOpen(true);
        try {
            console.log("Handle Reject data:", rowData);
            const docRef = doc(db, "customer_requests", rowData.requestId); // 使用data.requestId获取请求的ID
            await updateDoc(docRef, { status: "rejected" });
            console.log(`Customer request ${rowData.requestId} rejected.`);
            // ...（刷新表格数据、显示成功消息等）
        } catch (error) {
            console.error("Error rejecting customer request: ", error);
            // ...（显示错误消息等）
        }
    };

    // demand the request
    const handleDemand = async (rowData) => {

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

    const handleComplete = async (rowData) => {
        try {
            console.log("Handle Complete data:", rowData);
            const docRef = doc(db, "customer_requests", rowData.requestId); // 使用data.requestId获取请求的ID
            await updateDoc(docRef, { status: "completed" });
            console.log(`Customer request ${rowData.requestId} completed.`);

            // 存储到completedOrder集合中
            const completedOrderData = {
                name: rowData.name,
                requestId: rowData.requestId,
                customerId: rowData.customerId,
                email: rowData.email,
                date: rowData.date,
                address: rowData.address,
                description: rowData.description,
                status: "completed",
                targetProviderId: rowData.targetProviderId,
                time: rowData.time,
                timeSamp: serverTimestamp(),
                serviceName: rowData.serviceName,
                // 其他字段...
            };
            await addDoc(collection(db, "completedOrder"), completedOrderData);

            // ...（刷新表格数据、显示成功消息等）
        } catch (error) {
            console.error("Error completing customer request: ", error);
            // ...（显示错误消息等）
        }
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

    //弹窗
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const Message = React.forwardRef(({ type, ...rest }, ref) => {
        return (
            <Notification ref={ref} {...rest} type={type} header={type}>
                <p style={{ width: 280 }}>Successful operation!</p>
            </Notification>
        );
    });


    const handleSortColumn = (sortColumn, sortType) => {
        setSortColumn(sortColumn);
        setSortType(sortType);
    };

    const filteredData = () => {
        const filtered = data.filter(item => {
            if (!item.name?.includes(searchKeyword)) {//搜索 这里搜索的是name
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
                    <Button color="blue" appearance="primary">
                        Accept All
                    </Button>
                    <Button color="blue" appearance="primary">
                        Reject All
                    </Button>
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
                <Column width={60} align="center" fixed sortable>
                    <HeaderCell>Id</HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <Column width={70} align="center">
                    <HeaderCell>#</HeaderCell>
                    <ExpandCell dataKey="id" expandedRowKeys={expandedRowKeys} onChange={handleExpanded} />
                </Column>

                <Column width={150} sortable>
                    <HeaderCell>Customer Name</HeaderCell>
                    <Cell dataKey="name"></Cell>
                </Column>

                <Column width={150} sortable>
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey="email" />
                </Column>

                <Column width={120} align="center">
                    <HeaderCell>Date</HeaderCell>
                    <Cell dataKey="date" />
                </Column>


                {/* <Column width={300} sortable flexGrow={1}>*/}
                <Column minWidth={100} sortable>
                    <HeaderCell>Time</HeaderCell>
                    <Cell dataKey="time" />
                </Column>

                <Column minWidth={100} sortable>
                    <HeaderCell>Address</HeaderCell>
                    <Cell dataKey="address" />
                </Column>

                <Column width={150} sortable>
                    <HeaderCell>Description</HeaderCell>
                    <Cell dataKey="description" />
                </Column>


                <Column width={300} flexGrow={1}>
                    <HeaderCell>operations</HeaderCell>
                    <Cell style={{ padding: '5px' }}>
                        <ButtonToolbar>
                            {filteredData().map(rowData => ( // 遍历数据并为每一行创建按钮
                                <div key={rowData.id}>
                                    <Button
                                        color="cyan"
                                        appearance="ghost"
                                        onClick={() => handleApprove(rowData)} // 将rowData作为参数传递给handleApprove函数
                                        style={{marginRight:'10px'}}
                                    >
                                        ACCEPT
                                    </Button>
                                    <Button
                                        color="blue"
                                        appearance="ghost"
                                        onClick={() => handleReject(rowData)} // 将rowData作为参数传递给handleReject函数\
                                        style={{marginRight:'10px'}}
                                    >
                                        REJECT
                                    </Button>
                                    <Button
                                        color="green"
                                        appearance="ghost"
                                        onClick={() => { setShowDrawer(true); handleDemand(rowData); }}
                                        style={{marginRight:'10px'}}
                                    >
                                        DEMAND
                                    </Button>
                                    <Button
                                        color="red"
                                        appearance="ghost"
                                        onClick={() => handleComplete(rowData)} // 将rowData作为参数传递给handleReject函数
                                    >
                                        COMPLETE
                                    </Button>
                                </div>
                            ))}
                        </ButtonToolbar>
                    </Cell>
                </Column>
            </Table>

            <Modal open={open} onClose={handleClose} size="xs">
                <Message type="success" />
            </Modal>
            <DemandForm open={showDrawer} onClose={() => setShowDrawer(false)} />
        </>
    );
};

export default Notifiprotable;