import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import apiService from '../../services/httpService';
import { backendURI } from '../../utils/config';
import alertService from '../../services/alertService';

class CreateList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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
    };

    handleChange = e => {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleCreate = async (e) => {
        e.preventDefault();
        let data = {
            list_owner: localStorage.getItem("user_id"),
            list_name: this.state.list_name,
            list_description: this.state.list_description
        }

        const result = await apiService.post(`${backendURI}/api/list/create`, data);
        if (result.status === 200) {
            await this.handleClose();
            alertService.success(result.data)
        }

    }

    render() {
        return (<>
        <div className=" btn btn-outline-primary " onClick={this.handleShow}> <i class="fas fa-plus"/><b> Create</b></div>
           
            <Modal
                size="lg"
                onHide={this.handleClose}
                show={this.state.show}
            >
                <div class="modal-body">
                    <div className="content-title row ">
                        <div className=" col-sm-2 text-left">
                            <i class="fas fa-times" onClick={this.handleClose}></i></div>
                        <div className=" col-sm-7 text-center " >
                            <h4>Create List</h4></div>
                        <div className=" col-sm-3 text-right">
                            <button className="btn btn-outline-primary" onClick={this.handleCreate}>Create</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label htmlFor="list_name">Name</label>
                        <input type="text" name="list_name" class="form-control" id="list_name" aria-describedby="emailHelp" onChange={this.handleChange} />

                    </div>
                    <div class="form-group">
                        <label htmlFor="list_description">Description</label>
                        <input type="text" name="list_description" class="form-control" id="list_description" onChange={this.handleChange} />
                    </div>

                </div>
            </Modal>
        </>);
    }
}

export default CreateList;