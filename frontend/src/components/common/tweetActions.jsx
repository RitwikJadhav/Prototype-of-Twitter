import React, { Component } from 'react';
import './tweetActions.css';
import { Modal } from 'react-bootstrap';
import placeholder from '../common/placeholder.jpg';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import alertService from '../../services/alertService';

class TweetActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tweet: {},
            user_id: "",
            setCommentModal: false,
            reply_text: ""
        }
        this.handleCommentModal = this.handleCommentModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.postReply = this.postReply.bind(this);
    }

    componentDidMount = () => {
        let user_id = localStorage.getItem("user_id");
        this.setState({ tweet: this.props.data, user_id: user_id })
    }
    componentWillReceiveProps(props) {
        this.setState({ tweet: props.data });
    }

    handleCommentModal = (e) => {
        e.preventDefault();
        if (this.state.tweet.showDetails) {
            this.setState({
                setCommentModal: true
            });
        }
    }

    handleClose = () => {
        this.setState({
            setCommentModal: false
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    postReply = async (e) => {
        e.preventDefault();
        let { tweet, user_id } = this.state;
        let data = {
            user_id: user_id,
            tweet_id: tweet._id,
            reply_text: this.state.reply_text
        }
        console.log(data);

        let result = await apiService.post(`${backendURI}/api/tweets/replies`, data);
        if (result.status === 201) {
            alertService.success('Replied');
        }
        this.handleClose();
        this.props.getTweet();
    }
    render() {
        let userImage = placeholder, replyIcon;
        if (localStorage.getItem("user_image") && localStorage.getItem("user_image") !== "") {
            userImage = localStorage.getItem("user_image");
        }
        let { tweet, user_id } = this.state;
        let likesClass = "far fa-heart mr-2 cursor-pointer";
        let retweetClass = "fas fa-retweet mr-2 cursor-pointer";
        if (tweet.likes_count !== 0 && tweet.likes) {
            if (tweet.likes.includes(user_id) || tweet.likes.find(like => like._id === user_id))
                likesClass = "fas fa-heart custom-color mr-2 cursor-pointer";
        }

        if (tweet.retweets_count !== 0 && tweet.retweeters) {
            if ((tweet.retweeters && tweet.retweeters.includes(user_id)) || tweet.retweeters.find(retweet => retweet._id === user_id))
                retweetClass = "fas fa-retweet custom-color mr-2 cursor-pointer";
        }
        if (tweet.showDetails) {
            replyIcon = (
                <div className="col-sm-4 replies" onClick={this.handleCommentModal}>
                    <i className="far fa-comment cursor-pointer"></i>
                    <span className="reply-icon">{tweet.replies_count !== 0 ? tweet.replies_count : ""}</span>
                </div>
            );
        } else {
            replyIcon = (
                <div className="col-sm-4 replies">
                    <i className="far fa-comment"></i>
                    <span>{tweet.replies_count !== 0 ? tweet.replies_count : ""}</span>
                </div>
            );
        }
        return (
            <div className="col-sm-12 my-3 tweet-actions">
                <div className="row">
                    <div href="" className="col-sm-4 likes">
                        <i className={likesClass} onClick={this.props.handleLike}></i>
                        <span>{tweet.likes_count !== 0 ? tweet.likes_count : ""}</span>
                    </div>
                    {replyIcon}
                    <div className="col-sm-4">
                        <i className={retweetClass} onClick={this.props.handleRetweet}></i>
                        <span>{tweet.retweets_count !== 0 ? tweet.retweets_count : ""}</span>
                    </div>
                </div>
                <Modal show={this.state.setCommentModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className="ml-3"><h5><b>Reply to</b></h5></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row modal-reply">
                            <div className="col-sm-12">
                                <div className="row">
                                    <div className="col-sm-1 d-flex justify-content-center m-auto">
                                        <img src={userImage} className="modal-owner-image ml-5 mb-5" alt="" />
                                    </div>
                                    <form className="col-sm-11" onSubmit={this.postReply}>
                                        <div className="form-group col-sm-12 ml-3 mt-4">
                                            <input type="text" id="reply_text" name="reply_text" className="form-control" placeholder="Tweet your reply" onChange={this.handleChange} pattern="^[A-Za-z#.!?()-_ ]{0,255}$" />
                                        </div>
                                        <div className="col-sm-12 d-flex justify-content-end reply-button">
                                            <button type="submit" className="btn btn-primary mb-3">Reply</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default TweetActions;