import React, {Component} from "react";
import "./App.css";
import RecList from "./reclist.js";
import InsertMeal from "./insertmeal.js";

class App extends Component {
  render() {
    return (
      <div className="app">
        <RecList/>
        <InsertMeal/>
      </div>
    )
  }
}

export default App;
