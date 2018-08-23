import React from 'react';
import * as moment from 'moment';

//material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

//icons
import IconButton from '@material-ui/core/IconButton';
import DateIcon from '@material-ui/icons/EventAvailable';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import LinkIcon from '@material-ui/icons/Link';
import NotesIcon from '@material-ui/icons/Notes';

//colors
import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
    //pickers
    container: {
        // display: 'flex',
        // flexWrap: 'wrap',
        width: "100%",
    },
    textField: {
        display: "block",
    },
    chip: {
        color: 'white',
        margin: theme.spacing.unit / 2,
        '&:hover': {
            boxShadow: "2px 2px 8px rgba(0,0,0,0.1), 1px 1px 6px rgba(0,0,0,0.2)"
        }
    },
    chipGroup: {
        marginTop: 16,
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        padding: theme.spacing.unit / 2,
    },
    //new item tasks
    iconButton: {
        height: 36, 
        width: 36, 
        marginTop: 12, 
    },
    iconFont: {
        fontSize: 15,
    },
    editButton: {
        paddingRight: 24,
        width: "100%",
    },
});

const itemTagList = [
    "Career",
    "School",
    "Family"
]

const unselectedTagColorMap = {
    "Career": grey[300],
    "School": grey[300],
    "Family": grey[300]
}

const selectedTagColorMap = {
    "Career": blue['A400'],
    "School": pink[400],
    "Family": grey[600]
}

class EditItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: this.props.open,
            itemTagColorMap: this.setOriginalTagColorMap(this.props.itemTags),
            apiUrl: "/api/items",
    
            //Controls for Item
            itemTitle: this.props.itemTitle,
            itemLinkUrl: this.props.itemLinkUrl,
            itemDueDate: moment(this.props.itemDueDate).format("YYYY-MM-DD"),
            itemTags: this.props.itemTags,
            itemDescription: this.props.itemDescription,
            itemTasks: this.props.itemTasks,
        };
    }

    setOriginalTagColorMap = (tagArray) => {
        let originalTagColor = JSON.parse(JSON.stringify(unselectedTagColorMap));
        for(let tag of tagArray) {
            if(tagArray.includes(tag)) {
                originalTagColor[tag] = selectedTagColorMap[tag];
            }
        }        
        return originalTagColor;
    }
    
    /*******************************************************
     * Helper function to reset New Item controls to default
     *******************************************************/
    resetNewItemDefaults = () => {
        this.setState({ 
            open: false,
            itemTagColorMap: unselectedTagColorMap,

            itemTitle: this.props.itemTitle,
            itemLinkUrl: this.props.itemLinkUrl,
            itemDueDate: moment(this.props.itemDueDate).format("YYYY-MM-DD"),
            itemTags: this.props.itemTags,
            itemDescription: this.props.itemDescription,
            itemTasks: this.props.itemTasks,
        });
    }

    /**********************************
     * FUNCTIONS FOR CONTROLLING DIALOG
     **********************************/
    /**
     * Opens Dialog to create new item
     */
    _handleOpen = () => {
        this.setState({ open: true });
    };

    /**
     * Closes create-new-item Dialog
     */
    _handleClose = () => {
        this.resetNewItemDefaults();
    };

    /*****************************************************************
     * Once clicked on 'Create' button, function fires to POST request
     *****************************************************************/
    _onEditItem = () => {
        let updatedPlaybookItem = {
            itemTitle: this.state.itemTitle,
            itemLinkUrl: this.state.itemLinkUrl,
            itemDueDate: this.state.itemDueDate,
            itemTags: this.state.itemTags,
            itemDescription: this.state.itemDescription,
            itemTasks: this.state.itemTasks,
        }

        console.log("updatedPlaybookItem: ", updatedPlaybookItem);
        
        
        fetch(`${this.state.apiUrl}/${this.props.itemId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedPlaybookItem),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(resJson => console.log(resJson))
        .catch(error => console.error('Error:', error));
        
        // Reset to defaults
        this.resetNewItemDefaults();
    }

    /*******************************************************
     * Function that highlights Chips based on selected TAGS
     *******************************************************/
    _onSelectItemTag = (chipLabel) => {
        
        //Make a deep copy so not to modify original constants (otherwise would modify mappings)
        let prevItemTagColors = JSON.parse(JSON.stringify(this.state.itemTagColorMap));
        let prevItemTagSelection = this.state.itemTags;
        
        // Unselecting a chip
        if(this.state.itemTags.includes(chipLabel)) {
            prevItemTagColors[chipLabel] = unselectedTagColorMap[chipLabel];

            let index = prevItemTagSelection.indexOf(chipLabel);
            if(index > -1) {
                prevItemTagSelection.splice(index, 1);
            }
            
        // Selecting a chip
        } else {
            prevItemTagColors[chipLabel] = selectedTagColorMap[chipLabel];
            
            if(!prevItemTagSelection.includes(chipLabel)) {
                prevItemTagSelection.push(chipLabel);
            }
        }
        // Update selected Tags and color mappings
        this.setState({
            itemTagColorMap: prevItemTagColors,
            itemTags: prevItemTagSelection,
        });
    }

    /*********************************************************************
     * General function that updates state based on name of state VARIABLE
     *********************************************************************/
    handleChange = name => event => { 
        this.setState({
            [name]: event.target.value,
        });
    };
    

    /**********************************************
     * Adds new Item Task to the list on the Dialog
     **********************************************/
    _onCreateNewItemTask = () => {
        let itemTasks = this.state.itemTasks;
        let newItemTask = {
            itemTaskName: "",
            itemTaskDueDate: moment(new Date()).format("YYYY-MM-DD"),
            itemTaskDateCompleted: null,
            itemTaskPriority: 1
        }
        itemTasks.push(newItemTask);

        this.setState({
            itemTasks
        });
    }
    
    /*******************************************************
     * Deletes an item task from the list based on the index
     *******************************************************/
    _onDeleteItemTask = index => {
        let itemTasks = this.state.itemTasks;
        itemTasks.splice(index, 1);

        this.setState({ itemTasks });        
    }

    /********************************************
     * TASK CONTROLS FUNCTIONS FOR UPDATING STATE
     ********************************************/
    /**
     * State controls on Item Task Name
     */
    _onChangeItemTaskName = index => event => {
        let itemTasks = this.state.itemTasks;
        itemTasks[index].itemTaskName = event.target.value;

        this.setState({ itemTasks });        
    }

    /**
     * State controls on Item Task Due Date
     */
    _onChangeItemTaskDueDate = index => event => {
        let itemTasks = this.state.itemTasks;
        itemTasks[index].itemTaskDueDate = event.target.value;

        this.setState({ itemTasks });
    }

    /**
     * State controls on Item Task Priority
     */
    _onChangeItemTaskPriority = index => event => {
        let itemTasks = this.state.itemTasks;
        itemTasks[index].itemTaskPriority = event.target.value;

        this.setState({ itemTasks });
    }

    /****************
    * RENDER FUNCTION
    *****************/
    render() {  
                
        const { classes } = this.props; 
           
        return (
            <div>
                <div onClick={this._handleOpen}>
                    {this.props.children}
                </div>
                {/********************************/}
                {/* DIALOG FOR CREATING NEW ITEM */}
                <Dialog
                    open={this.state.open}
                    onClose={this._handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    {/**************/}
                    {/* ITEM TITLE */}
                    <DialogTitle id="form-dialog-title">
                        <TextField
                            id="itemTitle"
                            className={classes.textField}
                            margin="normal"
                            label="New Playbook Item"
                            type="text"
                            autoFocus
                            value={this.state.itemTitle}
                            onChange={this.handleChange(`itemTitle`)}
                            fullWidth
                            required={true}
                        />
                    </DialogTitle>
                    
                    <DialogContent>
                        {/*****************/}
                        {/* ITEM DUE DATE */}
                        <TextField id="itemDueDate"
                            className={classes.textField}
                            label="Due Date"
                            type="date"
                            defaultValue={this.state.itemDueDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DateIcon />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={this.handleChange(`itemDueDate`)}
                            fullWidth
                            required={true}
                        />
                        
                        {/***************************/}
                        {/* MAPPING: ITEM TAG CHIPS */}
                        <div className={classes.chipGroup}>
                            {itemTagList.map((tag, index) => 
                                <Chip key={index}
                                    style={{backgroundColor: this.state.itemTagColorMap[tag]}}
                                    label={tag}
                                    className={classes.chip}
                                    onClick={this._onSelectItemTag.bind(this, tag)}
                                /> 
                            )}
                        </div>
                        
                        {/********************/}
                        {/* ITEM DESCRIPTION */}
                        <TextField
                            id="multiline-flexible"
                            label="Notes"
                            multiline
                            rowsMax="5"
                            value={this.state.itemDescription}
                            onChange={this.handleChange('itemDescription')}
                            className={classes.textField}
                            margin="normal"
                            fullWidth
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NotesIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/*****************/}
                        {/* ITEM LINK URL */}
                        <TextField 
                            className={classes.textField}
                            label="Link"
                            id="itemLinkUrl"
                            value={this.state.itemLinkUrl}
                            onChange={this.handleChange('itemLinkUrl')}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <LinkIcon />
                                </InputAdornment>
                                ),
                            }}
                        />
                        <br/>

                        {/***********************/}
                        {/* MAPPING: ITEM TASKS */}
                        {this.state.itemTasks.map((itemTask, index) => 
                            <Grid container spacing={16} key={index}>

                                {/******************/}
                                {/* ITEM TASK NAME */}
                                <Grid item xs={5}>
                                    <TextField 
                                        autoFocus
                                        className={classes.textField}
                                        label="Task Name"
                                        id="itemTaskName"
                                        value={itemTask.itemTaskName}
                                        onChange={this._onChangeItemTaskName(index)}
                                        inputProps={{
                                            style: {
                                                fontSize: 12,
                                                height: 15
                                            }
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                
                                {/**********************/}
                                {/* ITEM TASK DUE DATE */}
                                <Grid item xs={4}>
                                    <TextField 
                                        className={classes.textField}
                                        label="Due Date"
                                        id="itemTaskDueDate"
                                        type="date"
                                        value={moment(itemTask.itemTaskDueDate).format("YYYY-MM-DD")}
                                        onChange={this._onChangeItemTaskDueDate(index)}
                                        inputProps={{
                                            style: {
                                                fontSize: 12,
                                                height: 15
                                            }
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                
                                {/**********************/}
                                {/* ITEM TASK PRIORITY */}
                                <Grid item xs={2}>
                                    <TextField 
                                        label="Priority"
                                        id="itemTaskPriority"
                                        type="number"
                                        value={itemTask.itemTaskPriority}
                                        onChange={this._onChangeItemTaskPriority(index)}
                                        inputProps={{
                                            style: {
                                                fontSize: 12,
                                                height: 15,
                                                width: "100%"
                                            }
                                        }}
                                    />
                                </Grid>
                                
                                {/*******************************/}
                                {/* DELETE BUTTON FOR ITEM TASK */}
                                <Grid item xs={1}>
                                    <IconButton className={classes.iconButton} onClick={this._onDeleteItemTask.bind(this, index)} >
                                        <DeleteIcon color="secondary" className={classes.iconFont}/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        )}
                        <br/>
                        
                        {/*************************************/}
                        {/* BUTTON FOR ADDING A NEW ITEM TASK */}
                        <Button color="secondary" className={classes.editButton} aria-label="Add an item task" onClick={this._onCreateNewItemTask}>
                            <EditIcon className={classes.leftIcon}/> 
                            Add new item task
                        </Button>

                    </DialogContent>

                    {/****************************************************/}
                    {/* BUTTONS TO CANCEL OR CONFIRM CREATING A NEW ITEM */}
                    <DialogActions>
                        <Button onClick={this._handleClose} color="default" style={{position: "absolute", left: 5}}>Cancel</Button>
                        <Button onClick={this._onEditItem} variant="contained" color="primary">Confirm</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(EditItemCard);