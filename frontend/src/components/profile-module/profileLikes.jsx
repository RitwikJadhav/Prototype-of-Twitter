import React, { Component } from 'react';
import TweetCard from '../common/tweetCard';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import "./profile.css";

class ProfileLikes extends Component {
    componentDidMount() {
        this.getFeed();
    }

    getFeed = async (page) => {
        if (!page) {
            page = 1;
        }
        if (localStorage.getItem("profile_user_id")) {
            let result = await apiService.get(`${backendURI}/api/tweets/liked/${localStorage.getItem("profile_user_id")}/${page}`);
            let liked_tweets = result.data;
            await this.setState({ liked_tweets, page });
        }
    };

    prevPage = (e) => {
        let page = this.state.page;
        if (page === 1)
            return;
        else
            page -= 1;
        this.getFeed(page);
    }

    nextPage = (e) => {
        let page = this.state.page;
        page += 1;

        this.getFeed(page);
    }

    render() {
        let tweetfeed = [], pageBar, showPageBar;
        if (this.state && this.state.liked_tweets && this.state.liked_tweets.length) {
            showPageBar = true;
            this.state.liked_tweets.map(tweet => {
                tweetfeed.push(<TweetCard data={tweet} />);
                return 0;
            });
        } else {
            if (localStorage.getItem("user_id") === localStorage.getItem("profile_user_id")) {
                tweetfeed.push(<div className="row">
                    <h2 className="error-msg col-sm-12">You have not liked any tweets.</h2>
                    <h2 className="error-msg-2 col-sm-12">When you do, they will show up here.</h2>
                </div>)
            } else {
                tweetfeed.push(<div className="row">
                    <h2 className="error-msg col-sm-12">This user has not liked any tweets.</h2>
                    <h2 className="error-msg-2 col-sm-12">When they do, they will show up here.</h2>
                </div>)
            }
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
            <div className="row profile-section">
                {tweetfeed}
                {pageBar}
            </div>
        );
    }
}

export default ProfileLikes;