import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './memberCard.css';
import placeholder from '../common/placeholder.jpg';

class MemberCard extends Component {
    async componentDidMount() {
        if (this.props.data && this.props.list_owner_id) {
            console.log(this.props);
            await this.setState({
                user: this.props.data,
                list_owner_id: this.props.list_owner_id,
                list_members: this.props.list_members,
                parentComponent: this.props.parentComponent
            });
        }
    }

    async componentWillReceiveProps(props) {
        if (props.list_members) {
            await this.setState({
                user: this.props.data,
                list_owner_id: this.props.list_owner_id,
                list_members: this.props.list_members,
                parentComponent: this.props.parentComponent
            });
        }
    }

    removeMember = (e) => {
        e.preventDefault();
        this.props.removeMember(this.state.user);
    }

    addMember = (e) => {
        e.preventDefault();
        this.props.addMember(this.state.user);
    }

    render() {
        let first_name, last_name, user_name, user_id, list_owner_id, list_members, parentComponent; let removeButton = null;
        let userImage = placeholder;
        if (this.state && this.state.user) {
            first_name = this.state.user.first_name;
            last_name = this.state.user.last_name;
            user_name = this.state.user.user_name;
            user_id = this.state.user._id;
            list_owner_id = this.state.list_owner_id;
            list_members = this.state.list_members;
            parentComponent = this.state.parentComponent;

            if (this.state.user.user_image) {
                userImage = this.state.user.user_image;
            }
        }
        console.log(list_owner_id);
        ;

        if (list_owner_id === localStorage.getItem("user_id")) {
            if (parentComponent === "listMembers") {
                removeButton = (
                    <div className="col-sm-4 mt-1 member_button">
                        <button type="button" className="btn btn-outline-primary" onClick={this.removeMember}><b>Remove</b></button>
                    </div>
                )
            } else if (parentComponent === "addMembers") {
                if (list_members.findIndex(member => member._id === user_id) !== -1) {
                    removeButton = (
                        <div className="col-sm-4 mt-1 member_button">
                            <button type="button" className="btn btn-outline-primary" onClick={this.removeMember}><b>Remove</b></button>
                        </div>
                    )
                } else {
                    removeButton = (
                        <div className="col-sm-4 mt-1 member_button">
                            <button type="button" className="btn btn-outline-primary" onClick={this.addMember}><b>Add</b></button>
                        </div>
                    )
                }
            }
        }
        return (
            <div className="row mx-auto member_card">
                <div className="row mx-auto mt-2">
                    <div className="col-sm-2 mt-1 member_image">
                        <Link to={{ pathname: `/profile/${user_id}` }}>
                            <img src={userImage} className="member_image" alt="" />
                        </Link>
                    </div>
                    <div className="col-sm-6 mt-1 member_name">
                        <Link to={{ pathname: `/profile/${user_id}` }}>
                            <b>{first_name} {last_name} </b>
                        </Link>
                        <Link to={{ pathname: `/profile/${user_id}` }}>
                            @{user_name}
                        </Link>
                    </div>
                    {removeButton}
                </div>
            </div >
        )
    }
}

export default MemberCard;