import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import * as moment from 'moment';
import Chip from '@material-ui/core/Chip';
import axios from 'axios';
import InputAdornment from '@material-ui/core/InputAdornment';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DateIcon from '@material-ui/icons/EventAvailable';
import NotesIcon from '@material-ui/icons/Notes';
import LinkIcon from '@material-ui/icons/Link';
import Grid from '@material-ui/core/Grid';

import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
      color: 'white'
    },
    leftIcon: {
      marginRight: theme.spacing.unit,
    },
    rightIcon: {
      marginLeft: theme.spacing.unit,
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

const unselectedTagColorMap = {
    "Career": grey[300], //blue[100],
    "School": grey[300], //pink[100],
    "Family": grey[300]
}

const selectedTagColorMap = {
    "Career": blue['A400'],
    "School": pink[400],
    "Family": grey[600]
}

class NewItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            itemTagColorMap: unselectedTagColorMap,
            apiUrl: "/api/items",
    
            itemTitle: "",
            itemLinkUrl: "",
            itemDueDate: moment(new Date()).add(1,'day').format("YYYY-MM-DD"),
            itemTags: [],
            itemDescription: "",
            itemTasks: [],
        };
    }
    

    resetNewItemDefaults = () => {
        this.setState({ 
            open: false,
            itemTagColorMap: unselectedTagColorMap,

            itemTitle: "",
            itemitemLinkUrl: "",
            itemDueDate: moment(new Date()).add(1,'day').format("YYYY-MM-DD"),
            itemTags: [],
            itemDescription: "",
            itemTasks: [],
        });
    }

    _handleClickOpen = () => {
        this.setState({ open: true });
    };

    _handleClose = () => {
        this.resetNewItemDefaults();
    };

    _handleCreateNewItem = () => {
        let newPlaybookItem = {
            itemTitle: this.state.itemTitle,
            itemLinkUrl: this.state.itemLinkUrl,
            itemDueDate: this.state.itemDueDate,
            itemDateAdded: moment(new Date()).format("YYYY-MM-DD"),
            itemTags: this.state.itemTags,
            itemDescription: this.state.itemDescription,
            itemTasks: this.state.itemTasks,
        }

        axios.post(`${this.state.apiUrl}`, newPlaybookItem)
        .then(res => {
            this.setState({
                open: false
            });
            this.props.addNewPlaybookItem(res.data);            
        })
        .catch(err => console.error(err));
        
        this.resetNewItemDefaults();
    }

    _onSelectItemTag = (chipLabel) => {
        //Make a deep copy so not to modify original constants
        let prevItemTagColors = JSON.parse(JSON.stringify(this.state.itemTagColorMap));
        let prevItemTagSelection = this.state.itemTags;
        
        //Unselecting
        if(this.state.itemTags.includes(chipLabel)) {
            prevItemTagColors[chipLabel] = unselectedTagColorMap[chipLabel];

            let index = prevItemTagSelection.indexOf(chipLabel);
            if(index > -1) {
                prevItemTagSelection.splice(index, 1);
            }
            
        //Selecting
        } else {
            prevItemTagColors[chipLabel] = selectedTagColorMap[chipLabel];
            
            if(!prevItemTagSelection.includes(chipLabel)) {
                prevItemTagSelection.push(chipLabel);
            }
        }

        this.setState({
            itemTagColorMap: prevItemTagColors,
            itemTags: prevItemTagSelection,
        });
    }

    _onChangeItemTitle = (event) => {
        this.setState({ 
            itemTitle: event.target.value
        })        
    }

    _onChangeItemDueDate = (event) => {
        this.setState({
            itemDueDate: event.target.value
        })        
    }

    handleChange = name => event => { 
        this.setState({
            [name]: event.target.value,
        });
    };

    _onCreateNewItemTask = () => {
        let itemTasks = this.state.itemTasks;
        let newItemTask = {
            itemTaskName: "",
            itemTaskDueDate: moment(new Date()).add(1,'day').format("YYYY-MM-DD"),
            itemTaskDateCompleted: "",
            itemTaskPriority: 1
        }
        itemTasks.push(newItemTask);

        this.setState({
            itemTasks
        });
    }

    _onDeleteItemTask = index => {
        let itemTasks = this.state.itemTasks;
        itemTasks.splice(index, 1);

        this.setState({ itemTasks });        
    }

    handleChangeItemTaskName = index => event => {
        let itemTasks = this.state.itemTasks;
        itemTasks[index].itemTaskName = event.target.value;

        this.setState({ itemTasks });        
    }

    handleChangeItemTaskDueDate = index => event => {
        let itemTasks = this.state.itemTasks;
        itemTasks[index].itemTaskDueDate = event.target.value;

        this.setState({ itemTasks });
    }

    handleChangeItemTaskPriority = index => event => {
        let itemTasks = this.state.itemTasks;
        itemTasks[index].itemTaskPriority = event.target.value;

        this.setState({ itemTasks });
    }
  
