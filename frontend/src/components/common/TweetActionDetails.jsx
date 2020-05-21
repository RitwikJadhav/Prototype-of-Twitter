import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './TweetActionDetails.css';
import { Modal } from 'react-bootstrap';
import UserCard from './UserCard';

class TweetActionDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setModalReTweets: false,
            setModalLikes: false,
            tweetLikes: [],
            retweeters: []
        }
    }
    componentDidMount() {
        let tweet = this.props.data;
        this.setState({
            likes: tweet.likes,
            retweeters: tweet.retweeters
        });
    }
    componentWillReceiveProps(props) {
        let tweet = props.data;
        this.setState({
            likes: tweet.likes,
            retweeters: tweet.retweeters
        });
    }
    handleToggleRetweets = () => {
        if (this.state && this.state.retweeters && this.state.retweeters.length) {
            this.setState({
                setModalReTweets: true
            });
        }
    }

    handleToggleLikes = () => {
        if (this.state && this.state.likes && this.state.likes.length) {
            this.setState({
                setModalLikes: true
            });
        }
    }

    handleClose = () => {
        this.setState({
            setModalLikes: false,
            setModalReTweets: false
        });
    }

    render() {
        let likes = [];
        if (this.state && this.state.likes) {
            this.state.likes.map(like => {
                likes.push(<div><UserCard data={like} /><hr /></div>);
                return 0;
            });
        }

        let retweets = [];
        if (this.state && this.state.retweeters) {
            this.state.retweeters.map(retweet => {
                retweets.push(<div><UserCard data={retweet} /><hr /></div>);
                return 0;
            });
        }

        return (
            <div className="col-sm-12 my-3 tweet-action-details">
                <div className="row">
                    <div className="col-sm-3">
                        <Link className="retweet-link" onClick={this.handleToggleRetweets}><b>{retweets.length}</b> Retweets</Link>
                    </div>
                    <div className="col-sm-3 likes">
                        <Link className="likes-link" onClick={this.handleToggleLikes}><b>{likes.length}</b> Likes</Link>
                    </div>
                </div>
                <Modal show={this.state.setModalReTweets} onHide={this.handleClose} scrollable={true}>
                    <Modal.Header closeButton>
                        <Modal.Title className="ml-3"><h5><b>Retweeted by</b></h5></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {retweets}
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.setModalLikes} onHide={this.handleClose} scrollable={true}>
                    <Modal.Header closeButton>
                        <Modal.Title className="ml-3"><h5><b>Liked by</b></h5></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {likes}
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default TweetActionDetails;