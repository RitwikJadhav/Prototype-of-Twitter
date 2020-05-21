import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import MemberCard from './memberCard';

class AddMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parentComponent: "addMembers",
            search_results: [],
            message: ""
        }
    }
    async componentDidMount() {
        if(this.props.list_members){
            await this.setState({ members: this.props.list_members });  
        }
    }

    async componentWillReceiveProps(props) {
        if(props.list_members){
            await this.setState({ members: props.list_members });  
        }
    }

    searchUsers = async () => {
        let search_input = this.state.search_input;
        if (search_input) {
            if (search_input !== "") {
                const result = await apiService.get(`${backendURI}/api/search/user/${search_input}`);
                let search_results = result.data;
                await this.setState({ search_results });
            }
        }
    }


    handleShow = async e => {
        await this.setState({
            show: true
        });
    };

    handleClose = async () => {
        await this.setState({ search_results: "",search_input:"" });
        await this.setState({
            show: false
        });
        this.props.getTweets();
    };

    handleChange = e => {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    
   

    render() {
        let list_members = this.state.members;
        let search_results = this.state.search_results;
        let resultsRender = null;
        let parentComponent = this.state.parentComponent;

        if (search_results.length > 0) {
            resultsRender = search_results.map(member => {
                return (
                    <MemberCard
                        key={member._id}
                        list_owner_id={localStorage.getItem("list_owner_id")}
                        data={member}
                        list_members={list_members}
                        parentComponent={parentComponent}
                        removeMember={this.props.handleRemove}
                        addMember={this.props.handleAdd}
                    />
                );
            });
        }
        return (<>
            <button type="button" className="btn btn-outline-primary" onClick={this.handleShow}><b>Add Members</b></button>

            <Modal
                size="md"
                onHide={this.handleClose}
                show={this.state.show}
            >
                <div className="modal-body">
                    <div className="content-title row ">
                        <div className=" col-sm-2 text-left">
                            <i className="fas fa-times" onClick={this.handleClose}></i>
                        </div>
                        <div className=" col-sm-10 text-center " >
                            <h4>Add Members</h4>
                        </div>

                    </div>
                    <div className="input-group">
                        <input type="text" name="search_input" className="form-control" id="member_search" placeholder="Search Users" aria-describedby="emailHelp" onChange={this.handleChange} />
                        <div className="input-group-append">
                            <button className="btn btn-outline-primary" onClick={this.searchUsers}>Search</button>
                        </div>
                    </div>
                    {resultsRender}
                </div>
            </Modal>
        </>);
    }
}

export default AddMembers;