import React, { Component } from 'react';
import RightPanel from "../right-panel/rightPanel";
import "./bookmarks.css";
import TweetCard from '../common/tweetCard';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';

class Bookmarks extends Component {
    state = {};
    clearAllBookmarks = async (e) => {
        e.preventDefault();
        let data = {
            user_id: localStorage.getItem("user_id")
        };

        let result = await apiService.post(`${backendURI}/api/bookmark/clear`, data);
        if (result.status === 200) {
            await this.setState({ tweets: {} });
        }
    }

    async componentDidMount() {
        document.title = "Bookmarks / Twitter";

        this.getBookmarks();
    }

    getBookmarks = async () => {
        if (localStorage.getItem("user_id")) {
            let user_id = localStorage.getItem("user_id");
            let result = await apiService.get(`${backendURI}/api/bookmark/${user_id}`);
            if (result.status === 200) {
                await this.setState({ tweets: result.data });
            }
        }
    }

    render() {
        let tweetfeed = [], userName;
        if (this.state && this.state.tweets && this.state.tweets.length) {
            this.state.tweets.map(tweet => {
                tweet.bookmarksPage = true;
                tweetfeed.push(<TweetCard data={tweet} getBookmarks={this.getBookmarks}/>);
                return 0;
            });
        } else {
            tweetfeed.push(<div className="row">
                <h2 className="error-msg col-sm-12">You haven’t added any Tweets to your Bookmarks yet</h2>
                <h2 className="error-msg-2 col-sm-12">When you do, they’ll show up here.</h2>
            </div>)
        }
        if (localStorage.getItem("user_name")) {
            userName = "@" + localStorage.getItem("user_name");
        }
        return (
            <div className="row bookmarks-section">
                <div className="col-sm-7">
                    <div className="row">
                        <div className="content-title col-sm-11">
                            <div className="bookmarks-headers row">
                                <h2>Bookmarks</h2>
                            </div>
                            <div className="bookmarks-username row">
                                {userName}
                            </div>
                        </div>
                        <div className="content-title col-sm-1">
                            <div className="btn-group">
                                <button type="button" className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="col-sm-12" class="fas fa-ellipsis-h"></i>
                                </button>
                                <div class="dropdown-menu">
                                    <div className="dropdown-item" onClick={this.clearAllBookmarks}>Delete Bookmarks</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {tweetfeed}
                    </div>
                </div>
                <RightPanel />
            </div>
        );
    }
}

export default Bookmarks;