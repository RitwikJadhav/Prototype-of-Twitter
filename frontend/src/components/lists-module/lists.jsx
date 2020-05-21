import React, { Component } from "react";
import { Route, Switch, Redirect, NavLink } from "react-router-dom";
import Owned from "./owned";
import Subscriptions from "./subscriptions";
import Memberships from "./memberships";
import RightPanel from "../right-panel/rightPanel";

class Lists extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    document.title = "Lists / Twitter";
    if (this.props.match.params.user_id) {
      let user_id = this.props.match.params.user_id;
      localStorage.setItem("list_user_id", user_id);
     await this.setState({
        list_user_id: user_id
      });
    }
  }

  async componentWillReceiveProps(props) {
    document.title = "Lists / Twitter";
    // let target_list_user_id;
    if (props.match.params.user_id) {
      let user_id = props.match.params.user_id;
      localStorage.setItem("list_user_id", user_id);
     await this.setState({
        list_user_id: user_id
      });
    }
  }
  render() {
    let target_list_user_id;
    if(this.state && this.state.list_user_id){
        target_list_user_id =  this.state.list_user_id;
    } else {
        target_list_user_id = localStorage.getItem("list_user_id");
    }
    return (
      <div className="row">
        <div className="col-sm-7">
          <div className="row">
            <div className="content-title col-sm-12">
              <h4 className="col-sm-12">Lists</h4>
              {/* <p className="tagline col-sm-12">@{localStorage.getItem("user_name")}</p> */}
            </div>

            <div className="col-sm-12">
              <div className="nav-tabs row text-center">
                <div className="navlinkItem col-sm-4 py-2 ">
                  <NavLink
                    className="p-2"
                    to={{ pathname: `/lists/${target_list_user_id}/owned` }}
                    exact={true}
                  >
                    Owned
                  </NavLink>
                </div>
                <div className="navlinkItem col-sm-4 py-2 ">
                  <NavLink
                    className="p-2"
                    to={{
                      pathname: `/lists/${target_list_user_id}/subscriptions`
                    }}
                    exact={true}
                  >
                    Subscribed
                  </NavLink>
                </div>
                <div className="navlinkItem col-sm-4 py-2 ">
                  <NavLink
                    className="p-2 "
                    to={{
                      pathname: `/lists/${target_list_user_id}/memberships`
                    }}
                    exact={true}
                  >
                    Member
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="col-sm-12">
              <Switch>
                <Route path="/lists/:user_id/owned" component={Owned} />
                <Route
                  path="/lists/:user_id/subscriptions"
                  component={Subscriptions}
                />
                <Route
                  path="/lists/:user_id/memberships"
                  component={Memberships}
                />
                <Redirect
                  from="/lists/:user_id"
                  to="/lists/:user_id/owned"
                  exact
                  component={Owned}
                />
              </Switch>
            </div>
          </div>
        </div>
        <RightPanel />
      </div>
    );
  }
}

export default Lists;
