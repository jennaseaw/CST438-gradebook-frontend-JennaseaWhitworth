import React  from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Grid from '@mui/material/Grid';
import {DataGrid} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js';

class AddAssignment extends React.Component {
    constructor(props) {
      super(props);
      this.state = {selected: 0, assignments: []};
    };
 
   componentDidMount() {
    this.fetchAssignments();
  }
 
  fetchAssignments = () => {
    console.log("Assignment.fetchAssignments");
    const token = Cookies.get('XSRF-TOKEN');
    fetch(`${SERVER_URL}/addAssignment`, 
      {  
        method: 'GET', 
        headers: { 'X-XSRF-TOKEN': token }
      } )
    .then((response) => response.json()) 
    .then((responseData) => { 
      if (Array.isArray(responseData.assignments)) {
        //  add to each assignment an "id"  This is required by DataGrid  "id" is the row index in the data grid table 
        this.setState({ assignments: responseData.assignments.map((assignment, index) => ( { id: index, ...assignment } )) });
      } else {
        toast.error("Fetch failed.", {
          position: toast.POSITION.BOTTOM_LEFT
        });
      }        
    })
    .catch(err => console.error(err)); 
  }
  
   onRadioClick = (event) => {
    console.log("Assignment.onRadioClick " + event.target.value);
    this.setState({selected: event.target.value});
  }
  
  handleSubmit = ( ) => {
      console.log("Assignment.handleSubmit");
      const token = Cookies.get('XSRF-TOKEN');
      
      fetch(`${SERVER_URL}/addAssignment/${this.props.location.assignment.assignmentId}` , 
          {  
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json',
                       'X-XSRF-TOKEN': token }, 
            body: JSON.stringify({assignmentId:this.props.location.assignment.assignmentId})
          } )
      .then(res => {
          if (res.ok) {
            toast.success("Assignment successfully added", {
            position: toast.POSITION.BOTTOM_LEFT
            });
            this.fetchGrades();
          } else {
            toast.error("Assignment not added", {
            position: toast.POSITION.BOTTOM_LEFT
            });
            console.error('Put http status =' + res.status);
      }})
        .catch(err => {
          toast.error("Assignment not added", {
            position: toast.POSITION.BOTTOM_LEFT
          });
          console.error(err);
        });
   };        
    
    // when user has entered a new grade, update the state
    //  id    - index of row of grade change
    //  props - contains the new grade
    handleEditCellChange = ({ id, field, props }) => {
       console.log("edit cell change id:"+id+" field:"+field+" value:"+props.value);
       const newgrades = this.state.grades.map(r => {
         if (r.id === id){
           return {...r, [field]:props.value};
         } else {
           return {...r};
         }
       });
       this.setState({grades: newgrades});
     };

    handleCellEditCommit = (e) => {
      console.log("handleCellEditCommit "+JSON.stringify(e));
      const newgrades= this.state.grades.map(r => {
        //console.log(r.id+"   "+e.id);
        if (r.id === e.id) {
          return {...r, [e.field]:e.value};
        } else {
          return {...r};
        }
      });
      this.setState({grades: newgrades});
    };
    
    handleEditCellChange = ({ id, field, props }) => {
       console.log("edit cell change id:"+id+" field:"+field+" value:"+props.value);
       const newAssignmentNames = this.state.assignmentNames.map(r => {
         if (r.id === id){
           return {...r, [field]:props.value};
         } else {
           return {...r};
         }
       });
       this.setState({assignmentNames: newAssignmentNames});
     };

    handleCellEditCommit = (e) => {
      console.log("handleCellEditCommit "+JSON.stringify(e));
      const newAssignmentNames = this.state.assignmentNAMES.map(r => {
        //console.log(r.id+"   "+e.id);
        if (r.id === e.id) {
          return {...r, [e.field]:e.value};
        } else {
          return {...r};
        }
      });
      this.setState({assignmentNames: newAssignmentNames});
    };
    
       
    render() {
       const columns = [
        { field: 'assignmentName', headerName: 'Assignment Name', width: 250, editable:true},
        { field: 'courseTitle', headerName: 'Course', width: 250, editable:true},
        { field: 'date', headerName: 'Due Date', width: 150 , editable:true}
        ];
        
        const assignment = this.props.location.assignment;
      
        return(
            <div className="App">
              <Grid container>
                <Grid item align="left">
                   <h4>Assignment: {assignment.assignmentName}</h4>
                   <h4>Course: {assignment.courseTitle}</h4>                   
                </Grid>
              </Grid>
              <div style={{width:'100%'}}>
                For DEBUG:  display state.
                {JSON.stringify(this.state)}
              </div>
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={this.state.assignmentNames} columns={columns} onCellEditCommit={this.handleCellEditCommit}  />
                <DataGrid rows={this.state.grades} columns={columns} onCellEditCommit={this.handleCellEditCommit}  />
                <Button id="Submit" variant="outlined" color="primary" style={{margin: 10}} onClick={this.handleSubmit} >
                   Submit
                </Button>
              </div>
              <ToastContainer autoClose={1500} />   
            </div>
            ); 
        };
}