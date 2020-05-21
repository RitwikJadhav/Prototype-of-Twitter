import React, { Component } from 'react';
import './conversationCard.css';
import placeholder from '../common/placeholder.jpg';

class conversationCard extends Component {
    constructor(props) {
        super(props);
        this.state={}
    }

    render() {
        let user_image = placeholder;
        if (this.props.data.user2 && this.props.data.user2.user_image) {
            user_image = this.props.data.user2.user_image;
        } else if (this.props.data.user1 && this.props.data.user1.user_image) {
            user_image = this.props.data.user1.user_image;
        }
        return (
            <div onClick={() => this.props.handleClick(this.props.data)} className="col-sm-12 d-flex content-title conversations-card">
                <div className="col-sm-2 m-auto">
                    <img src={user_image} alt="" className="user-image" />
                </div>
                <div className="col-sm-10">
                    <h5><b>{this.props.data.user1 ? this.props.data.user1.first_name : this.props.data.user2.first_name}</b></h5>
                    <h6>@{this.props.data.user1 ? this.props.data.user1.user_name : this.props.data.user2.user_name}</h6>
                </div>
            </div>
        )
    }
}

export default conversationCard;