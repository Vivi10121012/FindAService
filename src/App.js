import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter, Routes, Route, Link, Redirect, Navigate } from 'react-router-dom';
import { createRoot } from "react-dom/client";
import { Button, Sidebar } from "rsuite";
import 'rsuite/dist/rsuite.min.css';
import Header from './component/Header';
import Sidebarpro from './component/sidebar';
import ServiceIndex from './component/table/serviceindex';
import NotiproIndex from './component/table/noti_pro_index';
import CusserIndex from './component/table/cus_ser_index';
import CusSidebarpro from './component/cussidebar';
import Homepage from './page/homepage';
import ProductDetails from './page/ServiceDetails';
import AuthDetails from "./component/auth/AuthDetails"
import SignUp from './page/SignUp';
import SignIn from './page/SignIn';
import { auth } from './firebase';
import { AuthContext } from './context/AuthContext';
import SerSignUp from './page/SerSignUp';
import SerSignIn from './page/SerSignIn';
import AdminDashboard from './page/AdminHomepage';
import ServiceProDashboard from './page/ServiceHomepage';
import CusNotiproIndex from './component/cusnoti_index';
import CusOrderIndex from './component/cus_order_index';
import AdminSidebar from './component/AdminSideBar';
import AdminNotiIndex from './component/AdminNotiIndex';
import AdminReviewIndex from './component/admin_review_index';
import AdVerIndex from './component/AdminVerIndex';
import HomeView from './component/HomePage/page/HomeView';
import AdmSignIn from './page/AdmSignIn';


// 首页
function ViewHome() {
  return (
    <div>
      <h1>HomePage</h1>
      <p>This is homepage.</p>
    </div>
  );
}

// 页面布局
function AppLayout() {
  // const [currentUser, setCurrentUser] = useState(null);
  const { currentUser } = useContext(AuthContext)

  const RequireAuth = ({ children }) => {
    console.log("RequireAuth currentUser:", currentUser);
    return currentUser ? children : <Navigate to="/SignIn" />
  };
  console.log(currentUser);
  return (
    <BrowserRouter>
    <Routes>
      {/* 首页 */}
      <Route path="/" element={<HomeView tabIndex={0} />}> </Route>
      <Route path="/About" element={<HomeView tabIndex={1} />}> </Route>
      {/* <Route path="/SignUp" element={<RequireAuth><SignUp /></RequireAuth>} /> */}
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/SerSignUp" element={<SerSignUp />} />
      <Route path="/SerSignIn" element={<SerSignIn />} />
      <Route path="/AdminSignIn" element={<AdmSignIn />} />
      {/* Service Provider */}
      <Route path="/provider" element={<RequireAuth><Sidebarpro /></RequireAuth>}>
        <Route index element={<RequireAuth>< ServiceProDashboard /></RequireAuth>} />
        <Route path="/provider/NotiproIndex" element={<RequireAuth><NotiproIndex /></RequireAuth>} />
        <Route path="/provider/ServiceIndex" element={<RequireAuth><ServiceIndex /></RequireAuth>} />
        <Route path="/provider/ProductDetails" element={<RequireAuth><ProductDetails /></RequireAuth>} />
      </Route>
      {/* customer */}
      <Route path="/cus" element={<RequireAuth><CusSidebarpro /></RequireAuth>}>
        <Route index element={<RequireAuth>< Homepage /></RequireAuth>} />
        <Route path="/cus/CusserIndex" element={<RequireAuth><CusserIndex /></RequireAuth>} />
        <Route path="/cus/ProductDetails" element={<RequireAuth><ProductDetails /></RequireAuth>} render={(props) => <ProductDetails {...props} />}/>
        <Route path="/cus/CusNotification" element={<RequireAuth><CusNotiproIndex /></RequireAuth>} />
        <Route path="/cus/CusOrder" element={<RequireAuth><CusOrderIndex /></RequireAuth>} />
      </Route>
      {/* Admin */}
      <Route path="/admin" element={<RequireAuth>< AdminSidebar /></RequireAuth>}>
        <Route index element={<RequireAuth>< AdminDashboard /></RequireAuth>} />
        <Route path="/admin/AdVerIndex" element={<RequireAuth><AdVerIndex /></RequireAuth>} />
        <Route path="/admin/AdminNotification" element={<RequireAuth><AdminNotiIndex /></RequireAuth>} />
        <Route path="/admin/AdminReviewIndex" element={<RequireAuth><AdminReviewIndex /></RequireAuth>} />
      </Route>
    </Routes>
  </BrowserRouter>
);
}

// 渲染布局组件
// ReactDOM.render(<AppLayout />, document.getElementById('App'))
export default AppLayout;