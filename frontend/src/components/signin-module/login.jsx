import React, { Component } from 'react';
import { Redirect } from 'react-router';
import twitter_icon from "../../twitter_icon.png";
import "./login.css";
import twitter_wallpaper from "../../twitter_wallpaper.PNG";
import { Modal, Button, Alert } from 'react-bootstrap';
import apiService from '../../services/httpService';
import authService from '../../services/authService';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email_id: "",
            password: "",
            setModal: false,
            firstName: "",
            lastName: "",
            userName: "",
            alertShow: false,
            loginSuccess: false
        }
        this.handleToggle = this.handleToggle.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
    }

    handleToggle = () => {
        this.setState({
            setModal: true
        });
    }

    handleClose = () => {
        this.setState({
            setModal: false,
            alertShow: false
        });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSignUp = async (e) => {
        e.preventDefault();
        const data = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            email_id: this.state.email_id,
            user_name: this.state.userName,
            password: this.state.password
        }
        apiService.post('http://localhost:3001/api/signup', data)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                    this.setState({
                        alertShow: true
                    })
                }
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    console.log(err.response.data);
                }
            });
    };

    handleSignIn = async (e) => {
        e.preventDefault();
        let result = await authService.login(this.state.email_id, this.state.password);
        if (result) {
            this.setState({
                loginSuccess: true
            });
        }
    };

    componentDidMount() {
        document.title = "Twitter. It's what's happening."
    }
    render() {
        let redirectVar = null;
        if (localStorage.getItem("token")) {
            redirectVar = <Redirect to="/home" />;
        }
        return (
            <>
            {redirectVar}
            <div className="row sign-in">
                <div className="col-sm-6">
                    <img src={twitter_wallpaper} className="twitter_wallpaper" alt="" />
                </div>
                <div className="col-sm-6">
                   <form className="row " onSubmit={this.handleSignIn}>
                        <div className="col-sm-4">
                            <div className="input-group mt-5 username">
                                <input type="email" className="form-control" name="email_id" placeholder="Email" aria-label="Username" aria-describedby="basic-addon1" onChange={this.handleChange} pattern="^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$'%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$" title="Please enter valid email address" required />
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="input-group ml-5 mt-5 password">
                                <input type="password" className="form-control" name="password" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" onChange={this.handleChange} required />
                            </div>
                        </div>
                        <div className="col-sm-3 loginbutton">
                                <div className="input-group mt-5 login">
                                    <button type="submit" className="btn btn-outline-primary">Log in</button>
                                </div>   
                        </div>
                    </form>
                    
                    <div className="col-sm-12 signup"> 
                        <img className="row twitter_icon" src={twitter_icon} alt="" />
                        <h2 className="row  mt-3 bodytext1">See what's happening in the world right now</h2>
                        <h2 className="row mt-5 bodytext2 ">Join Twitter today</h2>
                        <button type="button" className="btn btn-primary signup-button mt-2" onClick={this.handleToggle}>Sign up</button>
                        <Modal show={this.state.setModal} onHide={this.handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title><b>Create your account</b></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                        <form onSubmit={this.handleSignUp}>
                            <Alert show={this.state.alertShow} variant='success'>
                                Sign-up successful.
                        </Alert>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>First Name</b></span>
                                </div>
                                <input type="text" name="firstName" className="form-control" aria-label="FirstName" aria-describedby="basic-addon1" onChange={this.handleChange} pattern="^[A-Za-z ]{1,20}$" title="Please enter your first name" required />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Last Name</b></span>
                                </div>
                                <input type="text" name="lastName" className="form-control" aria-label="LastName" aria-describedby="basic-addon1" onChange={this.handleChange} pattern="^[A-Za-z ]{1,20}$" title="Please enter your last name" required />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Username</b></span>
                                </div>
                                <input type="text" name="userName" className="form-control" aria-label="Username" aria-describedby="basic-addon1" onChange={this.handleChange} pattern="^[A-Za-z0-9_]{1,20}$" title="Please enter a unique user name. Use only letters, numbers and underscore." required />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Email</b></span>
                                </div>
                                <input type="email" name="email_id" className="form-control" aria-label="Email" aria-describedby="basic-addon1" onChange={this.handleChange} pattern="^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$'%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$" title="Please enter a valid email address" required />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Password</b></span>
                                </div>
                                <input type="password" name="password" className="form-control" aria-label="Password" aria-describedby="basic-addon1" onChange={this.handleChange} />
                            </div>
                            <center>
                                <Button variant="primary" type="submit">
                                    <b>Sign Up</b>
                                </Button> &nbsp; &nbsp;
                                <Button variant="secondary" onClick={this.handleClose}>
                                    <b>Close</b>
                                </Button>
                            </center>
                        </form>
                    </Modal.Body>
                         </Modal>
                    </div>
                </div>
            </div>
        </>
        )
    }
}

export default SignIn;