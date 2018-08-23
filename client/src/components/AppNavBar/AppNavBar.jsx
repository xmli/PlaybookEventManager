import React from 'react';
import PropTypes from 'prop-types';

//material-ui
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

//icons
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

//custom import
import SearchBar from "../SearchBar/SearchBar";

const styles = theme => ({
    root: {
        flexGrow: 1,
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    flex: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
});

class AppNavBar extends React.Component {
    constructor() {
        super();

        this.state = {
            //Authentication (TODO)
            auth: true,
            anchorEl_menu: null,
        };
    }

    /**
     * Menu controls
     */
    _handleMenu = event => {
        this.setState({ anchorEl_menu: event.currentTarget });
    };

    _handleMenuClose = () => {
        this.setState({ anchorEl_menu: null });
    };

    /****************
    * RENDER FUNCTION 
    *****************/
    render() {
        const { classes } = this.props;
        const { auth, anchorEl_menu } = this.state;
        const open = Boolean(anchorEl_menu);

        return (
            <div className={classes.root}>
                <AppBar position="fixed">
                    <Toolbar>

                        {/*******************************/}
                        {/* MENU BUTTON AT THE TOP LEFT */}
                        <IconButton 
                            TouchRippleProps={{center: false}}  //Ripple effect from touch point
                            className={classes.menuButton} 
                            color="inherit" 
                            aria-label="Menu"
                        >
                            <MenuIcon />
                        </IconButton>

                        {/*********************/}
                        {/* APP NAV BAR TITLE */}
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            Playbook
                        </Typography>

                        {/* <SearchBar suggestions={this.props.playbookItems} /> */}

                        {/**************************/}
                        {/* AUTHENTICATION (TODO) */}
                        {auth && (
                            <div>
                                <IconButton
                                    aria-owns={open ? 'menu-appbar' : null}
                                    aria-haspopup="true"
                                    onClick={this._handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                
                                {/*****************************************/}
                                {/* MENU AT TOP RIGHT FOR PROFILE OPTIONS */}
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl_menu}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={this._handleMenuClose}
                                >
                                    <MenuItem onClick={this._handleMenuClose}>Profile</MenuItem>
                                    <MenuItem onClick={this._handleMenuClose}>My account</MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

AppNavBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppNavBar);
