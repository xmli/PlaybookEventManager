import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';

// material-ui
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// custom
import PlaybookCard from "../PlaybookCard/PlaybookCard";
// import SearchBar from "../SearchBar/SearchBar";


const styles = theme => ({
    root: {
        flexGrow: 1,
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    //Sort
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 6,
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
});

class PlaybookDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            apiUrl: "/api/items",
            playbookItems: [],
            //sort
            open: false,
            expanded: false,
        }
    }

    //fetch data from database
    componentDidMount() {  
        axios.get(`${this.state.apiUrl}`)
        .then(res => this.setState({ 
            playbookItems: res.data,
        }))
        .catch(err => console.log(err));
    }

    //Add new Playbook item
    componentWillReceiveProps(nextProps) {
        this.setState({
            playbookItems: [nextProps.newPlaybookItem, ...this.state.playbookItems]
        })
    }

    //Delete Playbook item
    deletePlaybookItem = (itemId) => {
        axios.delete(`${this.state.apiUrl}/${itemId}`)
        .then(res => {
            let playbookItems = this.state.playbookItems;
            for(let item of playbookItems) {
                if(item._id === itemId) {
                    var index = playbookItems.indexOf(item);
                    playbookItems.splice(index, 1);
                    this.setState({ playbookItems });
                    break;
                }                
            }
        })
        .catch(err => console.error(err));        
    }

    compareTitle = (itemA, itemB) => {
        return this.compare(itemA, itemB, "itemTitle");
    }

    compareDueDate = (itemA, itemB) => {
        return this.compare(itemA, itemB, "itemDueDate");
    }
    compare = (itemA, itemB, field) => {
        if (itemA[field] < itemB[field])
            return -1;
        if (itemA[field] > itemB[field])
            return 1;
        return 0;
    }      
    
    _onTextChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleChange = name => value => {
        this.setState({
          [name]: value,
        });
    };

    sortItemsByTitle = () => {
        this.setState({
            playbookItems: this.state.playbookItems.sort(this.compareTitle)
        });
    }
    sortItemsByDueDate = () => {
        this.setState({
            playbookItems: this.state.playbookItems.sort(this.compareDueDate)
        });
    }

    handleToggle = () => {
        this.setState(state => ({ 
            open: !state.open,
            expanded: !state.expanded,
        }));
      };
    
    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }
        this.setState({ 
            open: false,
            expanded: !this.state.expanded,
        });
    };
    

    render() {                
        const { classes } = this.props;
        const { open } = this.state;

        if(this.state.playbookItems.length !== 0) {

            return (
                <div className={classes.root}>
                    {/* <SearchBar suggestions={this.state.playbookItems} /> */}
                    {/* <Button onClick={this.sortItemsByTitle}>Sort by Title</Button> */}
                    {/* <Button onClick={this.sortItemsByDueDate}>Sort by Due Date</Button> */}

                    <Button
                        buttonRef={node => {
                            this.anchorEl = node;
                        }}
                        aria-owns={open ? 'menu-list-grow' : null}
                        aria-haspopup="true"
                        onClick={this.handleToggle}
                    >
                        Sort By 
                        <ExpandMoreIcon 
                            className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expanded,
                        })}/>

                    </Button>
                    <Popper style={{ zIndex: 1000 }}
                        open={open} anchorEl={this.anchorEl} transition disablePortal
                        placement={"bottom-start"}
                        >
                        {({ TransitionProps }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            // style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList>
                                        <MenuItem onClick={this.sortItemsByTitle}>Title</MenuItem>
                                        <MenuItem onClick={this.sortItemsByDueDate}>Due Date</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                        )}
                    </Popper>

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
                                    itemId={pb_item._id}
                                    itemTitle={pb_item.itemTitle}
                                    itemLinkUrl={pb_item.itemLinkUrl}
                                    itemDescription={pb_item.itemDescription}
                                    itemDueDate={new Date(pb_item.itemDueDate)}
                                    itemDateAdded={new Date(pb_item.itemDateAdded)}
                                    itemTags={pb_item.itemTags}
                                    itemTasks={pb_item.itemTasks}
                                    // delete function
                                    deletePlaybookItem={this.deletePlaybookItem}
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