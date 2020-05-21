import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './UserCard.css';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import placeholder from '../common/placeholder.jpg';

class UserCard extends Component {
    startConvo = async (e) => {
        let data = {
            sender_id: localStorage.getItem("user_id"),
            receiver_id: this.state.user._id,
            message_content: `Hi, ${localStorage.getItem("first_name")} wants to chat with you. You can reply or ignore this message.`
        };
        let result = await apiService.post(`${backendURI}/api/message`, data);
        if (result.status >= 200)
            await this.props.toggleModal();
    }

    componentDidMount() {
        if (this.props.data) {
            this.setState({
                user: this.props.data
            });
        }
    }

    render() {
        let first_name, last_name, user_name, user_id;
        let userImage = placeholder;
        if (this.state && this.state.user) {
            first_name = this.state.user.first_name;
            last_name = this.state.user.last_name;
            user_name = "@" + this.state.user.user_name;
            user_id = this.state.user._id;
            if (this.state.user.user_image) {
                userImage = this.state.user.user_image;
            }
        }

        return (
            <div className="row ml-3 user_card">
                <div className="col-sm-2 mt-1 user_image">
                    <Link to={{ pathname: `/profile/${user_id}` }}>
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
                <div className="col-sm-4 mt-2 follow_button">
                    <button type="button" className="btn btn-outline-primary" onClick={this.startConvo}><b>Chat</b></button>
                </div>
            </div>
        )
    }
}

export default UserCard;