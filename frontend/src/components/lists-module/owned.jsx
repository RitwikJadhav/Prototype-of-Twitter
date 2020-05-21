import React, { Component } from "react";
import apiService from "../../services/httpService";
import { backendURI } from "../../utils/config";
import ListCard from "./listCard";
import CreateList from "./createList";

class Owned extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owned_lists: []
    };
  }

  async componentDidMount() {
    let target_list_user_id;
    if (this.props.match.params.user_id) {
      let user_id = this.props.match.params.user_id;
      localStorage.setItem("list_user_id", user_id);
    }
    target_list_user_id = localStorage.getItem("list_user_id");
    let result = await apiService.get(`${backendURI}/api/list/${target_list_user_id}/owned`);
    let owned_lists = result.data;
    console.log(owned_lists);
    await this.setState({ owned_lists: owned_lists, target_list_user_id: target_list_user_id });
  }

  async componentWillReceiveProps(props) {
    let target_list_user_id;
    if (props.match.params.user_id) {
      let user_id = props.match.params.user_id;
      localStorage.setItem("list_user_id", user_id);
    }
    target_list_user_id = localStorage.getItem("list_user_id");
    let result = await apiService.get(`${backendURI}/api/list/${target_list_user_id}/owned`);
    let owned_lists = result.data;
    console.log(owned_lists);
    await this.setState({ owned_lists: owned_lists, target_list_user_id: target_list_user_id });
  }

  render() {
    let lists = this.state.owned_lists;
    let target_list_user_id = this.state.target_list_user_id;
    let listrender = null;
    let addListButton;

    if (target_list_user_id === localStorage.getItem("user_id")) {
      addListButton = (<CreateList />)
    }

    if (lists.length > 0) {
      listrender = lists.map(list => {
        return <ListCard key={list._id} data={list} />;
      });
    } else {
      listrender = (
        <div className="col-sm-12 list-card text-center">
          <h5>There are no lists</h5>
        </div>
      );
    }

    return (<>
      <div className="col mt-1 text-center">{addListButton}</div>
      <div className="row">{listrender}</div>
    </>)
  }
}

export default Owned;
