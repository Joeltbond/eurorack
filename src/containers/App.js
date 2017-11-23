import React, { Component } from "react";
import { connect } from "react-redux";
import { appMounted } from "../redux_modules/app";
import MidiInput from "../components/MidiInput";

class App extends Component {
  componentWillMount() {
    this.props.appMounted();
  }

  render = () => <MidiInput notes={this.props.notes} />;
}

const mapStateToProps = state => ({
  notes: state.app.notes
});

export default connect(mapStateToProps, { appMounted })(App);
