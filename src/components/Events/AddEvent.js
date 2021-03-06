import React, { Component } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import moment from "moment";
import { withFirebase } from "../Firebase";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

function AddButton() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };

  const fabs = [
    {
      color: "primary",
      className: classes.fab,
      icon: <AddIcon />,
      label: "Add"
    },
    {
      color: "secondary",
      className: classes.fab,
      icon: <EditIcon />,
      label: "Edit"
    }
  ];

  return (
    <div className={classes.root}>
      {fabs.map((fab, index) => (
        <Zoom
          key={fab.color}
          in={value === index}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${
              value === index ? transitionDuration.exit : 0
            }ms`
          }}
          unmountOnExit
        >
          <Fab
            aria-label={fab.label}
            className={fab.className}
            color={fab.color}
          >
            {fab.icon}
          </Fab>
        </Zoom>
      ))}
    </div>
  );
}

class AddEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      date: "",
      openForm: false
    };
  }

  handleChange = event => {
    const field = event.target.name;

    // we use square braces around the key `field` coz its a variable (we are setting state with a dynamic key name)
    this.setState({
      [field]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { title, description, date } = this.state;
    const { firebase } = this.props;

    const formated = moment(date).format();

    firebase
      .db()
      .ref("events")
      .push({ title, description, date: formated });

    this.setState({ title: "", description: "", date: "" });
  };

  handleOpen = () => {
    this.setState({ openForm: true });
  };

  render() {
    const { openForm } = this.state;
    return (
      <div>
        <div className="event-form-container">
          {openForm === true && (
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter event title"
                  name="title"
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter event description"
                  name="description"
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label>Event Date:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter date in the format mm/dd/yyyy"
                  name="date"
                  value={this.state.date}
                  onChange={this.handleChange}
                />
              </div>
            </form>
          )}

          <div onClick={this.handleOpen}>
            <AddButton />
          </div>
        </div>
      </div>
    );
  }
}

export default withFirebase(AddEvent);
