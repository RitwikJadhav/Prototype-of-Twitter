import React, { Component } from 'react';
import ConversationsCard from './conversationCard';
import MessagePane from './messagePane'
import apiService from '../../services/httpService';
import { Modal } from 'react-bootstrap';
import UserCard from './userCard';
import "./messages.css";

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setModal: false,
            convos: [],
            flag: 0,
            following: [],
            msg: {}
        };
    }

    onClickHandler = async (data) => {
        await this.setState({ msg: data, flag: 1 });
    }

    componentWillMount = async () => {
        document.title = "Messages / Twitter";
        this.getConvos();
    }

    getConvos = async () => {
        let result, response;
        let existingConvoUserIds = [];
        result = await apiService.get(`http://localhost:3001/api/message/${localStorage.getItem("user_id")}`);
        response = await apiService.get(`http://localhost:3001/api/follow/following/${localStorage.getItem("user_id")}`)
        await result.data.map(item => {
            if (item.user1) {
                existingConvoUserIds.push(item.user1._id);
            } else if (item.user2) {
                existingConvoUserIds.push(item.user2._id);
            }
            return 0;
        });

        this.setState({
            following: response.data.following ? response.data.following : "",
            convos: result.data ? result.data : "",
            existingConvoUserIds
        });
    }

    handleToggle = async () => {
        this.setState({
            setModal: true,
        });
    }

    handleClose = async () => {
        this.setState({
            setModal: false,
        });
        await this.getConvos();
    }

    render() {
        let following = [];
        if (this.state && this.state.following && this.state.following.length) {
            this.state.following.map(user => {
                if (!this.state.existingConvoUserIds.includes(user._id)) {
                    following.push(<div><UserCard data={user} toggleModal={this.handleClose} /><hr /></div>)
                }
                return 0;
            })
        }

        let conversations = [];
        if (this.state && this.state.convos && this.state.convos.length) {
            this.state.convos.map(cnv => {
                conversations.push(<ConversationsCard handleClick={this.onClickHandler} data={cnv} />);
                return 0;
            });
        } else {
            conversations.push(<div className="row">
                <h2 className="error-msg col-sm-12">Send a message, get a message</h2>
                <h2 className="error-msg-2 col-sm-12">Direct Messages are private conversations
                between you and other people on Twitter. Share Tweets, media, and more!</h2>
            </div>)
        }
        let messagePane;
        if (this.state.flag) {
            messagePane = (<MessagePane
                cnv_id={this.state.msg._id} user_id={`${localStorage.getItem("user_id")}`} />);
        } else {
            messagePane = (<div>
                <div className="error-msg">You don’t have a message selected</div>
                <div className="error-msg2">Choose one from your existing messages, or start a new one.</div>
            </div>)
        }

        return (
            <div className="row messages-section">
                <div className="col-sm-4 border-right">
                    <div className="row border-bottom justify-content-between px-2">
                        <h2 className="content-title border-0">Messages</h2>
                        <i className="fas fa-comment-medical custom-icon mr-1" onClick={this.handleToggle}></i>
                    </div>
                    <div className="row">{conversations}</div>
                </div>
                <div className="col-sm-7 border-right">
                    {messagePane}
                </div>
                <div className="col-sm-1">
                </div>
                <Modal show={this.state.setModal} onHide={this.handleClose} scrollable={true}>
                    <Modal.Header closeButton>
                        <Modal.Title className="ml-3"><h5><b>New message</b></h5></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {following.length ? following : "You either have conversations with all the users you follow or not following anyone yet"}
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default Message;