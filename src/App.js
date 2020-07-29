import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import InfoIcon from '@material-ui/icons/Info';
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import Container from '@material-ui/core/Container';

// p - pending(-1), s- success(0), e - error(1), q- queued(2)
var p, s, e, q;
function getValuesForChart(tasks) {
  p = 0; s = 0; e = 0; q = 0;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i]["status"] === -1) {
      p++;
    }
    else if (tasks[i]["status"] === 1) {
      s++;
    }
    else if (tasks[i]["status"] === 2) {
      q++;
    }
    else {
      e++;
    }
  }
}

class App extends React.Component {

  // states
  state = {
    items: [],
    secondColumn: [],
    // charts parameters
    labels: ["pending", "success", "error", "queued"],
    datasets: [{
      data: [],
      backgroundColor: ['orange', 'green', 'red', 'blue'],
    }],
  }

  // call the ocv classifier collection API , (populated by after running ../scripts/text_classification.py)
  componentDidMount() {
    axios.get(`YOUR ENDPOINT`)
      .then(res => {
        var classifiers = res.data;
        console.log(classifiers.length);
        // contsruct items from collections to show on the leftmost pannel
        var arr = [];
        for (var i = 0; i < classifiers.length; i++) {
          var apps = [];
          for (var j = 0; j < classifiers[i]["apps"]?.length; j++) {
            let a = {
              "name": classifiers[i]["apps"][j],
              "label": classifiers[i]["apps"][j],
              onClick: this.onClick.bind(this)
            };
            apps.push(a);
          }
          let obj = {
            "name": classifiers[i]["name"],
            "label": classifiers[i]["name"],
            "items": apps,
          };
          arr.push(obj);
          arr.push("divider");
        }
        this.setState({ items: arr });
      })
  }

  // onclick function for each websites , automating each flow
  onClick(e) {
    let appName = e.target.textContent;
    let tasks;
    console.log(appName);

   // request with url clicked to get the tasks list
    axios.get(`YOUR ENDPOINT`)
      .then(res => {
        let response = res.data;
        // response will be an array, process response to create tasks accordingly 
        for (var i = 0; i < response.length; i++) {
          let o = {
            title: response[i],
            status :-1,
            isLoading: true,
            errorMsg: "pending",
          }
          tasks.push(o);
          getValuesForChart(tasks);
          this.setState({
            secondColumn: tasks,
            datasets: [{
              data: [p, s, e, q],
            }]
          })
        }
      })

    // process each task list 
    for (var i = 0; i < tasks.length; i++) {
      let taskName = tasks[i]["title"];
      axios.get(`YOUR ENDPOINT`)
        .then(res => {
          let response = res.data;
          if (res.status === 200) {
            tasks[i]["isLoading"] = false;
            if (response["errorMsg"] === "SUCCESS") {
              tasks[i]["status"] = 1;
              tasks[i]["errorMsg"] = null;
            }
            else {
              tasks[i]["status"] = 2;
              tasks[i]["errorMsg"] = response["errorMsg"];
            }
          }
          else {
            tasks[i]["isLoading"] = false;
            tasks[i]["status"] = 0;
            tasks[i]["errorMsg"] = null;
            tasks[i]["errorMsg"] = "ERROR";
          }
          getValuesForChart(tasks);
          this.setState({
            secondColumn: tasks,
            datasets: [{
              data: [p, s, e, q],
            }]
          })
        })
    }
}

