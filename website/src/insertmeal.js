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
  }

  componentDidMount() {
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

  handleClick(item){
    let input = {"search":item.value}
    axios.post('http://127.0.0.1:5000/add_eaten_dish', input)
    .catch(function(error){
        console.log(error.response);
    })
    .then((res)=>{
        console.log(res);
    })
  }

  render() {
    const {items} = this.state;
    return (
      <div className="insertmeal">
        <DatalistInput label = "Type in the meal you just ate: "
        onSelect={(item)=>this.handleClick(item)}
        items={items}/>
      </div>
    )
  }
}

export default InsertMeal;