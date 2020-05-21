import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import UserCard from '../common/UserCard';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import './rightPanel.css'

class RightPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearchBar: true,
            userSuggestions: []
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value.replace(/#/g, '')
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        if (this.state.search_input) {
            localStorage.setItem("search_input", this.state.search_input);
        }
        this.setState({
            form_submitted: true
        })
    };

    async componentWillReceiveProps() {
        if (localStorage.getItem("user_id")) {
            let result = await apiService.get(`${backendURI}/api/follow/users/${localStorage.getItem("user_id")}`);
            let userSuggestions = result.data;
            await this.setState({ userSuggestions });

            if (this.props.hideSearchBar) {
                this.setState({
                    showSearchBar: false
                });
            }
        }
    }
    async componentDidMount() {
        if (localStorage.getItem("user_id")) {
            let result = await apiService.get(`${backendURI}/api/follow/users/${localStorage.getItem("user_id")}`);
            let userSuggestions = result.data;
            await this.setState({ userSuggestions });

            if (this.props.hideSearchBar) {
                this.setState({
                    showSearchBar: false
                });
            }
        }
    }
    render() {
        let suggestions, searchBar, whoToFollow, redirectVar;
        if (this.state && this.state.userSuggestions) {
            suggestions = this.state.userSuggestions.map(user => {
                return (
                    <div key={user._id} >
                        <UserCard data={user} />
                        <hr />
                    </div>
                )
            });
            if (this.state.userSuggestions.length) {
                whoToFollow = (
                    <div className="followers_field mt-3">
                        <h4 className="heading ml-3 pt-2"><b>Who to follow</b></h4>
                        <hr />
                        {suggestions}
                    </div>
                );
            }
        }
        if (this.state && this.state.showSearchBar) {
            searchBar = (
                <form onSubmit={this.onSubmit}>
                    <div className="form-group col-sm-12 mt-3 search_bar">
                        <input type="text" className="form-control" name="search_input" placeholder="Search Twitter" onChange={this.onChange} />
                    </div>
                </form>
            );
        }
        if (this.state && this.state.form_submitted) {
            redirectVar = (<Redirect to="/explore" />);
        }
        return (
            <div className="col-sm-5 right-panel border-left">
                {redirectVar}
                {searchBar}
                {whoToFollow}
            </div>
        )
    }
}

export default RightPanel;