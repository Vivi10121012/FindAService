import React, { useState ,useEffect} from "react";
import { Row, Col, Image, Button, Rate, Divider } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "./ProductDetails.css";
import { mockUsers } from '../data/mock';
import { db, storage } from '../firebase';
import { collection, doc, setDoc, addDoc, serverTimestamp, getDoc,query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateDoc } from "firebase/firestore";
import { Category } from "@mui/icons-material";
import { getDocs, onSnapshot } from "firebase/firestore";

const data = mockUsers(20);

function ProductDetails(props) {
  const [cartItems, setCartItems] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [categoryName, setCategoryName] = useState("");
  const [status, setStatus] = useState("");
  const pending = "pending";
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const [requestId, setRequestId] = useState("")
  const [providerId, setProviderId] = useState("");
  const [data, setData] = useState([]);
  const [reviewdata, setReviewData] = useState([]);
  const [pic,setPic] = useState("");
  

  const getalldata = location.state; 
  console.log("fet"+getalldata.providerId);

  // move onAuthStateChanged here
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUserId(user.uid);
        console.log("这是用户id", user.uid); // note use user.uid here
      } else {
        // User is signed out
        setUserId(null);
      }
    });
  
    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
          // 获取服务数据
          const servicesRef = collection(db, "services");
          const serviceSnapshot = await getDocs(query(servicesRef, where("name", "==", getalldata.serviceName)));
          let list = [];
          serviceSnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setData(list);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchreviewData = async () => {
          // 获取服务数据
          const servicesRef = collection(db, "completedOrder");
          const serviceSnapshot = await getDocs(query(servicesRef, where("name", "==", getalldata.serviceName)));
          let list = [];
          serviceSnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setReviewData(list);
          console.log("reviewdata"+reviewdata);
    };
    fetchreviewData();
  }, []);

  // useEffect(() => {
  //   console.log('Location State:', location.state);
    
  //   if (location.state) {
  //     setCategoryName(location.state.categoryName);
  //     setProviderId(location.state.providerId);
  //   }
  
  //   console.log('categoryName', categoryName);
  //   console.log('Provider ID:', providerId);
  // }, [location.state]);

  useEffect(() => {
    console.log('Location State:', getalldata);
    console.log("类别是"+getalldata.providerId);
    if (location.state) {
      setCategoryName(getalldata.categoryName);
      setProviderId(getalldata.providerId);
      setPic(getalldata.pic);
      setDescription(getalldata.description);
      setServiceName(getalldata.ServiceName);
    }
  
    console.log('categoryName', categoryName);
    console.log('Provider ID:', providerId);
  });

  useEffect(() => {
    console.log('Provider ID:', providerId);
  }, [providerId]);

  const handleAddToCart = () => {
    setCartItems(cartItems + 1);
    setShowForm(true);
  };

  const handleCancel = () => {
    setName("");
    setEmail("");
    setDate("");
    setTime("");
    setAddress("");
    setStatus("");
    setUserId("");
    setDescription("");
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("在表单提交中的用户ID:", userId);
  
    addDoc(collection(db, "customer_requests"), {
      name: name,
      email: email,
      date: date,
      time: time,
      address: address,
      description: description,
      status: 'pending',
      timestamp: serverTimestamp(),
      customerId: userId,
      targetProviderId: providerId,
      serviceName:serviceName
    })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        setRequestId(docRef.id);
        setShowForm(false);
        setName("");
        setEmail("");
        setDate("");
        setTime("");
        setAddress("");
        setStatus("");
        setUserId("");
        setDescription("");
        setServiceName("")
  
        return updateDoc(doc(db, "customer_requests", docRef.id), {
          requestId: docRef.id,
        });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  return (
    <div className="product-details" >
      <div className="product-details__back">
        <Button
          type="primary"
          icon={<LeftOutlined />}
          size="large"
          shape="round"
          style={{ backgroundColor: "#a86cf5", marginBottom: "40px" }} href="/cus/CusserIndex"
        >
          Return to ServiceList
        </Button>
      </div>
      <div className="product-details__">
        <Row gutter={[24, 24]} justify="center" className="product-details__container">
          <Col xs={24} md={12} className="product-details__image-container">
            <Image
              src={pic}
              alt="Product Image"
              preview={false}
              className="product-details__image"
            />
          </Col>
          <Col xs={24} md={12}>
            <div className="product-details__info">

              <div className="product-details__title">{categoryName}</div>
              <div className="product-details__price">$100</div>
              <div className="product-details__description">
               {description}
              </div>
              <div className="cart-form-container">
                <div className="product-details__cart">
                  <button onClick={handleAddToCart} style={{ backgroundColor: "#a86cf5", color: "white", padding: "10px 20px", borderRadius: "5px", border: "none", boxShadow: "2px 2px 5px grey" }}>Request Service</button>
                </div>
                {showForm && (
                  <div className="cart-form">
                    <h3 style={{ color: "#a86cf5", textAlign: 'center' }}>Order Details</h3>
                    <form onSubmit={handleFormSubmit} style={{ boxShadow: "2px 2px 5px grey", padding: "20px", backgroundColor: "#f1f1f1", borderRadius: "10px" }}>
                      <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>Name</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginRight: "10px", padding: "10px", borderRadius: "5px", border: "1px solid grey", marginBottom: "10px", width: "95%" }}
                      />
                      <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>Email</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid grey", marginBottom: "10px", width: "95%" }}
                      />
                      
                      <label htmlFor="date" style={{ display: "block", marginBottom: "5px" }}>Date</label>
                      <input 
                        type="date" 
                        id="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid grey", marginBottom: "10px", width: "95%" }}
                       />
                      <label htmlFor="time" style={{ display: "block", marginBottom: "5px" }}>Time</label>
                      <input 
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid grey", marginBottom: "10px", width: "95%" }}
                      />
                      <label htmlFor="address" style={{ display: "block", marginBottom: "5px" }}>Address</label>
                      <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid grey", marginBottom: "10px", width: "95%" }}
                      />
                      <label htmlFor="description" style={{ display: "block", marginBottom: "5px" }}>Request Description</label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid grey", marginBottom: "20px", width: "95%", height: "100px" }}
                      ></textarea>
                      <button type="submit" style={{ backgroundColor: "#a86cf5", color: "white", padding: "10px 20px", borderRadius: "5px", border: "none", boxShadow: "2px 2px 5px grey" }}>Submit</button>
                      <button type="button" onClick={handleCancel} style={{ backgroundColor: "grey", color: "white", padding: "10px 20px", borderRadius: "5px", border: "none", boxShadow: "2px 2px 5px grey" }}>Cancel</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Divider style={{ borderColor: "#d9d9d9" }} />
      <div className="product-details__reviews">
        <div className="product-details__reviews-title" >Customer Reviews</div>
        {reviewdata.map((review, index) => (
          <div className="product-details__review" key={index}>
            <div className="product-details__review-user">
              {reviewdata.email}{" "}
              <span className="product-details__review-date">{reviewdata.timeSamp}</span>
            </div>
            <Rate disabled defaultValue={review.rating} />
            <div className="product-details__review-text">{reviewdata.review}</div>
            <Divider style={{ borderColor: "#d9d9d9" }} />
          </div>
        ))}
      </div>
    </div>
  );
};


export default ProductDetails;
