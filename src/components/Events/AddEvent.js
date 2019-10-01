import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import moment from "moment";

class AddEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      date: ""
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
      .database()
      .ref("events")
      .push({ title, description, date: formated });

    this.setState({ title: "", description: "", date: "" });

    alert("Add events success.");
  };

  render() {
    return (
      <div>
        <div className="jumbotron event-form-container">
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

            <button type="submit" className="btn btn-primary">
              Add Event
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default withFirebase(AddEvent);
