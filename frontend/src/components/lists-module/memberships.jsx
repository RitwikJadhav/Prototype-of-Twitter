import React, { Component } from 'react';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import ListCard from './listCard';

class Memberships extends Component {
    constructor(props) {
        super(props);
        this.state = {
            membered_lists: []
        }
    }
    async componentDidMount() {
        let target_list_user_id;
        if (!localStorage.getItem("list_user_id") && this.props.match.params.user_id) {
            let user_id = this.props.match.params.user_id;
            localStorage.setItem("list_user_id", user_id);
        }
        target_list_user_id = localStorage.getItem("list_user_id");
        let result = await apiService.get(`${backendURI}/api/list/${target_list_user_id}/membership`);
        let membered_lists = result.data;
        await this.setState({ membered_lists });
    }

    async componentWillReceiveProps(props) {
        let target_list_user_id;
        if (!localStorage.getItem("list_user_id") && props.match.params.user_id) {
            let user_id = props.match.params.user_id;
            localStorage.setItem("list_user_id", user_id);
        }
        target_list_user_id = localStorage.getItem("list_user_id");
        let result = await apiService.get(`${backendURI}/api/list/${target_list_user_id}/membership`);
        let membered_lists = result.data;
        await this.setState({ membered_lists });
    }

    render() {
        let lists = this.state.membered_lists;
        let listrender = null;

        if (lists.length > 0) {
            listrender = lists.map(list => {
                return (
                    <ListCard key={list._id} data={list} />
                );
            });
        } else {
            listrender = <div className="col-sm-12 text-center"><h5>Not a member of any list</h5></div>;
        }

        return (
            <div className="row">
                {listrender}
            </div>
        );
    }
}

export default Memberships;