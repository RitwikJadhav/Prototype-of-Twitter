import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './UserCard.css';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import placeholder from './placeholder.jpg';

class UserCard extends Component {
    constructor(props) {
        super(props);

        this.followUser = this.followUser.bind(this);
        this.unfollowUser = this.unfollowUser.bind(this);
    }

    followUser = async (e) => {
        let data = {
            user_id: localStorage.getItem("user_id"),
            target_user_id: this.state.user._id
        };
        let result = await apiService.post(`${backendURI}/api/follow`, data);
        if (result.status === 200) {
            let user = this.state.user;
            user.followers.push(localStorage.getItem("user_id"));
            await this.setState({ user });
        }
    };

    unfollowUser = async (e) => {
        let data = {
            user_id: localStorage.getItem("user_id"),
            target_user_id: this.state.user._id
        };
        let result = await apiService.post(`${backendURI}/api/follow/unfollow`, data);
        if (result.status === 200) {
            let user = this.state.user;
            let index = user.followers.indexOf(localStorage.getItem("user_id"));
            if (index > -1)
                user.followers.splice(index, 1);
            await this.setState({ user });
        }
    };

    componentDidMount() {
        if (this.props.data) {
            this.setState({
                user: this.props.data
            });
        }
    }

    componentWillReceiveProps(props) {
        if (props.data) {
            this.setState({
                user: props.data
            });
        }
    }

    render() {
        let first_name, last_name, user_name, user_id, followers = [], followButton;
        let userImage = placeholder;
        if (this.state && this.state.user) {
            first_name = this.state.user.first_name;
            last_name = this.state.user.last_name;
            user_name = "@" + this.state.user.user_name;
            user_id = this.state.user._id;
            followers = this.state.user.followers;
            if (this.state.user.user_image) {
                userImage = this.state.user.user_image;
            }
        }
        if (user_id === localStorage.getItem("user_id")) {
            followButton = null;
        } else if (followers.includes(localStorage.getItem("user_id"))) {
            followButton = (
                <div className="col-sm-4 mt-2 follow_button">
                    <button type="button" className="btn btn-outline-primary" onClick={this.unfollowUser}><b>Unfollow</b></button>
                </div>
            )
        } else {
            followButton = (
                <div className="col-sm-4 mt-2 follow_button">
                    <button type="button" className="btn btn-outline-primary" onClick={this.followUser}><b>Follow</b></button>
                </div>
            );
        }
        return (
            <div className="row ml-3 user_card">
                <div className="col-sm-2 mt-1 user_image">
                    <Link to={{ pathname: `/profile/${user_id}` }} onClick={this.props.toggleModal}>
                        <img src={userImage} className="user_image" alt="" />
                    </Link>
                </div>
                <div className="col-sm-6 user_name">
                    <Link to={{ pathname: `/profile/${user_id}` }} onClick={this.props.toggleModal}>
                        <h5><b>{first_name} {last_name}</b></h5>
                    </Link>
                    <Link to={{ pathname: `/profile/${user_id}` }} onClick={this.props.toggleModal}>
                        <h6>{user_name}</h6>
                    </Link>
                </div>
                {followButton}
            </div >
        )
    }
}

export default UserCard;