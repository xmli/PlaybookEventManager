import React, { Component } from 'react';
import './App.css';

//Custom components
import AppNavBar from "./components/AppNavBar/AppNavBar";
import PlaybookDashboard from "./components/PlaybookDashboard/PlaybookDashboard";
import PlaybookContainer from "./components/PlaybookContainer/PlaybookContainer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppNavBar />
        {/* <PlaybookContainer /> */}
        <PlaybookDashboard />
      </div>
    );
  }
}

export default App;
