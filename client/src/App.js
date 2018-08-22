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
      newPlaybookItem: null
    }
  }

  addNewPlaybookItem = (newPlaybookItem) => {  
    if(newPlaybookItem != null) {
      this.setState({
        newPlaybookItem: newPlaybookItem
      });
    }
  }

  render() {
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <AppNavBar addNewPlaybookItem={this.addNewPlaybookItem}/>
          <PlaybookDashboard 
            newPlaybookItem={this.state.newPlaybookItem}/>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
