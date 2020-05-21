import React, { Component } from 'react';
import { Route, Switch, Redirect, NavLink, Link } from "react-router-dom";
import ProfileTweets from './profileTweets';
import ProfileLikes from './profileLikes';
import RightPanel from "../right-panel/rightPanel";
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import ProfileDetails from './ProfileDetails';
import placeholder from '../common/placeholder.jpg';
import { Modal, Button } from 'react-bootstrap';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            logout: false
        };
    }

    // componentWillUnmount() {
    //     localStorage.removeItem("profile_user_id");
    // }

    getProfile = async () => {
        if (this.props.match.params.user_id) {
            let user_id = this.props.match.params.user_id;
            localStorage.setItem("profile_user_id", user_id);
            await this.setState({});
        }
        let result = await apiService.get(`${backendURI}/api/profile/${localStorage.getItem("profile_user_id")}`);
        let user_profile = result.data;
        await this.setState({ user_profile });

        if (user_profile.user_id === localStorage.getItem("user_id")) {
            if (user_profile.user_image)
                localStorage.setItem("user_image", user_profile.user_image);
            else
                localStorage.removeItem("user_image");
        }

        if (user_profile)
            document.title = user_profile.first_name + " / Twitter";
        else
            document.title = "Profile / Twitter";
    };

    componentWillReceiveProps() {
        this.getProfile();
    }

    componentDidMount() {
        this.getProfile();
    }

    followUser = async (e) => {
        let data = {
            user_id: localStorage.getItem("user_id"),
            target_user_id: this.state.user_profile.user_id
        };
        let result = await apiService.post(`${backendURI}/api/follow`, data);
        if (result.status === 200) {
            let user_profile = this.state.user_profile;
            user_profile.followers.push({
                _id: localStorage.getItem("user_id"),
                first_name: localStorage.getItem("first_name"),
                last_name: localStorage.getItem("last_name"),
                user_name: localStorage.getItem("user_name"),
                user_image: localStorage.getItem("user_image")
            });
            await this.setState({ user_profile });
        }
    };

    unfollowUser = async (e) => {
        let data = {
            user_id: localStorage.getItem("user_id"),
            target_user_id: this.state.user_profile.user_id
        };
        let result = await apiService.post(`${backendURI}/api/follow/unfollow`, data);
        if (result.status === 200) {
            let user_profile = this.state.user_profile;
            let index = user_profile.followers.findIndex(follower => follower._id === localStorage.getItem("user_id"));
            if (index > -1)
                user_profile.followers.splice(index, 1);
            await this.setState({ user_profile });
        }
    };

    onProfileImageClick = (e) => {
        let modal = document.getElementById("imageModal");
        var modalImage = document.getElementById("image_modal");
        modal.style.display = "block";
        modalImage.src = e.target.src;

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }
    };

    editProfile = () => {
        let user_profile = this.state.user_profile;
        this.setState({
            showModal: true,
            user_id: user_profile.user_id,
            first_name: user_profile.first_name,
            last_name: user_profile.last_name,
            email_id: user_profile.email_id,
            user_name: user_profile.user_name,
            user_bio: user_profile.user_bio || "",
            city: user_profile.city || "",
            state: user_profile.state || "",
            zip_code: user_profile.zip_code || "",
            user_image: user_profile.user_image || placeholder,
            show_image: user_profile.user_image || placeholder
        });
    };

    deactivateAccount = async (e) => {
        let data = {
            user_id: this.state.user_id
        }
        let result = await apiService.post(`${backendURI}/api/account/deactivate`, data);
        if (result.status === 200) {
            localStorage.clear();
            this.setState({
                logout: true
            });
        }
    }

    deleteAccount = async (e) => {
        let data = {
            user_id: this.state.user_id
        }
        let result = await apiService.post(`${backendURI}/api/account/delete`, data);
        if (result.status === 200) {
            localStorage.clear();
            this.setState({
                logout: true
            });
        }
    }

    handleClose = () => {
        this.setState({
            showModal: false
        });
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleImageChange = (e) => {
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    };

    onSubmit = async (e) => {
        e.preventDefault();
        let data = new FormData();
        data.append('user_id', this.state.user_id);
        data.append('first_name', this.state.first_name);
        data.append('last_name', this.state.last_name);
        data.append('user_name', this.state.user_name);
        data.append('email_id', this.state.email_id);
        data.append('user_bio', this.state.user_bio);
        data.append('city', this.state.city);
        data.append('state', this.state.state);
        data.append('zip_code', this.state.zip_code);
        data.append('user_image', this.state.user_image);
        let result = await apiService.post(`${backendURI}/api/profile`, data);
        if (result.status === 200) {
            this.getProfile();
            localStorage.setItem("first_name", this.state.first_name);
            localStorage.setItem("last_name", this.state.last_name);
            localStorage.setItem("user_name", this.state.user_name);
            await this.setState({
                showModal: false
            });
        }
    };

    render() {
        let user, first_name = "", last_name = "", user_id = "", user_name = "", email_id = "", user_bio = "", location = "", redirectVar;
        let locationVar, mailVar, userName, profileDetails, userButton, listButton, userImage = placeholder;
        if (this.state.logout) {
            redirectVar = (<Redirect to="/signin" />);
        }
        if (this.state && this.state.user_profile) {
            user = this.state.user_profile;
            first_name = user.first_name;
            last_name = user.last_name;
            user_name = user.user_name;
            email_id = user.email_id;
            mailVar = (<div><i class="fas fa-envelope pr-2"></i>{email_id}</div>);
            user_id = user.user_id;
            if (user.city && user.state) {
                location = user.city + ", " + user.state;
                locationVar = (<div><i class="fas fa-map-marker-alt pr-2"></i>{location}</div>);
            }
            if (user.user_bio)
                user_bio = user.user_bio;
            if (user.user_image)
                userImage = user.user_image;
            userName = (<div><i class="fas fas fa-at"></i>{user_name}</div>);
            profileDetails = <ProfileDetails data={this.state.user_profile} getProfile={this.getProfile} />;

            listButton = (
                <div className="col-sm-12 mt-2 list_button">
                    <Link to={{ pathname: `/lists/${user_id}` }} className="btn btn-outline-primary"><b>View Lists</b></Link>
                </div>
            );

            if (user_id === localStorage.getItem("user_id")) {
                userButton = (
                    <div className="text-left follow_button pr-2">
                        <button type="button" className="btn btn-outline-primary" onClick={this.editProfile}><b>Edit Profile</b></button>
                    </div>
                );
                listButton = null;
            } else if (user.followers.find(follower => follower._id === localStorage.getItem("user_id"))) {
                userButton = (
                    <div className="text-left follow_button pr-2">
                        <button type="button" className="btn btn-outline-primary" onClick={this.unfollowUser}><b>Unfollow</b></button>
                    </div>
                );
            } else {
                userButton = (
                    <div className="text-left follow_button pr-2">
                        <button type="button" className="btn btn-outline-primary" onClick={this.followUser}><b>Follow</b></button>
                    </div>
                );
            }
        }

        return (
            <div className="row profile-section">
                {redirectVar}
                <div className="col-sm-7">
                    <div className="row">
                        <h2 className="content-title col-sm-12 mb-0">Profile</h2>
                        <div className="col-sm-12 cover-image">
                        </div>
                        <div className="col-sm-12 pl-2 p-0 d-flex justify-content-between image-section">
                            <img id="userImage" src={userImage} className="user_profile_image" onClick={this.onProfileImageClick} alt="" />
                            {userButton}
                        </div>
                        <div id="imageModal" class="modal">
                            <span class="close">&times;</span>
                            <img class="modal-content" id="image_modal" alt="" />
                            <div id="caption"></div>
                        </div>
                        <div className="col-sm-12">
                            <h2>{first_name + " " + last_name}</h2>
                            {userName}
                            <h6>{user_bio}</h6>
                            {locationVar}
                            {mailVar}
                        </div>
                        {listButton}
                        {profileDetails}
                        <div className="col-sm-12">
                            <div className="nav-tabs row text-center">
                                <div className="navlinkItem col-sm-6 py-2 ">
                                    <NavLink className="p-2" to={{ pathname: `/profile/${user_id}/tweets` }}>Tweets</NavLink>
                                </div>
                                <div className="navlinkItem col-sm-6 py-2 ">
                                    <NavLink className="p-2" to={{ pathname: `/profile/${user_id}/likes` }}>Likes</NavLink>
                                </div>

                            </div>
                        </div>
                        <div className="col-sm-12">
                            <Switch>
                                <Route
                                    path="/profile/:user_id/tweets"
                                    component={ProfileTweets}
                                />
                                <Route
                                    path="/profile/:user_id/likes"
                                    component={ProfileLikes}
                                />
                                <Redirect
                                    from="/profile/:user_id"
                                    to="/profile/:user_id/tweets"
                                    exact
                                    component={ProfileTweets}
                                />
                            </Switch>
                        </div>
                    </div>
                </div>
                <RightPanel />
                <Modal show={this.state.showModal} onHide={this.handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title><b>Update Profile</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="col-sm-4 pl-2 p-0 d-flex justify-content-center">
                            <center>
                                <img src={this.state.show_image} className="user_profile_image" alt="" />
                            </center>
                        </div>
                        <form onSubmit={this.onSubmit}>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>First Name</b></span>
                                </div>
                                <input type="text" name="first_name" className="form-control" aria-label="FirstName" aria-describedby="basic-addon1" onChange={this.handleChange} defaultValue={this.state.first_name} pattern="^[A-Za-z0-9 ]{1,20}$" required />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Last Name</b></span>
                                </div>
                                <input type="text" name="last_name" className="form-control" aria-label="LastName" aria-describedby="basic-addon1" onChange={this.handleChange} defaultValue={this.state.last_name} pattern="^[A-Za-z0-9 ]{1,20}$" required />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Username</b></span>
                                </div>
                                <input type="text" name="user_name" className="form-control" aria-label="Username" aria-describedby="basic-addon1" onChange={this.handleChange} defaultValue={this.state.user_name} pattern="^[A-Za-z0-9_]{1,20}$" title="Please enter a unique user name. Use only letters, numbers and underscore." required />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>User Bio</b></span>
                                </div>
                                <input type="text" name="user_bio" className="form-control" aria-label="UserBio" aria-describedby="basic-addon1" onChange={this.handleChange} defaultValue={this.state.user_bio} pattern="^[A-Za-z0-9_!@#?(/\). ]{1,50}$" required />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Email</b></span>
                                </div>
                                <input type="email" name="email_id" className="form-control" aria-label="Email" aria-describedby="basic-addon1" onChange={this.handleChange} defaultValue={this.state.email_id} readOnly />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>City</b></span>
                                </div>
                                <input type="text" name="city" className="form-control" aria-label="City" aria-describedby="basic-addon1" onChange={this.handleChange} defaultValue={this.state.city} pattern="^[A-Za-z ]{1,20}$" required />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>State</b></span>
                                </div>
                                <input type="text" name="state" className="form-control" aria-label="State" aria-describedby="basic-addon1" onChange={this.handleChange} defaultValue={this.state.state} pattern="^[A-Za-z ]{2,20}$" required />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>ZIP Code</b></span>
                                </div>
                                <input type="text" name="zip_code" className="form-control" aria-label="ZipCode" aria-describedby="basic-addon1" onChange={this.handleChange} defaultValue={this.state.zip_code} pattern="^[0-9]{5}(-[0-9]{4})?$" required />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Profile Picture</b></span>
                                </div>
                                <input type="file" name="user_image" accept="image/*" className="form-control" aria-label="Image" aria-describedby="basic-addon1" onChange={this.handleImageChange} />
                            </div>
                            <center>
                                <Button variant="primary" type="submit">
                                    <b>Update</b>
                                </Button>&nbsp;&nbsp;
                                <Button variant="secondary" onClick={this.handleClose}>
                                    <b>Close</b>
                                </Button>
                            </center>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="warning" onClick={this.deactivateAccount}>
                            <b>Deactivate Account</b>
                        </Button>&nbsp;&nbsp;
                        <Button variant="danger" onClick={this.deleteAccount}>
                            <b>Delete Account</b>
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default Profile;