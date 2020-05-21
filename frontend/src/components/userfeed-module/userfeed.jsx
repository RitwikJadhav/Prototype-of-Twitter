import React, { Component } from 'react';
import PostTweet from "./postTweet";
import "./user-feed.css";
import TweetCard from '../common/tweetCard';
import RightPanel from "../right-panel/rightPanel";
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';

class Userfeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        };
    }
    async componentDidMount() {
        document.title = "Home / Twitter";
        this.getFeed();
    };

    async componentWillReceiveProps() {
        this.getFeed();
    };


    getFeed = async (page) => {
        if (!page) {
            page = 1;
        }
        let user_id = localStorage.getItem("user_id");
        if (user_id) {
            let result = await apiService.get(`${backendURI}/api/tweets/following/${user_id}/${page}`);
            let tweets = result.data;

            await this.setState({ tweets, page });
        }
    };

    nextPage = async (e) => {
        let page = this.state.page;
        page += 1;
        this.getFeed(page);
    }

    prevPage = async (e) => {
        let page = this.state.page;
        if (page === 1)
            return;
        page -= 1;
        this.getFeed(page);
    }

    render() {
        let tweetfeed = [], pageBar, showPageBar;
        if (this.state && this.state.tweets && this.state.tweets.length) {
            showPageBar = true;
            this.state.tweets.map(tweet => {
                tweetfeed.push(<TweetCard data={tweet} getFeed={this.getFeed} />);
                return 0;
            });
        }
        else {
            tweetfeed.push(<div className="row">
                <h2 className="error-msg col-sm-12">There are no Tweets to show you.</h2>
                <h2 className="error-msg col-sm-12">Follow people to see what's happening.</h2>
            </div>);
        }
        if (showPageBar) {
            pageBar = (
                <div className="col-sm-12 justify-content-center mt-1">
                    <nav aria-label="Page navigation example">
                        <ul class="pagination justify-content-center">
                            <li class="page-item ">
                                <div class="page-link" onClick={this.prevPage} aria-label="Previous"><span aria-hidden="true">&laquo;</span></div>
                            </li>
                            <li class="page-item">
                                <div class="page-link" onClick={this.nextPage} aria-label="Next"><span aria-hidden="true">&raquo;</span></div>
                            </li>
                        </ul>
                    </nav>
                </div>
            );
        }
        return (
            <div className="row user-feed">
                <div className="col-sm-7 user-feed-section">
                    <div className="row">
                        <h2 className="content-title col-sm-12">Home</h2>
                        <div className="col-sm-12"><PostTweet getFeed={this.getFeed} /></div>
                        {tweetfeed}
                        {pageBar}
                    </div>
                </div>
                <RightPanel />
            </div>
        );
    }
}

export default Userfeed;