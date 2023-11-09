import React, {Component} from "react";
import axios from "axios";
import DatalistInput from 'react-datalist-input';
import 'react-datalist-input/dist/styles.css';
import "./App.css";

class InsertMeal extends Component {
  constructor(props){
    super(props);

    this.state = {
        items:[]
    }

    this.myRef = React.createRef();

    //this.handleKeypress = this.handleKeypress.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDeleteKeypress = this.handleDeleteKeypress.bind(this);
    this.getDishes = this.getDishes.bind(this);
  }

  // handleKeypress(args) {
  //   if (args["code"] == "Enter") {
  //     this.handleClick({
  //       "value":document.getElementById(":r0:").value
  //     })
  //   }
  // }

  handleDeleteKeypress(args) {
    if (args["code"] == "Enter") {
      this.handleDeleteClick({
        "value":document.getElementsByClassName("react-datalist-input__textbox")[0].value
      })
    }
  }

  getDishes() {
    //console.log("getDishes");
    axios.get('http://127.0.0.1:5000/get_recommended_dishes')
    .catch(function (error) {
        console.log(error.response);
    })
    .then((res) => {
        //console.log(res.data);
        let out_arr = res.data;
        let formatted_arr = []
        for(let i = 0; i < out_arr.length; i++) {
            formatted_arr.push({id:out_arr[i][0],value:out_arr[i][0]})
        }
        this.setState({
            items:formatted_arr
        })
        
        let childNodes = document.getElementsByClassName("reclisttable")[0].childNodes[0].childNodes;
        for (let i = 1; i < childNodes.length; i) {
          childNodes[i].remove();
        }

        for(let i = 0; i < out_arr.length; i++) {
          let curr_row = document.getElementsByClassName("reclisttable")[0].insertRow(i+1);
          let cell1 = curr_row.insertCell(0);
          let cell2 = curr_row.insertCell(1);
          let cell3 = curr_row.insertCell(2);
          cell1.innerHTML = out_arr[i][0];
          cell2.innerHTML = out_arr[i][1];
          cell3.innerHTML = out_arr[i][2];
          let name = out_arr[i][0];
          curr_row.addEventListener("click", (event)=>{this.addEatenDish(event, name)})
        }
    })
  }

  addEatenDish(event, name) {
    let input = {"search": name};
    axios.post('http://127.0.0.1:5000/add_eaten_dish', input)
    .catch(function(error) {
      console.log(error.response);
    })
    .then((res)=>{
      //console.log(res);
      this.getDishes();
    })
  }

  componentDidMount() {
    this.getDishes();

    //document.getElementById(":r0:").addEventListener("keydown", this.handleKeypress);
    document.getElementsByClassName("react-datalist-input__textbox")[0].addEventListener("keydown", this.handleDeleteKeypress);
  }

  componentWillUnmount() {
    //document.getElementById(":r0:").removeEventListener("keydown", this.handleKeypress);
    document.getElementsByClassName("react-datalist-input__textbox")[0].addEventListener("keydown", this.handleDeleteKeypress);
  }

  handleClick(){
    if (document.getElementById("englishinput") == null) {
      return;
    }

    let english = document.getElementById("englishinput").value;
    let chinese = document.getElementById("chineseinput").value;

    let input = {"english": english, "chinese": chinese}
    axios.post('http://127.0.0.1:5000/add_eaten_dish', input)
    .catch(function(error){
        console.log(error.response);
    })
    .then((res)=>{
        //console.log(res);
        this.getDishes();
    })
  }

  handleDeleteClick(item) {
    let input = {"search":item.value}
    axios.post('http://127.0.0.1:5000/remove_eaten_dish', input)
    .catch(function(error) {
      console.log(error.response);
    })
    .then((res)=>{
      //console.log(res);
      this.getDishes();
    })
  }

  render() {
    const {items} = this.state;
    return (
      <div className="insertmeal">
        <div className="inputcontainer">
          <div className="layer">
            <div className="english">English Name:</div>
            <div className="chinese">Chinese Name:</div>
          </div>
          <div className="layer">
            <input className="insertinput" id="englishinput"/>
            <input className="insertinput" id="chineseinput"/>
            <button className="insertsubmit" onClick={this.handleClick}>Submit</button>
          </div>
        </div>
        <div className="inputcontainer">
          <DatalistInput label = "Type in the meal you would like to delete: "
          onSelect={(item)=>this.handleDeleteClick(item)}
          items={items}/>
        </div>
      </div>
    )
  }
}

export default InsertMeal;
