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

    this.handleKeypress = this.handleKeypress.bind(this);
    this.getDishes = this.getDishes.bind(this);
  }

  handleKeypress(args) {
    if (args["code"] == "Enter") {
      this.handleClick({
        "value":document.getElementById(":r0:").value
      })
    }
  }

  getDishes() {
    axios.get('http://127.0.0.1:5000/existing_dishes')
    .catch(function (error) {
        console.log(error.response);
    })
    .then((res) => {
        let out_arr = res.data;
        let formatted_arr = []
        for(let i = 0; i < out_arr.length; i++) {
            formatted_arr.push({id:out_arr[i][0],value:out_arr[i][0]})
        }
        this.setState({
            items:formatted_arr
        })
    })
  }

  componentDidMount() {
    this.getDishes();

    document.getElementById(":r0:").addEventListener("keydown", this.handleKeypress);
    document.getElementById(":r2:").addEventListener("keydown", this.handleDeleteClick);
  }

  componentWillUnmount() {
    document.getElementById(":r0:").removeEventListener("keydown", this.handleKeypress);
    document.getElementById(":r2:").addEventListener("keydown", this.handleDeleteClick);
  }

  handleClick(item){
    let input = {"search":item.value}
    axios.post('http://127.0.0.1:5000/add_eaten_dish', input)
    .catch(function(error){
        console.log(error.response);
    })
    .then((res)=>{
        //console.log(res);
        this.getDishes();
    })
  }

  handleDeleteClick(item){
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
          <DatalistInput label = "Type in the meal you just ate: "
          onSelect={(item)=>this.handleClick(item)}
          items={items}/>
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
