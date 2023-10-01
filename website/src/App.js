import React, {Component} from "react";
import "./App.css";
import RecList from "./reclist.js";
import InsertMeal from "./insertmeal.js";

class App extends Component {
  componentDidMount() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkIfMobile);
  }

  checkIfMobile() {
    if (document.body.clientWidth < 950) {
      document.getElementsByClassName("app")[0].classList.add("mobile");
      document.getElementsByClassName("reclist")[0].classList.add("mobile");
      document.getElementsByClassName("insertmeal")[0].classList.add("mobile");
    } else {
      document.getElementsByClassName("app")[0].classList.remove("mobile");
      document.getElementsByClassName("reclist")[0].classList.remove("mobile");
      document.getElementsByClassName("insertmeal")[0].classList.remove("mobile");
    }
  }

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
