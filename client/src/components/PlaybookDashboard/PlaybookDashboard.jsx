import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

// material-ui
import TextField from '@material-ui/core/TextField';
// custom
import PlaybookCard from "../PlaybookCard/PlaybookCard";
// styles
import "./PlaybookDashboard.css"

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    grid: {
        height: 400
    },
    card: {
        height: "100%"
    }
});

class PlaybookDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            itemTags: [],
            apiUrl: "/api/items",
            playbookItems: [],
            didGetPlaybookItems: false
        }
    }

    componentDidMount() {  
        axios.get(`${this.state.apiUrl}`)
        .then(res => this.setState({ 
            playbookItems: res.data,
            didGetPlaybookItems: true
        }))
        .catch(err => console.log(err));
    }

    _onTextChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        const { classes } = this.props;

        if(this.state.didGetPlaybookItems) {
            return (
                // <div>
                //     <div className="row flex-container">
                //         {this.state.playbookItems.map(item =>
                //             <div key={item._id} className="flex-item">
                //                 <PlaybookCard key={item._id} className="flex-item"
                //                     cardTitle={item.cardTitle}
                //                     cardImageUrl={item.cardImageUrl}
                //                     cardLinkUrl={item.cardLinkUrl}
                //                     cardDescription={item.cardDescription}
                //                     cardDueDate={new Date(item.cardDueDate)}
                //                     cardDateAdded={new Date(item.cardDateAdded)}
                //                     cardDateLastModified={new Date(item.cardDateLastModified)}
                //                 />
                //             </div>
                //         )}
                //     </div>
                // </div>

                <div className={classes.root}>
                    <div style={{ padding: "20px" }}>
                        <TextField 
                            name="searchText"
                            value={this.state.searchText}
                            onChange={this._onTextChange}
                            placeholder="Search for a particular playbook item"
                            fullWidth
                            margin="normal"
                        />
                    </div>
                    <Grid 
                        container 
                        spacing={24} 
                        className={classes.grid}
                        alignItems="stretch"
                        direction="row"
                        // justify="flex-start"
                    >
                    {/* <div className="row flex-container"> */}
                        {this.state.playbookItems.map(pitem =>
                            <Grid item xs={12} sm={6} md={4} lg={3} key={pitem._id}>
                                <PlaybookCard className={classes.card}
                                    cardTitle={pitem.cardTitle}
                                    cardImageUrl={pitem.cardImageUrl}
                                    cardLinkUrl={pitem.cardLinkUrl}
                                    cardDescription={pitem.cardDescription}
                                    cardDueDate={new Date(pitem.cardDueDate)}
                                    cardDateAdded={new Date(pitem.cardDateAdded)}
                                    cardDateLastModified={new Date(pitem.cardDateLastModified)}
                                />
                            </Grid>
                        )}
                    {/* </div> */}
                    </Grid>
                </div>
            );
        }
        return <div></div>
    }
}

export default withStyles(styles)(PlaybookDashboard);