  // UI Part Rendering
  render() {
    return (
      <div>
        <Header />
        <br />
        <div className="row">
          <div className="column" >
            <Sidebar items={this.state.items} />
          </div>
          <div className="column2">
            <Container maxWidth="sm">
              <h12 style={{ color: "black" }}>Task List</h12>
              <ol>
                {
                  this.state.secondColumn.map((task) => {
                    return <li className="columnpadding" style={{ color: "black" }}>
                      {task.title}
                    </li>
                  })
                }
              </ol></Container>
          </div>
          <div className="column2">
            <Container maxWidth="sm">
              <h12 style={{ color: "black" }}>Task Status</h12>
              <ol>
                {
                  this.state.secondColumn.map((task) => {
                    return <li className="columnpadding" style={{ color: "black" }}>
                      {task.isLoading === true
                        ? <CircularProgress size={20} style={{ color: "orange" }} />
                        : (task.status === 2
                          ? <InfoIcon style={{ color: "blue" }} />
                          : (task.status === 1
                            ? <CheckCircleIcon style={{ color: "green" }} />
                            : <CancelIcon style={{ color: "red" }} />))}
                      - {task.errorMsg}
                    </li>
                  })
                }
              </ol></Container>
          </div>
          <div className="column">
            <Container maxWidth="sm">
              <h12 style={{ color: "black" }}>Performance</h12>
              <Pie
                data={{
                  labels: this.state.labels,
                  datasets: this.state.datasets,
                }}
              />
            </Container>
          </div>
        </div>
      </div >
    );
  }
}

export default App;

// examples of variables used and code used for testing the flow
    // for column 1
    // const items = [
    //   {
    //     name: "Autofill",
    //     label: "Autofill",
    //     items: [
    //       { name: "App", label: "App/Websites", onClick },
    //     ]
    //   },
    //   "divider",
    //   {
    //     name: "Save Prompt",
    //     label: "Save Prompt",
    //     items: [
    //       { name: "App", label: "App/Websites", onClick },
    //     ]
    //   }
    // ];

    // for column 2
    // let tasks = [
    //   {
    //     title: 'App ID Domain Mapping',
    //     status: -1,
    //     isLoading: true,
    //     errorMsg: "pending",
    //   },
    //   {
    //     title: 'Fields Autofillibility Check',
    //     status: -1,
    //     isLoading: true,
    //     errorMsg: "pending",
    //   },
    //   {
    //     title: 'Assigned to Feature Team',
    //     status: -1,
    //     isLoading: true,
    //     errorMsg: "pending",
    //   },
    //   {
    //     title: 'Shipped for next Release Cycle',
    //     status: -1,
    //     isLoading: true,
    //     errorMsg: "pending",
    //   }
    // ];

    // for column 3
    // setTimeout(() => {
    //   tasks[0].status = 1;
    //   tasks[0].isLoading = false;
    //   tasks[0].errorMsg = "SUCCESS";
    //   getValuesForChart(tasks);
    //   this.setState({
    //     secondColumn: tasks,
    //     datasets: [{
    //       data: [p, s, e, q],
    //     }]
    //   })
    // }, 2000)
    // getValuesForChart(tasks);
    // this.setState({
    //   secondColumn: tasks,
    //   datasets: [{
    //     data: [p, s, e, q],
    //   }]
    // })
    // setTimeout(() => {
    //   tasks[1].status = 1;
    //   tasks[1].isLoading = false;
    //   tasks[1].errorMsg = "SUCCESS";
    //   getValuesForChart(tasks);
    //   this.setState({
    //     secondColumn: tasks,
    //     datasets: [{
    //       data: [p, s, e, q],
    //     }]
    //   })
    // }, 6000)
    // setTimeout(() => {
    //   tasks[2].status = 1;
    //   tasks[2].isLoading = false;
    //   tasks[2].errorMsg = "SUCCESS";
    //   getValuesForChart(tasks);
    //   this.setState({
    //     secondColumn: tasks,
    //     datasets: [{
    //       data: [p, s, e, q],
    //     }]
    //   })
    // }, 9000)
    // setTimeout(() => {
    //   tasks[3].status = 2;
    //   tasks[3].isLoading = false;
    //   tasks[3].errorMsg = "QUEUED";
    //   getValuesForChart(tasks);
    //   this.setState({
    //     secondColumn: tasks,
    //     datasets: [{
    //       data: [p, s, e, q],
    //     }]
    //   })
    // }, 11000)