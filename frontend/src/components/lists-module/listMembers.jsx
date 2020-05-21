import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import MemberCard from './memberCard';

class ListMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parentComponent: "listMembers",
            members: [],
            message: ""
        }
    }

    async componentDidMount() {
        if (this.props.list_members) {
            await this.setState({ members: this.props.list_members });
        }
    }
    async componentWillReceiveProps(props) {
        if (props.list_members) {
            await this.setState({ members: props.list_members });
        }
    }

    handleShow = async e => {
        await this.setState({
            show: true
        });
    };

    handleClose = async () => {
        await this.setState({
            show: false
        });
        this.props.getTweets();
    };

    render() {
        let list_members = this.state.members;
        let memberRender = null;
        let parentComponent = this.state.parentComponent;

        if (list_members.length > 0) {
            memberRender = list_members.map(member => {
                return (
                    <MemberCard
                        key={member._id}
                        list_owner_id={localStorage.getItem("list_owner_id")}
                        data={member}
                        list_members={list_members}
                        parentComponent={parentComponent}
                        removeMember={this.props.handleRemove}
                    />
                );
            });
        } else {
            memberRender = <div className="col-sm-12 text-center"><h5>You isn't anyone in this list</h5></div>;
        }
        return (
            <>
                <Link className="p-2" to={{ pathname: "/listdetails/members", state: { list_id: localStorage.getItem("list_id") } }} onClick={this.handleShow}>Members</Link>
                <Modal
                    size="md"
                    onHide={this.handleClose}
                    show={this.state.show}
                >
                    <div className="modal-body">
                        <div className="content-title row ">
                            <div className=" col-sm-2 text-left">
                                <Link className="p-2" to="/listdetails"><i className="fas fa-times" onClick={this.handleClose}></i></Link>
                            </div>
                            <div className=" col-sm-10" >
                                <h4>List Members</h4>
                            </div>
                        </div>
                        <div className="row">
                            {memberRender}
                        </div>
                    </div>
                </Modal>
            </>);
    }
}

export default ListMembers;