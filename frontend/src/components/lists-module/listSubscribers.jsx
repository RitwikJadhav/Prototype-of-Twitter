import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import SubscriberCard from './subscriberCard';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import alertService from '../../services/alertService';

class ListSubscribers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subscribers: [],
            message: ''
        }
        this.getSubscribers();
    }
    
    getSubscribers = async () => {
        if (localStorage.getItem("list_id")) {
            const result = await apiService.get(`${backendURI}/api/list/users/${localStorage.getItem("list_id")}/subscribers`);
            let subscribers = result.data;
            console.log(subscribers);
            await this.setState({ subscribers });
        }
    }

    handleShow = async e => {
        await this.setState({
            show: true
        });
        this.getSubscribers();
    };

    handleClose = async () => {
        await this.setState({
            show: false
        });
        this.props.getTweets();
    };

    handleFollow = async (subscriber) => {
        let data = {
            user_id: localStorage.getItem("user_id"),
            target_user_id: subscriber._id
        }

        const result = await apiService.post(`${backendURI}/api/follow`, data);
        if (result.status === 200) {
            await this.getSubscribers();
            await alertService.success(result.data);
          //  this.handleClose();
        }

    }

    handleUnFollow = async (subscriber) => {
        let data = {
            user_id: localStorage.getItem("user_id"),
            target_user_id: subscriber._id
        };

        let result = await apiService.post(`${backendURI}/api/follow/unfollow`, data);
        if (result.status === 200) {
            await this.getSubscribers();
            await alertService.success(result.data)
          //  this.handleClose();
        }
    }

    render() {
        let list_subscribers = this.state.subscribers;
        let subscriberRender = null;

        if (list_subscribers.length > 0) {
            subscriberRender = list_subscribers.map(member => {
                return (
                    <SubscriberCard
                        key={member._id}
                        list_owner_id={localStorage.getItem("list_owner_id")}
                        data={member}
                        followers={member.followers}
                        followSubscriber={this.handleFollow}
                        unfollowSubscriber={this.handleUnFollow}
                    />
                );
            });
        } else {
            subscriberRender = <div className="col-sm-12 text-center"><h5>There aren’t any subscribers of this List</h5></div>;
        }
        return (
            <>
                <Link className="p-2 " to={{ pathname: "/listdetails/subscribers", state: { list_id: localStorage.getItem("list_id") } }} onClick={this.handleShow}>Subscribers</Link>
                <Modal
                    size="md"
                    onHide={this.handleClose}
                    show={this.state.show}
                >
                    <div className="modal-body">
                        <div className="content-title row ">
                            <div className=" col-sm-2 text-left">
                                <Link className="p-2" to="/listdetails"><i className="fas fa-times" onClick={this.handleClose}></i></Link>
                            </div>
                            <div className=" col-sm-10" >
                                <h4>List Subscribers</h4>
                            </div>
                        </div>
                        <div className="row">
                            {subscriberRender}
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}

export default ListSubscribers;