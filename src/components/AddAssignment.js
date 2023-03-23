import React  from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Grid from '@mui/material/Grid';
import {DataGrid} from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

class AddAssignment extends React.Component {
    constructor(props) {
      super(props);
      this.state = {open:false ,assignment: []};
    };
 
 componentDidMount() {
    this.fetchAssignments();
  }
 
 
  fetchAssignments = () => {
    console.log("Assignment.fetchAssignments");
    const token = Cookies.get('XSRF-TOKEN');
    fetch(`${SERVER_URL}/gradebook`, 
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
  
   
 
   
    handleClickOpen = () => {
      this.setState( {open:true} );
    };

   
   handleClose = () => {
   	this.setState({open:false});
   }
    
     handleChange = (event) => {
      this.setState({assignment:{assignment_id: event.target.value}});
    }
    
     handleAdd = () => {
       this.props.addAssignment(this.state.assignment);
       this.handleClose();
    }
    
    // when user has entered a new grade, update the state
    //  id    - index of row of grade change
    //  props - contains the new grade
    
    
    // handleEditCellChange = ({ id, field, props }) => {
//        console.log("edit cell change id:"+id+" field:"+field+" value:"+props.value);
//        const newAssignmentNames = this.state.assignmentNames.map(r => {
//          if (r.id === id){
//            return {...r, [field]:props.value};
//          } else {
//            return {...r};
//          }
//        });
//        this.setState({assignmentNames: newAssignmentNames});
//      };
// 
//     handleCellEditCommit = (e) => {
//       console.log("handleCellEditCommit "+JSON.stringify(e));
//       const newAssignmentNames = this.state.assignmentNAMES.map(r => {
//         //console.log(r.id+"   "+e.id);
//         if (r.id === e.id) {
//           return {...r, [e.field]:e.value};
//         } else {
//           return {...r};
//         }
//       });
//       this.setState({assignmentNames: newAssignmentNames});
//     };
    
       
    render() {
       // const columns = [
//         { field: 'assignmentName', headerName: 'Assignment Name', width: 250, editable:true},
//         { field: 'courseTitle', headerName: 'Course', width: 250, editable:true},
//         { field: 'date', headerName: 'Due Date', width: 150 , editable:true}
//         ];
//         
//         const assignment = this.props.location.assignment;
//       
        return(
           <div>
            <Button variant="outlined" color="primary" style={{margin: 10}} onClick={this.handleClickOpen}>
              Add Assignment
            </Button>
            <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                  <TextField autoFocus fullWidth label="Assignment Name" name="assignmentName" onChange={this.handleChange}  /> 
                  <TextField autoFocus fullWidth label="Course Title" name="courseTitle" onChange={this.handleChange}  /> 
                  <TextField autoFocus fullWidth label="Due Date" name="date" onChange={this.handleChange}  /> 
                </DialogContent>
                <DialogActions>
                  <Button color="secondary" onClick={this.handleClose}>Cancel</Button>
                  <Button id="Add" color="primary" onClick={this.handleAdd}>Add</Button>
                </DialogActions>
              </Dialog>      
          </div>
            ); 
        };
}

export default AddAssignment;
