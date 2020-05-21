import React, { Component } from 'react';
import { Link } from "react-router-dom";
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import TweetCard from '../common/tweetCard';
import ListMembers from './listMembers';
import ListSubscribers from './listSubscribers';
import RightPanel from "../right-panel/rightPanel";
import listPlaceholder from './list_banner.jpeg';
import './lists.css'
import EditList from './editList';
import AddMembers from './addMembers';
import alertService from '../../services/alertService';

class ListDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list_name: '',
            list_description: '',
            list_owner: {},
            list_members: [],
            list_subscribers: [],
            tweets: []
        }
    }
    async componentDidMount() {
        if (this.props.location.state) {
            console.log(this.props.location.state);
            let list_id = this.props.location.state.list._id;
            let list_owner_id = this.props.location.state.list.list_owner._id;
            localStorage.setItem("list_owner_id", list_owner_id);
            localStorage.setItem("list_id", list_id);
        }
        this.getListTweets();
    }

    getMembers = async () => {
        if (localStorage.getItem("list_id")) {
            const result = await apiService.get(`${backendURI}/api/list/users/${localStorage.getItem("list_id")}/members`);
            let members = result.data;
            console.log(members);
            await this.setState({ members });
        }
    }

    getListTweets = async () =>{
        let result = await apiService.get(`${backendURI}/api/list/tweets/${localStorage.getItem("list_id")}`);
        let list = result.data;
        await this.setState({
            list_name: list.list_name,
            list_description: list.list_description,
            list_owner: list.list_owner,
            list_members: list.list_members,
            list_subscribers: list.list_subscribers,
            tweets: list.tweets
        });

        if (list)
            document.title = `@${list.list_owner.user_name} / ${list.list_name} on Twitter`;
        else
            document.title = "List / Twitter";
    }
    
    handleAdd = async (user) => {
        let data = {
             list_id: localStorage.getItem("list_id"),
             user_id: user._id,
             type: "member"
         }
 
         const result = await apiService.post(`${backendURI}/api/list/add`, data);
         if (result.status === 200) {
            this.getListTweets();
            alertService.success(result.data)
         }
 
     }

     handleUnsubscribe = async () => {
        let data = {
            list_id: localStorage.getItem("list_id"),
            user_id: localStorage.getItem("user_id"),
            "type": "subscriber"
        }

        //follow un follow api
        const result = await apiService.post(`${backendURI}/api/list/remove`, data);
        if (result.status === 200) {
            await this.setState({ message: "Unsubscribe" });
            alertService.success(result.data);
        }

    }

    handleSubscribe = async () => {
        let data = {
            list_id: localStorage.getItem("list_id"),
            user_id: localStorage.getItem("user_id"),
            "type": "subscriber"
        }

        //follow un follow api
        const result = await apiService.post(`${backendURI}/api/list/add`, data);
        if (result.status === 200) {
            await this.setState({ message: "Unsubscribe" });
            alertService.success(result.data);
        }

    }
 
    handleRemove = async (member) => {
        let data = {
            list_id: localStorage.getItem("list_id"),
            user_id: member._id,
            type: "member"
        }

        const result = await apiService.post(`${backendURI}/api/list/remove`, data);
        if (result.status === 200) {
            this.getListTweets();
            alertService.success(result.data)
        }
    }

    render() {
        const { list_name, list_description, list_owner, list_members, list_subscribers, tweets } = this.state;

        console.log(list_subscribers);
        console.log(list_subscribers.includes(localStorage.getItem("user_id")));
        let tweetfeed = null;
        if (this.state && this.state.tweets && this.state.tweets.length) {
            tweetfeed = tweets.map(tweet => {
                return (<TweetCard data={tweet} />);
            });
        } else {
            tweetfeed = <div className="col-sm-12 text-center"><h5>There aren’t any Tweets in this List</h5></div>;
        }
        let removeButton = null;
        if (list_owner._id !== localStorage.getItem("user_id")) {
            if (list_subscribers.includes(localStorage.getItem("user_id"))) {
                removeButton = (
                    <div className="col-sm-4 mt-1">
                        <button type="button" className="btn btn-outline-primary" onClick={this.handleUnsubscribe}><b>Unubscribe</b></button>
                    </div>
                )
            } else {
                removeButton = (
                    <div className="col-sm-4 mt-1">
                        <button type="button" className="btn btn-outline-primary" onClick={this.handleSubscribe}><b>Subscribe</b></button>
                    </div>
                )
            }
        } else {
            removeButton = (
                <div className="row">
                    <div className="col-sm-6  text-right">
                        <EditList  getTweets = {this.getListTweets}/>
                    </div>
                    <div className="col-sm-6  text-left">
                        <AddMembers handleAdd={this.handleAdd} handleRemove={this.handleRemove} list_members={list_members} getTweets = {this.getListTweets}/>
                    </div>
                </div>
            )
        }
        if(list_owner && list_owner.user_name) {
            list_owner.user_name = "@" + list_owner.user_name;
        }
        return (
            <div className="row">
                <div className="col-sm-7">
                    <div className="row">
                        <div className="content-title col-sm-12">
                            <h4 className="col-sm-12">{list_name}</h4>
                            <p className="tagline col-sm-12">{list_owner.user_name}</p>
                        </div>
                        <img src={listPlaceholder} className="list-image" alt="" />
                        <div className="content-title col-sm-12 text-center">
                            <div className="col-sm-12">
                                <h5>{list_name}</h5>
                            </div>
                            <div className="col-sm-12 ">
                                {list_description}
                            </div>
                            <div className="list-owner col-sm-12">
                                <Link to={{ pathname: `/profile/${list_owner._id}`, state: { user_id: list_owner._id } }}><b>{list_owner.first_name} {list_owner.last_name} </b></Link>
                                <Link to={{ pathname: `/profile/${list_owner._id}`, state: { user_id: list_owner._id } }}>{list_owner.user_name}</Link>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 py-2 text-right">
                                <b>{list_members.length}</b><ListMembers list_members={list_members} handleRemove={this.handleRemove} getMembers = {this.getMembers} getTweets = {this.getListTweets}/>
                                </div>
                                <div className="col-sm-6 py-2 text-left">
                                <b>{list_subscribers.length}</b><ListSubscribers getTweets = {this.getListTweets}/>
                                </div>
                            </div>
                            {removeButton}
                        </div>
                        {tweetfeed}
                    </div >
                </div >
                <RightPanel />
            </div >
        );
    }
}

export default ListDetails;