import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

//icons
import AddIcon from '@material-ui/icons/Add';
import SortIcon from '@material-ui/icons/Sort';

// custom imports
import PlaybookCard from "../PlaybookCard/PlaybookCard";
import NewItemCard from '../NewItemCard/NewItemCard';
// import SearchBar from "../SearchBar/SearchBar";


const styles = theme => ({
    root: {
        flexGrow: 1,
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 6,
        paddingBottom: theme.spacing.unit * 2,
    },
    //Add Icon
    fabLow: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    fabHigh: {
        position: 'fixed',
        bottom: 56 + 2 * theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
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

    /***********************
     * FETCHES DATA FROM API
     ***********************/
    componentDidMount() {  
        axios.get(`${this.state.apiUrl}`)
        .then(res => this.setState({ 
            playbookItems: res.data,
        }))
        .catch(err => console.log(err));
    }

    /*************************************************************
     * GETS UPDATE FROM PARENT TO RE-RENDER LIST OF PLAYBOOK ITEMS
     *************************************************************/
    componentWillReceiveProps(nextProps) {
        this.setState({
            playbookItems: [nextProps.newPlaybookItem, ...this.state.playbookItems]
        })
    }

    /****************************************
     * DELETES PLAYBOOK ITEM BASED ON ITEM ID
     ****************************************/
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

    /**************************************
     * CUSTOM COMPARE FUNCTIONS FOR SORTING
     **************************************/
    /**
     * Wrapper function for sorting based on parameter name
     */
    compare = (itemA, itemB, parameter) => {
        if (itemA[parameter] < itemB[parameter])
            return -1;
        if (itemA[parameter] > itemB[parameter])
            return 1;
        return 0;
    }  

    compareTitle = (itemA, itemB) => { return this.compare(itemA, itemB, "itemTitle"); }

    compareDueDate = (itemA, itemB) => { return this.compare(itemA, itemB, "itemDueDate"); }    
 
    /**********************************************
     * SORT FUNCTIONS FOR DISPLAYING PLAYBOOK ITEMS
     **********************************************/
    sortItemsByTitle = () => {
        this.setState({
            playbookItems: this.state.playbookItems.sort(this.compareTitle),
            open: false,
            expanded: !this.state.expanded,
        });
    }
    sortItemsByDueDate = () => {
        this.setState({
            playbookItems: this.state.playbookItems.sort(this.compareDueDate),
            open: false,
            expanded: !this.state.expanded,
        });
    }

    /*********************
     * SORT MENU FUNCTIONS
     *********************/
    _handleToggleSortIcon = () => {
        this.setState(state => ({ 
            open: !state.open,
            expanded: !state.expanded,
        }));
      };
    
    _handleCloseMenu = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }
        this.setState({ 
            open: false,
            expanded: !this.state.expanded,
        });
    };
    
    /*****************
     * RENDER FUNCTION
     *****************/
    render() {                
        const { classes } = this.props;
        const { open } = this.state;

        // If elements have been successfully fetched from the API
        if(this.state.playbookItems.length !== 0) {
            return (
                <div className={classes.root}>
                    {/* <SearchBar suggestions={this.state.playbookItems} /> */}

                    <Grid 
                        container 
                        spacing={24} 
                        className={classes.grid}
                        alignItems="stretch"
                        direction="row"
                    >
                        {/**********************************************/}
                        {/* MAPPING: PLAYBOOK CARDS (CUSTOM COMPONENT) */}
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

                    {/********************/}
                    {/* SORT MENU BUTTON */}
                    <Button 
                        variant="fab" 
                        color="default" 
                        className={classes.fabHigh}
                        aria-label="Add" 
                        buttonRef={node => {
                            this.anchorEl = node;
                        }}
                        aria-owns={open ? 'menu-list-grow' : null}
                        aria-haspopup="true"
                        onClick={this._handleToggleSortIcon}
                    >
                        <SortIcon />
                    </Button>
                        
                    {/*********************/}
                    {/* SORT MENU OPTIONS */}
                    <Popper style={{ zIndex: 1000 }} // Z-index for showing menu on top of underlying elements
                        open={open} anchorEl={this.anchorEl} transition disablePortal
                        placement={"bottom-start"}
                        >
                        {({ TransitionProps }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={this._handleCloseMenu}>
                                    <MenuList>
                                        <MenuItem onClick={this.sortItemsByTitle}>Title</MenuItem>
                                        <MenuItem onClick={this.sortItemsByDueDate}>Due Date</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                        )}
                    </Popper>

                    {/**************************/}
                    {/* NEW ITEM CARD FUNCTION */}
                    <NewItemCard
                        variant="fab" 
                        color="primary" 
                        ariaLabel="Add" 
                        buttonClass={classes.fabLow} 
                        addNewPlaybookItem={this.addNewPlaybookItem}
                    >
                        <AddIcon />
                    </NewItemCard>
                </div>
            );
        }
        return <div></div>
    }
}

export default withStyles(styles)(PlaybookDashboard);