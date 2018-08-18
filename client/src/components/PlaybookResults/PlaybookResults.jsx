import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: "100%",
      height: "auto",
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
});

class PlaybookResults extends Component {
    render() {
        
        let itemListContent;
        const { playbookItems, classes } = this.props;

        if(playbookItems) {
            itemListContent = (
                <GridList cols={3} cellHeight={150} className={classes.gridList}>
                    {playbookItems.map(item => (
                        <GridListTile key={item._id}>
                            <GridListTileBar 
                                title={item.cardTitle}
                                subtitle={
                                    <span>
                                        Due: <strong>{item.cardDueDate}</strong>
                                    </span>
                                }
                                actionIcon={
                                    <IconButton className={classes.icon}>
                                        <InfoIcon />
                                    </IconButton>
                                }
                            />
                            <img style={{width:"100%", height:"100px"}}
                                src={item.cardImageUrl} 
                                alt={item.cardTitle}
                            />
                        </GridListTile>
                    ))}
                </GridList>
            )
        } else {
            itemListContent = null;
        }

        return (
            <div className={classes.root}>
                {itemListContent}
            </div>
        )
    }
}

PlaybookResults.propTypes = {
    playbookItems: PropTypes.array.isRequired
}

export default withStyles(styles)(PlaybookResults);