import React, { Component } from 'react';
import './App.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/blue';

//Custom components
import AppNavBar from "./components/AppNavBar/AppNavBar";
import PlaybookDashboard from "./components/PlaybookDashboard/PlaybookDashboard";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue['A400']
    },
    secondary: {
        main: pink['400']
    }
  }
});

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playbookItems: [],
        }

        // this.getPlaybookItems = this.getPlaybookItems.bind(this);
    }

    render() {
        return (
            <div className="App">
                <MuiThemeProvider theme={theme}>
                    <AppNavBar 
                        // playbookItems={this.state.playbookItems} 
                    />
                    <PlaybookDashboard 
                        // getPlaybookItems={this.getPlaybookItems}
                    />
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
