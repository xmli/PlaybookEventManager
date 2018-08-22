import React from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import axios from 'axios';

// material-ui
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import InfoIcon from '@material-ui/icons/Info';
// import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DateIcon from '@material-ui/icons/EventAvailable';
import NotesIcon from '@material-ui/icons/Notes';

// import pink from '@material-ui/core/colors/pink';
// import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
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

    //delete
    anchorEl: null,
  };

  //delete button
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  _onDeletePlaybookCard = () => {
    this.props.deletePlaybookItem(this.props.itemId);
    this.setState({ anchorEl: null });
  }

  //handle an update to an item
  handleChange = name => event => {        
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
        this.updatePlaybookItem();
        break;
      }
    }
  };
  

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
    }).then(res => res.json())
    .catch(error => console.error('Error:', error));
  }

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

  render() {        
    const { classes } = this.props;

    return (
        <Card className={classes.card}>
          <CardHeader
            action={
              <div>
                <IconButton 
                  aria-owns={this.state.anchorEl ? 'simple-menu' : null}
                  aria-haspopup="true"
                  onClick={this.handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={this.state.anchorEl}
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>Edit</MenuItem>
                  <MenuItem onClick={this._onDeletePlaybookCard}>Delete</MenuItem>
                </Menu>
              </div>
            }
            title={
            <Typography variant="title" gutterBottom>
              {this.props.itemTitle}
            </Typography>
            }
            subheader={
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

          {/* ItemTasks */}
          <CardContent className={classes.cardContent}>
            {this.props.itemTags.sort().map((tag, index) =>
              <Chip key={index}
                color={this.assignChipColor(tag)} //built-in colors
                label={tag}
                className={classes.chip}
              />        
            )}
          </CardContent>

          <CardContent className={classes.cardContent}>
            <Typography variant="body2" component="p" noWrap>
                <NotesIcon className={classes.button}/>
              Notes:
            </Typography>
            <Typography component="p">
              <em>{this.props.itemDescription}</em>
            </Typography>
          </CardContent>

          <CardContent className={classes.cardContent}>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">
                  <strong>Tasks:</strong>
                </FormLabel>

              <FormGroup>
                {this.props.itemTasks.map(itemTask => 
                  <FormControlLabel key={itemTask._id}
                    control={
                      <Checkbox 
                        checked={itemTask.itemTaskDateCompleted !== null} 
                        onChange={this.handleChange(`${itemTask.itemTaskName}`)} 
                        value={itemTask.itemTaskName} 
                      />
                    }
                    label={
                      (itemTask.itemTaskDateCompleted !== null) ?
                        (<span style={{color: grey[500]}}>
                            {itemTask.itemTaskName}
                          <Typography variant="caption">
                            Completed: {moment(itemTask.itemTaskDateCompleted).format("M/D/YYYY")}
                          </Typography>
                        </span>):
                        (<span>
                            {itemTask.itemTaskName}
                          <Typography variant="caption">
                            Due: {moment(itemTask.itemTaskDueDate).format("M/D/YYYY")}
                          </Typography>
                        </span>)
                    }
                  />
                )}
              </FormGroup>
            </FormControl>
          </CardContent>
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
