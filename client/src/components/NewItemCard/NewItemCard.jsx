import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import * as moment from 'moment';
import Chip from '@material-ui/core/Chip';

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
        display: "block"
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
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        padding: theme.spacing.unit / 2,
    },
});

const unselectedTagColorMap = {
    "Career": blue[100],
    "School": pink[100],
    "Family": grey[300]
}

const selectedTagColorMap = {
    "Career": blue['A400'],
    "School": pink[400],
    "Family": grey[600]
}

class NewItemCard extends React.Component {
    state = {
        open: this.props.createNewCard,
        itemTitle: "",
        itemDueDate: moment(new Date()).format("YYYY-MM-DD"),
        itemTagColorMap: unselectedTagColorMap,
        itemTagsSelected: [],
        multiline: "",
    };

    _handleClickOpen = () => {
        this.setState({ open: true });
    };

    _handleClose = () => {
        this.setState({ 
            open: false,
            itemTagColorMap: unselectedTagColorMap,
            itemTagsSelected: [],
        });
    };

    _handleCreateNewItem = () => {
        console.log("New item created!");
        this.setState({ 
            open: false,
            itemTagColorMap: unselectedTagColorMap,
            itemTagsSelected: [],
        });
    }

    _onSelectItemTag = (chipLabel) => {
        //Make a deep copy so not to modify original constants
        let prevItemTagColors = JSON.parse(JSON.stringify(this.state.itemTagColorMap));
        let prevItemTagSelection = this.state.itemTagsSelected;
        
        //Unselecting
        if(this.state.itemTagsSelected.includes(chipLabel)) {
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
            itemTagsSelected: prevItemTagSelection,
        });
    }

    _onChangeItemTitle = (event) => {
        this.setState({ 
            itemTitle: event.target.value
        })        
    }

    _onChangeItemDueDate = (event) => {
        this.setState({
            itemDueDate: moment(event.target.value)
        })        
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
  
render() { 
    console.log(this.state.itemDueDate);
     
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
                    {/* <DialogContentText>
                        Create a new playbook item.
                    </DialogContentText> */}
                    <TextField
                        id="itemDueDate"
                        className={classes.textField}
                        label="Due Date"
                        type="date"
                        defaultValue={moment(new Date()).format("YYYY-MM-DD")}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this._onChangeItemDueDate}
                        fullWidth
                        required={true}
                    />
                    
                    <div className={classes.chipGroup}>
                        {Object.keys(unselectedTagColorMap).map((tag, index) => 
                            <Chip key={index}
                                // color={this.assignChipColor(tag)} //built-in colors
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
                        rowsMax="4"
                        value={this.state.multiline}
                        onChange={this.handleChange('multiline')}
                        className={classes.textField}
                        margin="normal"
                        fullWidth
                        />
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={this._handleClose} color="default" style={{position: "absolute", left: 5}}>Cancel</Button>
                    <Button onClick={this._handleCreateNewItem} color="primary">Create</Button>
                </DialogActions>
            </Dialog>
        </div>
        );
    }
}

export default withStyles(styles)(NewItemCard);