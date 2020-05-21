import React, { Component } from 'react';
import { Link } from "react-router-dom";
import userPlaceholder from '../common/placeholder.jpg';
import './listCard.css'
class ListCard extends Component {

    render() {
        let list = this.props.data;
        console.log(list);
        let listOwnerImage = null;
        if (list.list_owner && list.list_owner.user_image) {
            listOwnerImage = list.list_owner.user_image;
        }else{
            listOwnerImage = userPlaceholder;
        }
        return (
            <div className="list-card row mx-auto ">
                <Link to={{ pathname: "/listdetails", state: { list: list } }}>
                    <div className="row mx-auto mt-2">
                        <div className="col-sm-1 pl-2 p-0 d-flex justify-content-center">
                            <Link to={{ pathname: `/profile/${list.list_owner._id}`, state: { user_id: list.list_owner._id } }}>
                                <img src={listOwnerImage} className="list_owner_image" alt="" />
                            </Link>
                        </div>
                        <div className="col-sm-11 row">
                            <div className="list-owner col-sm-12">
                                <Link to={{ pathname: `/profile/${list.list_owner._id}`, state: { user_id: list.list_owner._id } }}><b>{list.list_owner.first_name} {list.list_owner.last_name} </b></Link>
                                <Link to={{ pathname: `/profile/${list.list_owner._id}`, state: { user_id: list.list_owner._id } }}>@{list.list_owner.user_name}</Link>
                            </div>
                            <div className=" col-sm-12">
                                <b>{list.list_name}</b>
                            </div>
                            <div className=" col-sm-12">
                                {list.list_description}
                            </div>
                            <div className=" col-sm-6">
                                {list.members.length} members
                            </div>
                            <div className=" col-sm-6">
                                {list.subscribers.length} subscribers
                            </div>
                        </div>
                    </div>
                </Link>
            </div>);
    }
}

export default ListCard;