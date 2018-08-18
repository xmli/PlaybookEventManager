import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

//Custom
import PlaybookResults from '../PlaybookResults/PlaybookResults';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    demo: {
      height: 240,
    },
    paper: {
      padding: theme.spacing.unit * 2,
      height: '100%',
      color: theme.palette.text.secondary,
    },
    control: {
      padding: theme.spacing.unit * 2,
    },
});

class PlaybookContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            itemTags: [],
            apiUrl: "/api/items",
            playbookItems: [],
            direction: 'row',
            justify: 'center',
            alignItems: 'stretch',
        }
        
    }
    

    componentDidMount() {
        // axios.get(`${this.state.apiUrl}/?q=${this.state.searchText}`)
        axios.get(`${this.state.apiUrl}`)
        .then(res => this.setState({ playbookItems: res.data }))
        .catch(err => console.log(err));
    }

    _onTextChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        console.log(this.state.playbookItems);

        const { classes } = this.props;
        const { alignItems, direction, justify } = this.state;

        return (
            // <div style={{padding: "10px"}}>
            //     <TextField 
            //         name="searchText"
            //         value={this.state.searchText}
            //         onChange={this._onTextChange}
            //         placeholder="Search for a particular playbook item"
            //         fullWidth
            //         margin="normal"
            //     />
            //     { this.state.playbookItems.length > 0 ? (<PlaybookResults playbookItems={this.state.playbookItems} />) : null }
            // </div>

        <Grid
            container
            spacing={16}
            className={classes.demo}
            alignItems={alignItems}
            direction={direction}
            justify={justify}
        >
        {[0, 1, 2].map(value => (
            <Grid key={value} item>
                <Paper
                    className={classes.paper}
                    style={{ paddingTop: (value + 1) * 10, paddingBottom: (value + 1) * 10 }}
                >
                {`Cell ${value + 1}`}
                </Paper>
            </Grid>
        ))}
        </Grid>
        )
    }
}

export default withStyles(styles)(PlaybookContainer);