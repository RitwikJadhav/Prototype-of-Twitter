import React, { Component } from 'react';
import Sidebar from "../sidebar/sidebar";
import { Route, Switch, Redirect } from "react-router-dom";
import Bookmarks from "../bookmarks-module/bookmarks";
import Explore from "../explore-module/explore";
import Userfeed from "../userfeed-module/userfeed";
import Messages from "../messages-module/messages";
import Profile from "../profile-module/profile";
import Analytics from '../analytics-module/analytics';
import Lists from "../lists-module/lists";
import ListDetails from '../lists-module/listDetails';
import TweetPage from '../common/tweetPage';
import "./home.css";

class Home extends Component {
    state = {};
    render() {
        let redirectVar;
        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/signin" />;
        }
        return (
            <div className="container-fluid pl-5 home-page">
                {redirectVar}
                <div className="row">
                    <div className="col-sm-2">
                        <Sidebar />
                    </div>
                    <div className="col-sm-10 content-section border-left">
                        <Switch>
                            <Route
                                path="/home"
                                component={Userfeed}
                            />
                            <Route
                                path="/explore"
                                component={Explore}
                            />
                            <Route
                                path="/messages"
                                component={Messages}
                            />
                            <Route
                                path="/tweet"
                                component={TweetPage}
                            />
                            <Route
                                path="/bookmarks"
                                component={Bookmarks}
                            />
                            <Route
                                path="/listdetails"
                                component={ListDetails}
                            />
                            <Route
                                path="/lists"
                                component={Lists}
                            />
                            <Route
                                path="/profile/:user_id"
                                component={Profile}
                            />
                            <Route
                                path="/analytics"
                                component={Analytics}
                            />
                            <Redirect
                                from="/"
                                to="/signin"
                                exact
                                component={Userfeed}
                            />
                        </Switch>

                    </div>
                </div>
            </div>
        )
    }
}

export default Home;
