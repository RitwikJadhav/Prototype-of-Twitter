import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import twitter_icon from "../../twitter_icon.png";
import authService from '../../services/authService';
import "./sidebar.css";
import "@fortawesome/fontawesome-free/css/all.css";

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="row sidebar">
                <div className="col-sm-12">
                    <div className="col-sm-12 pt-3 twitter_icon_link">
                        <NavLink className="p-2 pr-3" to="/home" exact={true} >
                            <img src={twitter_icon} className="twitter_icon" alt="" />
                        </NavLink>
                    </div>
                    <div className="col-sm-12 py-3 sidebarItem">
                        <NavLink className="p-2 pr-3" to="/home" exact={true} >
                            <i className="fas fa-home pr-2"></i>
                            Home
                        </NavLink>
                    </div>
                    <div className="col-sm-12 py-3 sidebarItem">
                        <NavLink className="p-2 pr-3" to="/explore" >
                            <i className="fas fa-hashtag pr-2"></i>
                            Explore
                        </NavLink>
                    </div>
                    <div className="col-sm-12 py-3 sidebarItem">
                        <NavLink className="p-2 pr-3" to="/messages">
                            <i className="fas fa-envelope pr-2"></i>
                            Messages
                        </NavLink>
                    </div>
                    <div className="col-sm-12 py-3 sidebarItem">
                        <NavLink className="p-2 pr-3" to="/bookmarks" exact={true}>
                            <i className="far fa-bookmark pr-2"></i>
                            Bookmarks
                        </NavLink>
                    </div>
                    <div className="col-sm-12 py-3 sidebarItem">
                        <NavLink className="p-2 pr-3" to={{ pathname: `/lists/${localStorage.getItem("user_id")}`}}>
                            <i className="far fa-list-alt pr-2"></i>
                            Lists
                        </NavLink>
                    </div>
                    <div className="col-sm-12 py-3 sidebarItem">
                        <NavLink className="p-2 pr-3" to={{ pathname: `/profile/${localStorage.getItem("user_id")}`, state: { user_id: localStorage.getItem("user_id") } }}>
                            <i className="far fa-user pr-2"></i>
                            Profile
                        </NavLink>
                    </div>
                    <div className="col-sm-12 py-3 sidebarItem">
                        <NavLink className="p-2 pr-3" to="/analytics" exact={true}>
                            <i className="far fa-chart-bar pr-2"></i>
                            Analytics
                        </NavLink>
                    </div>
                    <div className="col-sm-12 py-3 sidebarItem">
                        <NavLink className="p-2 pr-3" to="/signin" onClick={authService.logout} exact={true}>
                            <i className="fas fa-sign-out-alt pr-2"></i>
                            Logout
                        </NavLink>
                    </div>
                </div>
            </div >
        );
    }
}

export default Sidebar;