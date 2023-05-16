import React from 'react'
import './tokyo.css'
import service2Image from '../../../image/service2.jpeg';
import {
    Button
} from 'rsuite';

const InitialHomePage = () => {
    return (
        <>
            <div className="tokyo_tm_home">
                <div className="home_content">
                    <div className="avatar">
                        <div
                            className="image avatar_img"
                            style={{
                                backgroundImage: `url(${service2Image})`,
                            }}
                        />
                    </div>
                    <div className="details">
                        <h3 className="name">Find a Service</h3>
                        <p className="job">
                            A trusted service provider to help you find services in your local area 😄
                        </p>
                        <Button color="cyan" appearance="ghost" style={{ marginRight: '10px',marginBottom:"10px"} } href='/SignIn'>
                           Customer Sign In
                        </Button>
                        <Button color="cyan" appearance="ghost" style={{ marginRight: '10px',marginBottom:"10px" } } href='/SignUp'>
                           CustomerSign Up
                        </Button>
                        <Button color="blue" appearance="ghost" style={{ marginRight: '10px',marginBottom:"10px" } } href='/SerSignUp'>
                           Provider Sign In
                        </Button>
                        <Button color="blue" appearance="ghost" style={{ marginRight: '10px'} } href='/SerSignIn'>
                           Provider Sign Up
                        </Button>
                        <Button color="orange" appearance="ghost" href='/AdminSignIn'>
                           Admin Sign Up
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InitialHomePage;