render() {      
    const { classes } = this.props;    
    return (
        <div>
            <Button className={classes.button} onClick={this._handleClickOpen}>
                <AddIcon className={classes.leftIcon} />
                New Item
            </Button>
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    <TextField
                        id="itemTitle"
                        className={classes.textField}
                        margin="normal"
                        label="New Playbook Item"
                        type="text"
                        autoFocus
                        onChange={this._onChangeItemTitle}
                        fullWidth
                        required={true}
                    />
                    
                </DialogTitle>
                <DialogContent>
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
                        onChange={this._onChangeItemDueDate}
                        fullWidth
                        required={true}
                    />
                    
                    <div className={classes.chipGroup}>
                        {Object.keys(unselectedTagColorMap).map((tag, index) => 
                            <Chip key={index}
                                style={{backgroundColor: this.state.itemTagColorMap[tag]}}
                                label={tag}
                                className={classes.chip}
                                onClick={this._onSelectItemTag.bind(this, tag)}
                            /> 
                        )}
                    </div>

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

                    <TextField 
                        className={classes.textField}
                        label="Link"
                        id="itemLinkUrl"
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

                    {this.state.itemTasks.map((itemTask, index) => 
                        <Grid container spacing={16} key={index}>
                            <Grid item xs={5}>
                                <TextField 
                                    autoFocus
                                    className={classes.textField}
                                    label="Task Name"
                                    id="itemTaskName"
                                    value={itemTask.itemTaskName}
                                    onChange={this.handleChangeItemTaskName(index)}
                                    inputProps={{
                                        style: {
                                            fontSize: 12,
                                            height: 15
                                        }
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField 
                                    className={classes.textField}
                                    label="Due Date"
                                    id="itemTaskDueDate"
                                    type="date"
                                    value={itemTask.itemTaskDueDate}
                                    onChange={this.handleChangeItemTaskDueDate(index)}
                                    inputProps={{
                                        style: {
                                            fontSize: 12,
                                            height: 15
                                        }
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField 
                                    label="Priority"
                                    id="itemTaskPriority"
                                    type="number"
                                    value={itemTask.itemTaskPriority}
                                    onChange={this.handleChangeItemTaskPriority(index)}
                                    inputProps={{
                                        style: {
                                            fontSize: 12,
                                            height: 15,
                                            width: "100%"
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton className={classes.iconButton} onClick={this._onDeleteItemTask.bind(this, index)} >
                                <DeleteIcon color="secondary" className={classes.iconFont}/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    )}
                    <br/>

                    <Button color="secondary" className={classes.editButton} aria-label="Add an item task" onClick={this._onCreateNewItemTask}>
                        <EditIcon className={classes.leftIcon}/> 
                        Add new item task
                    </Button>
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={this._handleClose} color="default" style={{position: "absolute", left: 5}}>Cancel</Button>
                    <Button onClick={this._handleCreateNewItem} variant="contained" color="primary">Create</Button>
                </DialogActions>
            </Dialog>
        </div>
        );
    }
}

export default withStyles(styles)(NewItemCard);