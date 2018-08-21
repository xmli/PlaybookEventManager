import React from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
// material-ui
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase/ButtonBase';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';

import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InfoIcon from '@material-ui/icons/Info';

import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/blue';
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
  // avatar: {
  //   backgroundColor: pink[400],
  // },
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
  iconButton: {
    height: 25, 
    width: 25, 
    marginLeft: 10, 
    position:"absolute", 
    right: 0
  },
  // actions: {
  //   display: 'flex',
  // },
  // expand: {
  //   transform: 'rotate(0deg)',
  //   transition: theme.transitions.create('transform', {
  //     duration: theme.transitions.duration.shortest,
  //   }),
  //   marginLeft: 'auto',
  //   [theme.breakpoints.up('sm')]: {
  //     marginRight: -8,
  //   },
  // },
  // expandOpen: {
  //   transform: 'rotate(180deg)',
  // },
});

class PlaybookCard extends React.Component {
  state = { 
    expanded: false,
    itemTasks: this.props.itemTasks,
    apiUrl: "/api/items",
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleChange = name => event => {        
    for(const[index, itemTask] of this.state.itemTasks.entries()) {
      if(itemTask.itemTaskName == event.target.value) {

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
            // avatar={
            //   <Avatar aria-label="card-recipe" className={classes.avatar}>
            //     {this.props.itemTitle[0]}
            //   </Avatar>
            // }
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title={
            <Typography variant="title" gutterBottom>
              {this.props.itemTitle}
            </Typography>
            }
            // subheader={<Typography variant="button">Due: <strong>{moment(this.props.itemDueDate).format("M/D/YYYY")}</strong></Typography>}
            subheader={
              <FormControl className={classes.formControl} disabled>
                <Typography variant="button" noWrap><strong>Due: &nbsp;</strong>
                  {/* <ButtonBase> */}
                    <Input className={classes.input} 
                      value={moment(this.props.itemDueDate).format("M/D/YYYY")} 
                      inputProps={{ 
                        style: {
                          textAlign: "center"
                        }
                      }}
                    />
                  {/* </ButtonBase> */}
                </Typography>
              </FormControl>
            }
          />
          {/* <CardContent className={classes.cardContent}>
            <FormControl className={classes.formControl} disabled>
              <Typography variant="button" noWrap>Due: &nbsp;
                <Input value={moment(this.props.itemDueDate).format("M/D/YYYY")} />
              </Typography>
            </FormControl>
          </CardContent> */}

          {/* ItemTasks */}
          <CardContent className={classes.cardContent}>
            {this.props.itemTags.sort().map((tag, index) =>
              <Chip key={index}
                color={this.assignChipColor(tag)} //built-in colors
                // style={{backgroundColor: this.assignChipColor(tag)}}
                label={tag}
                className={classes.chip}
              />        
            )}
          </CardContent>

          <CardContent className={classes.cardContent}>
            <Typography variant="body2" component="p">
              Notes:
            </Typography>
            <Typography component="p">
              <em>{this.props.itemDescription}</em>
            </Typography>
          </CardContent>

          <CardContent className={classes.cardContent}>
            <FormControl component="fieldset" className={classes.formControl}>
              {/* <Typography variant="body2"> */}
                <FormLabel component="legend">
                  <strong>Tasks:</strong>
                </FormLabel>
              {/* </Typography> */}

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
                            <IconButton className={classes.iconButton} >
                              <InfoIcon style={{fontSize: "15px"}} />
                            </IconButton>
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

          {/* <CardActions className={classes.actions} disableActionSpacing>
            <IconButton aria-label="Add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph variant="body2">
                Method:
              </Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                minutes.
              </Typography>
              <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving
                chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion,
                salt and pepper, and cook, stirring often until thickened and fragrant, about 10
                minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
              </Typography>
              <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes and peppers, and
                cook without stirring, until most of the liquid is absorbed, 15 to 18 minutes.
                Reduce heat to medium-low, add reserved shrimp and mussels, tucking them down into
                the rice, and cook again without stirring, until mussels have opened and rice is
                just tender, 5 to 7 minutes more. (Discard any mussels that don’t open.)
              </Typography>
              <Typography>
                Set aside off of the heat to let rest for 10 minutes, and then serve.
              </Typography>
            </CardContent>
          </Collapse> */}
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
