import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import alertService from '../../services/alertService';

class EditList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.getListDetails();
    }

    getListDetails = async () =>{
        let result = await apiService.get(`${backendURI}/api/list/${localStorage.getItem("list_id")}`);
        let list = result.data;
        await this.setState({
            list_name: list.list_name,
            list_description: list.list_description,
            list_owner: list.list_owner,
            list_members: list.list_members,
            list_subscribers: list.list_subscribers
        });
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

    handleChange = e => {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleEdit = async (e) => {
        e.preventDefault();
        let data = {
            list_id:localStorage.getItem("list_id"),
            list_owner: this.state.list_owner,
            list_name: this.state.list_name,
            list_description: this.state.list_description
        }

        const result = await apiService.post(`${backendURI}/api/list/update`, data);
        if (result.status === 200) {
            alertService.success(result.data)
            this.getListDetails();
        }

    }

    render() {
        return (<>
            <button type="button" className="btn btn-outline-primary" onClick={this.handleShow}><b>Edit List</b></button>
            
            <Modal
                size="lg"
                onHide={this.handleClose}
                show={this.state.show}
            >
                <div class="modal-body">
                    <div className="content-title row ">
                        <div className=" col-sm-2 text-left">
                            <i className="fas fa-times" onClick={this.handleClose}></i></div>
                        <div className=" col-sm-7 text-center " >
                            <h4>Edit List</h4></div>
                        <div className=" col-sm-3 text-right">
                            <button className="btn btn-outline-primary" onClick={this.handleEdit}>Save</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="list_name">Name</label>
                        <input type="text" name="list_name" defaultValue={this.state.list_name} className="form-control" id="list_name" aria-describedby="emailHelp" onChange={this.handleChange} />

                    </div>
                    <div class="form-group">
                        <label htmlFor="list_description">Description</label>
                        <input type="text" name="list_description" defaultValue={this.state.list_description} className="form-control" id="list_description" onChange={this.handleChange} />
                    </div>
                </div>
            </Modal>
        </>);
    }
}

export default EditList;