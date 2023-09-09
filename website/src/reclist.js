import React, {Component} from "react";
import axios from "axios";
import "./App.css";

class RecList extends Component {
  constructor(props){
    super(props);

    this.myRef = React.createRef();
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:5000/get_recommended_dishes')
    .catch(function (error) {
      console.log(error.response);
    })
    .then(async (res)=> {
      let out_arr = res.data;
      for (let i = 0; i < out_arr.length; i++) {
        let curr_row = this.myRef.current.insertRow(i+1);
        let cell1 = curr_row.insertCell(0);
        let cell2 = curr_row.insertCell(1);
        let cell3 = curr_row.insertCell(2);
        cell1.innerHTML = out_arr[i][0];
        cell2.innerHTML = out_arr[i][1];
        cell3.innerHTML = out_arr[i][2];
      }
    })
  }

  render() {
    return (
      <div className="reclist">
        <table className="reclisttable" ref={this.myRef}>
          <tbody>
            <tr className="tableheader">
              <th>English Name</th>
              <th>Chinese Name</th>
              <th>Date</th>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default RecList;
