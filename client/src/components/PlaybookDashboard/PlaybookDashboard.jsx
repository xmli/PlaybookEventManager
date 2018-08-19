import React, { Component } from 'react';
import axios from 'axios';
import classNames from 'classnames';

// material-ui
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

// custom
import PlaybookCard from "../PlaybookCard/PlaybookCard";
import SearchBar from "../SearchBar/SearchBar";


const styles = theme => ({
    root: {
        flexGrow: 1,
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class PlaybookDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            apiUrl: "/api/items",
            playbookItems: [],
            didGetPlaybookItems: false,
        }
    }

    componentDidMount() {  
        axios.get(`${this.state.apiUrl}`)
        .then(res => this.setState({ 
            playbookItems: res.data,
            didGetPlaybookItems: true,
        }))
        .catch(err => console.log(err));
    }

    _onTextChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    generateItemTagObjectArray = (arr) => {
        let objArr = []
        arr.map(label => {
            switch (label) {
                case 'Career':
                    objArr.push({
                        label: {label}, color: 'primary'
                    })
                    break;
                case 'School':
                    objArr.push({
                        label: {label}, color: 'secondary'
                    })
                    break;
                case 'Family':
                    objArr.push({
                        label: {label}, color: 'default'
                    })
                    break;
                default:
                    break;
            }
        })
        return objArr;
    }

    handleChange = name => value => {
        this.setState({
          [name]: value,
        });
    };

    render() {
        
        const { classes, theme } = this.props;

        if(this.state.didGetPlaybookItems) {
            return (
                <div className={classes.root}>
                    <SearchBar suggestions={this.state.playbookItems} />

                    <Grid 
                        container 
                        spacing={24} 
                        className={classes.grid}
                        alignItems="stretch"
                        direction="row"
                    >
                        {this.state.playbookItems.map(pb_item =>
                            <Grid item xs={12} sm={6} md={4} lg={3} key={pb_item._id}>
                                <PlaybookCard
                                    itemTitle={pb_item.itemTitle}
                                    itemLinkUrl={pb_item.itemLinkUrl}
                                    itemDescription={pb_item.itemDescription}
                                    itemDueDate={new Date(pb_item.itemDueDate)}
                                    itemDateAdded={new Date(pb_item.itemDateAdded)}
                                    itemTags={pb_item.itemTags}
                                    itemTasks={pb_item.itemTasks}
                                />
                            </Grid>
                        )}
                    </Grid>
                </div>
            );
        }
        return <div></div>
    }
}

export default withStyles(styles)(PlaybookDashboard);