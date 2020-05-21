import React, { Component } from 'react';
import TweetCard from '../common/tweetCard';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import "./explore.css";

class ExploreTweets extends Component {
    constructor(props){
        super(props);

        this.getResults = this.getResults.bind(this);
    }
    async componentDidMount() {
        this.getResults();
    }

    async componentWillReceiveProps() {
        this.getResults();
    }

    getResults = async () => {
        let search_input = localStorage.getItem("search_input");
        if (search_input) {
            if (search_input.trim() !== "") {
                let tweetResults = await apiService.get(`${backendURI}/api/search/tweet/${search_input.trim()}`);
                let tweets = tweetResults.data;
                this.setState({ tweets });
            }
        }
    }

    render() {
        let tweetfeed = [];
        if (this.state && this.state.tweets) {
            if (this.state.tweets.length) {
                this.state.tweets.map(tweet => {
                    tweetfeed.push(<TweetCard data={tweet} onDelete={this.getResults}/>);
                    return 0;
                });
            } else {
                tweetfeed.push(<div className="row">
                    <h2 className="error-msg col-sm-12">We could not find any results for you.</h2>
                </div>);
            }
        } else {
            tweetfeed.push(<div className="row">
                <h2 className="error-msg col-sm-12">Start looking what's happening.</h2>
                <h2 className="error-msg-2 col-sm-12">Search for tweets to see what's happening.</h2>
            </div>)
        }
        return (
            <div className="row explore-section">
                {tweetfeed}
            </div>
        );
    }
}

export default ExploreTweets;