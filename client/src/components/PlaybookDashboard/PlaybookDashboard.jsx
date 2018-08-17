import React, { Component } from 'react';
// Custom
import PlaybookCard from "../PlaybookCard/PlaybookCard";
//Styles
import "./PlaybookDashboard.css"

class PlaybookDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playbookData: [],
            didGetPlaybookData: false
        }
    }

    componentDidMount() {  
        fetch("/api/items")
        .then(response => response.json())
        .then(responseJson => {
            this.setState({
                playbookData: responseJson,
                didGetPlaybookData: true
            });
        })
        .catch(error => console.error(error));
    }

    render() {
        if(this.state.didGetPlaybookData) {
            return (
                <div className="row flex-container">
                    {this.state.playbookData.map(calObj =>
                        <div key={calObj._id} className="flex-item">
                            <PlaybookCard key={calObj._id} className="flex-item"/>
                        </div>
                    )}
                </div>
            );
        }
        return <div></div>
    }
}

export default PlaybookDashboard;