import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

export default class PlaybookContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            itemTags: [],
            apiUrl: "/api/items",
            playbookItems: [],
        }
        
    }
    

    componentDidMount() {
        // axios.get(`${this.state.apiUrl}/?q=${this.state.searchText}`)
        // .then(res => this.setState({ playbookItems: res.data }))
        // .catch(err => console.log(err));

        fetch("/api/items")
        .then(response => response.json())
        .then(responseJson => {
            this.setState({
                playbookItems: responseJson,
                didGetPlaybookItems: true
            });
        })
        .catch(error => console.error(error));
    }

    _onTextChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        console.log(this.state.playbookItems);
        
        return (
            <div style={{padding: "10px"}}>
                <TextField 
                    name="searchText"
                    value={this.state.searchText}
                    onChange={this._onTextChange}
                    placeholder="Search for a particular playbook item"
                    fullWidth
                    margin="normal"
                />
            </div>
        )
    }
}
