import React, { Component } from 'react';
import './messagePane.css';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';

class messagePane extends Component {
    timeout;
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        this.getMsg();
        this.timeout = setInterval(this.getMsg, 3000);
    }
    componentWillReceiveProps(props) {
        this.props = props;
        this.getMsg();
    }

    componentWillUnmount() {
        clearInterval(this.timeout);
    }

    getMsg = async () => {
        let { data: single_conv } = await apiService.get(`${backendURI}/api/message/single/${this.props.user_id}/${this.props.cnv_id}`)
        await this.setState({ single_conv });
    }

    sendMsg = async (e) => {
        if (this.state && this.state.msgText) {
            let data = {
                sender_id: this.props.user_id,
                receiver_id: (this.state && this.state.single_conv.user1) ? this.state.single_conv.user1._id : this.state.single_conv.user2._id,
                conversation_id: this.props.cnv_id,
                message_content: this.state.msgText
            }
            this.setState({
                msgText: ""
            })
            let response = await apiService.post(`${backendURI}/api/message`, data)
            if (response) {
                this.getMsg();
            }
        }
    }

    textHandler = e => {
        let msgText = this.state.msgText;
        msgText = e.target.value;
        this.setState({ msgText: msgText })
    }

    render() {
        if (!this.state || !this.state.single_conv) {
            return (<div className="messagepane-card">
                <div className="error">You don’t have a message selected</div>
                <div className="error2">Choose one from your existing messages, or start a new one.</div>
            </div>)
        }
        let user = (this.state && this.state.single_conv.user1) ? this.state.single_conv.user1 : this.state.single_conv.user2;
        let messages = this.state.single_conv.message.map(text => {
            return (<div className="col-sm-12 messages">
                <h6 className="col-sm-12">{text.sender.first_name} : {text.message_content}</h6>
            </div>)
        })
        return (
            <div className="row messagepane-card">
                <div className="col-sm-12 pl-0 border-bottom">
                    <h2 className="col-sm-12 content-title border-0">{user.first_name} {user.last_name}</h2>
                </div>
                <div className="col-sm-12 mt-3">
                    <div className="row">{messages}</div>
                </div>
                <div className="col-sm-12 input-box py-2 border-bottom">
                    <div className="row">
                        <div className="col-sm-11 input-form">
                            <input className="col-sm-12 actualbox"
                                type="text"
                                name="msgText"
                                value={this.state.msgText}
                                onChange={this.textHandler}
                                placeholder="Start a new message"
                                required={true}
                            />
                        </div>
                        <div className="col-sm-1 m-auto">
                            <i className="far fa-paper-plane custom-color" onClick={this.sendMsg}></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default messagePane;