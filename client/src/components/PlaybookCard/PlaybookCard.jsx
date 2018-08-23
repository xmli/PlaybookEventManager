import React from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Input from '@material-ui/core/Input';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

// icons
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DateIcon from '@material-ui/icons/EventAvailable';
import NotesIcon from '@material-ui/icons/Notes';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

// colors
import grey from '@material-ui/core/colors/grey';

// custom imports
import EditItemCard from '../EditItemCard/EditItemCard';

const styles = theme => ({
    anchorTag: {
        textDecoration: "none",
        color: 'rgba(0, 0, 0, 0.87)',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    card: {
        height: "100%",
        boxShadow: "1px 5px 10px rgba(0,0,0,0.15)",
        transition: "all 0.3s cubic-bezier(.25, .8, .25, 1)",
        '&:hover': {
            boxShadow: "1px 5px 25px rgba(0,0,0,0.25)"
        }
    },
    cardContent: {
        paddingTop: "0",
        paddingBottom: "18px"
    },
    chip: {
        marginRight: theme.spacing.unit / 2,
        '&:hover': {
            boxShadow: "2px 2px 8px rgba(0,0,0,0.1), 1px 1px 6px rgba(0,0,0,0.2)"
        }
    },
    formControl: {
        width: "100%"
    },
    button: {
        float: "left",
        margin: theme.spacing.unit / 2,
        marginLeft: 0,
    }
});

class PlaybookCard extends React.Component {
    state = { 
        itemTasks: this.props.itemTasks,
        apiUrl: "/api/items",

        //menu for DELETE or EDIT
        anchorEl_menu: null,
        
        //edit
        toEditItemCard: false,
    };

    /**********************************
     * FUNCTIONS FOR CONTROLLING MENU
     **********************************/
    /**
     * Opens the dialog
     */
    _handleOpenMenu = event => {
        this.setState({ anchorEl_menu: event.currentTarget });
    };

    /**
     * Closes the dialog
     */
    _handleCloseMenu = () => {
        this.setState({ 
            anchorEl_menu: null,
        });
    };


    /****************************************************
     * FUNCTIONS FOR DELETING and EDITING A PLAYBOOK CARD
     ****************************************************/
    /**
     * Calls parent function to pass data upwards
     */
    _onDeletePlaybookCard = () => {
        this.props.deletePlaybookItem(this.props.itemId);
        this.setState({ anchorEl_menu: null });
    }

    /**
     * Passes props to EditItemCard Component
     */
    _onEditPlaybookCard = () => {
        this.setState({ 
            toEditItemCard: true
        });
    }

    /******************************
     * CHECKS or UNCHECKS ITEM TASK
     ******************************/
    _handleCheckItemTask = name => event => {        
        for(const[index, itemTask] of this.state.itemTasks.entries()) {
            if(itemTask.itemTaskName === event.target.value) {
                const itemTasks = this.state.itemTasks;
                if(event.target.checked) {
                    itemTasks[index].itemTaskDateCompleted = new Date();
                } else {
                    itemTasks[index].itemTaskDateCompleted = null;
                }
                // Update state
                this.setState({
                    itemTasks,
                });
                // Send a POST request
                this.updatePlaybookItem();
                break;
            }
        }
    };

    /**************************************************
     * SENDS POST REQUEST WHEN I UPDATE A PLAYBOOK ITEM
     **************************************************/
    updatePlaybookItem = () => {    
        var putData = {
            "itemId": this.props.itemId,
            "itemTasks": this.state.itemTasks
        }
        
        fetch(`${this.state.apiUrl}/${this.props.itemId}`, {
            method: 'PUT', // or 'PUT'
            body: JSON.stringify(putData), // data can be `string` or {object}!
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error));
    }

    /*****************************************
     * FUNCTIONS FOR ASSIGNING COLORS TO CHIPS
     *****************************************/
    assignChipColor = (chipLabel) => {
        switch (chipLabel) {
        case 'Career':
            return 'primary';
        case 'School':
            return 'secondary';
        case 'Family':
            return 'default';
        default:
            return;
        }
    }

    /*****************
     * RENDER FUNCTION
     *****************/
    render() {        
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                <CardHeader
                    action={
                        <div>
                            {/***************/}
                            {/* MENU BUTTON */}
                            <IconButton 
                                aria-owns={this.state.anchorEl_menu ? 'simple-menu' : null}
                                aria-haspopup="true"
                                onClick={this._handleOpenMenu}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={this.state.anchorEl_menu}
                                open={Boolean(this.state.anchorEl_menu)}
                                onClose={this._handleCloseMenu}
                            >
                                <EditItemCard open={this.state.toEditItemCard}
                                    itemId={this.props.itemId}
                                    itemTitle={this.props.itemTitle}
                                    itemLinkUrl={this.props.itemLinkUrl}
                                    itemDescription={this.props.itemDescription}
                                    itemDueDate={this.props.itemDueDate}
                                    itemDateAdded={this.props.itemDateAdded}
                                    itemTags={this.props.itemTags}
                                    itemTasks={this.props.itemTasks}
                                >
                                    <MenuItem onClick={this._onEditPlaybookCard}>
                                        <EditIcon className={classes.leftIcon}/>
                                        Edit
                                    </MenuItem>
                                </EditItemCard>

                                {/* <MenuItem onClick={this._onEditPlaybookCard}>
                                    <EditIcon className={classes.leftIcon}/>
                                    Edit
                                </MenuItem> */}
                                <Divider/>
                                <MenuItem onClick={this._onDeletePlaybookCard}>
                                    <DeleteIcon className={classes.leftIcon}/>
                                    Delete
                                </MenuItem>
                            </Menu>
                        </div>
                    } 
                    title={ 
                        // PLAYBOOK ITEM TITLE
                        <Typography variant="title" gutterBottom>
                            {this.props.itemLinkUrl !== "" ?
                            (
                                <a href={this.props.itemLinkUrl} target="_blank" className={classes.anchorTag}>
                                    {this.props.itemTitle}
                                </a>
                            ) : (
                                this.props.itemTitle
                            )}
                        </Typography>
                    }
                    subheader={
                        // PLAYBOOK ITEM DUE DATE
                        <FormControl className={classes.formControl} disabled>
                            <Typography variant="button" noWrap>
                                <DateIcon className={classes.button}/>
                                <strong>Due: &nbsp;</strong>
                                <Input className={classes.input} 
                                    value={moment(this.props.itemDueDate).format("M/D/YYYY")} 
                                    inputProps={{ 
                                        style: {
                                        textAlign: "center"
                                        }
                                    }}
                                />
                            </Typography>
                        </FormControl>
                    }
                />

                {/**********************/}
                {/* MAPPING: ITEM TAGS */}
                <CardContent className={classes.cardContent}>
                    {this.props.itemTags.sort().map((tag, index) =>
                        <Chip key={index}
                            color={this.assignChipColor(tag)} //built-in colors
                            label={tag}
                            className={classes.chip}
                        />        
                    )}
                </CardContent>

                {/*************************/}
                {/* ITEM TASK DESCRIPTION */}
                <CardContent className={classes.cardContent}>
                    <Typography variant="body2" component="p" noWrap>
                        <NotesIcon className={classes.button}/>
                        Notes:
                    </Typography>
                    <Typography component="p">
                        <em>{this.props.itemDescription}</em>
                    </Typography>
                </CardContent>
                    
                {/*******************/}
                {/* ITEM TASKS LIST */}
                <CardContent className={classes.cardContent}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">
                            <strong>Tasks:</strong>
                        </FormLabel>

                        <FormGroup>
                            {this.props.itemTasks.map(itemTask => 
                                <FormControlLabel key={itemTask._id}
                                    // ITEM TASK CHECKBOX
                                    control={
                                        <Checkbox 
                                            checked={itemTask.itemTaskDateCompleted !== null} 
                                            onChange={this._handleCheckItemTask(`${itemTask.itemTaskName}`)} 
                                            value={itemTask.itemTaskName} 
                                        />
                                    }
                                    // ITEM TASK NAME
                                    label={
                                        (itemTask.itemTaskDateCompleted !== null) ? (
                                            // IF COMPLETED
                                            <span style={{color: grey[500]}}>
                                                {itemTask.itemTaskName}
                                                <Typography variant="caption">
                                                    Completed: {moment(itemTask.itemTaskDateCompleted).format("M/D/YYYY")}
                                                </Typography>
                                            </span>
                                        ) : (
                                            // IF NOT YET COMPLETED
                                            <span>
                                                {itemTask.itemTaskName}
                                                <Typography variant="caption">
                                                    Due: {moment(itemTask.itemTaskDueDate).format("M/D/YYYY")}
                                                </Typography>
                                            </span>
                                        )
                                    }
                                />
                            )}
                        </FormGroup>
                    </FormControl>
                </CardContent>

                {/* <EditItemCard 
                    itemTitle={this.props.itemTitle}
                    itemLinkUrl={this.props.itemLinkUrl}
                    itemDueDate={this.props.itemDueDate}
                    itemTags={this.props.itemTags}
                    itemDescription={this.props.itemDescription}
                    itemTasks={this.props.itemTasks}
                /> */}
            </Card>
        );
    }
}

PlaybookCard.propTypes = {
    classes: PropTypes.object.isRequired,

    itemTitle: PropTypes.string.isRequired,
    itemLinkUrl: PropTypes.string.isRequired,
    itemDescription: PropTypes.string.isRequired,
    itemDueDate: PropTypes.instanceOf(Date),
    itemDateAdded: PropTypes.instanceOf(Date),
    itemTags: PropTypes.array,
    itemTasks: PropTypes.array,
};

export default withStyles(styles)(PlaybookCard);
