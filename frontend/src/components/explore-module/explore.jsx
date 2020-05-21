import React, { Component } from 'react';
import { Route, Switch, Redirect, NavLink } from "react-router-dom";
import ExploreUsers from './ExploreUsers';
import ExploreTweets from './ExploreTweets';
import RightPanel from "../right-panel/rightPanel";

class Explore extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.setDefaultText = this.setDefaultText.bind(this);
    }

    componentDidMount() {
        document.title = "Explore / Twitter";
        this.setDefaultText();
    }

    componentWillUnmount() {
        localStorage.removeItem("search_input");
    }

    setDefaultText = () => {
        let defaultSearchText = localStorage.getItem("search_input");
        if (defaultSearchText && defaultSearchText !== "") {
            this.setState({
                defaultSearchText: defaultSearchText
            });
        }
    };

    onChange = async (e) => {
        let searchInput = e.target.value.replace(/#/g, '');
        this.setState({ searchInput });
    };

    onSubmit = async (e) => {
        e.preventDefault();
        let searchInput = this.state.searchInput || "";
        localStorage.setItem("search_input", searchInput);
        this.setState({
            formSubmitted: true
        });
    };

    render() {
        let formSubmitted, defaultSearchText;
        if (this.state && this.state.formSubmitted) {
            formSubmitted = this.state.formSubmitted;
        }
        if (this.state && this.state.defaultSearchText) {
            defaultSearchText = this.state.defaultSearchText;
        }
        return (
            <div className="row explore-section">
                <div className="col-sm-7">
                    <div className="row">
                        <h2 className="content-title col-sm-12">Explore</h2>
                        <div className="form-group col-sm-12 mt-1">
                            <form onSubmit={this.onSubmit}>
                                <input type="text" className="form-control" placeholder="Search Twitter" defaultValue={defaultSearchText} onChange={this.onChange} />
                            </form>
                        </div>
                        <div className="col-sm-12">
                            <div className="nav-tabs row text-center">
                                <div className="navlinkItem col-sm-6 py-2 ">
                                    <NavLink className="p-2" to={{ pathname: `/explore/users`, state: { formSubmitted } }} exact={true}>People</NavLink>
                                </div>
                                <div className="navlinkItem col-sm-6 py-2 ">
                                    <NavLink className="p-2" to={{ pathname: `/explore/tweets`, state: { formSubmitted } }} exact={true}>Tweets</NavLink>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <Switch>
                                <Route
                                    path="/explore/users"
                                    component={ExploreUsers}
                                />
                                <Route
                                    path="/explore/tweets"
                                    component={ExploreTweets}
                                />
                                <Redirect
                                    from="/explore"
                                    to="/explore/users"
                                    exact
                                    component={ExploreUsers}
                                />
                            </Switch>
                        </div>
                    </div>
                </div>
                <RightPanel hideSearchBar={true} />
            </div>
        );
    }
}

export default Explore;