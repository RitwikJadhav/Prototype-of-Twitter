import React, { Component } from 'react';
import './postTweet.css';
import placeholder from '../common/placeholder.jpg';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';

class PostTweet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            tweet_text: "",
            hashtags: []
        }
    }

    handleImage = (e) => {
        console.log(e.target.files);
        this.setState({
            file: URL.createObjectURL(e.target.files[0]),
            tweet_image: e.target.files[0]
        });
    }

    handleTweetText = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    postNewTweet = async (e) => {
        e.preventDefault();
        let data = new FormData();
        data.append('tweet_text', this.state.tweet_text);
        data.append('user_id', localStorage.getItem('user_id'));
        data.append('tweet_image', this.state.tweet_image);
        let result = await apiService.post(`${backendURI}/api/tweets`, data);
        if (result.status === 200 && this.props.getFeed) {
            this.props.getFeed();
            document.getElementById("tweet_text").value = "";
            this.setState({
                file: null
            });
        }
    }

    render() {
        let userImage = placeholder;
        if (localStorage.getItem("user_image") && localStorage.getItem("user_image") !== "") {
            userImage = localStorage.getItem("user_image");
        }
        return (
            <div className="row post-tweet">
                <div className="col-sm-12">
                    <div className="row">
                        <div className="col-sm-1 d-flex justify-content-center m-auto">
                            <img src={userImage} className="tweet-owner-image ml-3 mb-5" alt="" />
                        </div>
                        <form className="col-sm-11" onSubmit={this.postNewTweet}>
                            <div className="form-group col-sm-12 mt-1">
                                <input type="text" id="tweet_text" name="tweet_text" className="form-control" placeholder="What's Happening?" onChange={this.handleTweetText} pattern="^[A-Za-z#.!?()-_ ]{0,255}$" />
                            </div>
                            <div className="image-viewer col-sm-12 ml-4 mb-2">
                                <img src={this.state.file} className="preview-image" alt="" />
                            </div>
                            <div className="col-sm-12 row flex justify-content">
                                <label for="file-input">
                                    <i class="far fa-image fa-2x ml-4"></i>
                                </label>
                                <input type="file" id="file-input" accept="image/*" name="tweet_image" onChange={this.handleImage} multiple={true} />
                                <button type="submit" className="btn btn-primary mb-3">Tweet</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default PostTweet;