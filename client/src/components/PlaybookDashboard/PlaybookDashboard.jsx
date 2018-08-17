import React, { Component } from 'react';

// Custom
import PlaybookCard from "../PlaybookCard/PlaybookCard";

//Styles
import "./PlaybookDashboard.css"

export default class PlaybookDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            calendarDataArray: [],
            didGetCalendarData: false
        }
    }

    componentDidMount() {  
        fetch("http://localhost:5000/api/items")
        .then(response => response.json())
        .then(responseJson => {
            this.setState({
                calendarDataArray: responseJson,
                didGetCalendarData: true
            });
        })
        .catch(error => console.error(error));
    }

    render() {
        if(this.state.didGetCalendarData) {
            return (
                <div className="row flex-container">
                    {this.state.calendarDataArray.map((calObj, index) =>
                        <div key={calObj._id} className="col-lg-3 col-md-4 col-sm-6 flex-item">
                            <PlaybookCard />
                        </div>
                    )}
                </div>
            );
        }
        return <div></div>
    }
}