import React, { Component } from 'react';
import UserCard from '../common/UserCard';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import "./explore.css";

class ExploreUsers extends Component {
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
                let userResults = await apiService.get(`${backendURI}/api/search/user/${search_input.trim()}`);
                let users = userResults.data;
                this.setState({ users });
            }
            else {
                this.setState({ users: [] });
            }
        }
    };

    render() {
        let users = [];
        if (this.state && this.state.users) {
            if (this.state.users.length) {
                this.state.users.map(user => {
                    users.push(<UserCard data={user} />);
                    return 0;
                });
            } else {
                users.push(<div className="row">
                    <h2 className="error-msg col-sm-12">We could not find any results for you.</h2>
                </div>);
            }
        } else {
            users.push(<div className="row">
                <h2 className="error-msg col-sm-12">Start looking what's happening.</h2>
                <h2 className="error-msg-2 col-sm-12">Search for people to see what's happening.</h2>
            </div>)
        }
        return (
            <div className="row explore-section">
                {users}
            </div>
        );
    }
}

export default ExploreUsers;