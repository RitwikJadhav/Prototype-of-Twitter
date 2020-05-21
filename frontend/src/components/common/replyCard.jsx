import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './replyCard.css';
import userPlaceholder from './placeholder.jpg';

class ReplyCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reply: {}
        };
    }

    componentDidMount = () => {
        if (this.props.data) {
            this.setState({ reply: this.props.data });
        }
    }
    componentWillReceiveProps(props) {
        if (props.data) {
            this.setState({ reply: props.data });
        }
    }

    render() {
        let reply = this.state.reply;
        let replierImage = userPlaceholder, reply_content;

        if (reply.user && reply.user.user_image) {
            replierImage = reply.user.user_image;
        }
        if (reply.user) {
            reply_content = (
                <div className="row mx-auto mt-2">
                    <div className="col-sm-1 pl-2 p-0 d-flex justify-content-center">
                        <Link to={{ pathname: `/profile/${reply.user._id}` }}>
                            <img src={replierImage} className="replier_image" alt="" />
                        </Link>
                    </div>
                    <div className="col-sm-11 row">
                        <div className="replier col-sm-11">
                            <Link to={{ pathname: `/profile/${reply.user._id}` }} className="replier-name"><b>{reply.user.first_name} {reply.user.last_name} </b></Link>
                            <Link to={{ pathname: `/profile/${reply.user._id}` }} className="replier-handle">@{reply.user.user_name}</Link> . {new Date(reply.reply_date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                        </div>
                        <div className="reply-text col-sm-12">
                            {reply.reply_text}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="row mx-auto reply-card py-3">
                {reply_content}
            </div>
        );
    }
}

export default ReplyCard;