import React from 'react';

const PRESET_SYNTH_1 = {
  "type": "sawtooth",
  "volume": 15,
  "envelope": { "attack": 0.01, "sustain": 0.2, "decay": 0, "release": 0.1 },
  "steps": [ [0, 2, "a#2"], [4, 2, "a#2"], [8, 1, "a#3"], [10, 1, "a#3"], [12, 1, "a#3"],
  [14, 1, "a#3"], [16, 2, "g#2"], [20, 2, "g#2"], [24, 1, "g#3"], [26, 1, "g#3"], [28, 1, "g#3"],
  [30, 1, "g#3"], [32, 2, "f#2"], [36, 2, "f#2"], [40, 1, "f#3"], [42, 1, "f#3"], [44, 1, "f#3"],
  [46, 1, "f#3"], [48, 2, "d#2"], [52, 2, "d#2"], [56, 1, "d#3"], [58, 1, "d#3"], [60, 1, "d#3"],
  [62, 1, "d#3"], [64, 8, "a#2"], [72, 8, "a#3"], [80, 8, "g#2"], [88, 8, "g#3"], [96, 8, "f#2"],
  [104, 8, "f#3"], [112, 8, "d#2"], [120, 8, "d#3"] ]
};

class Form extends React.Component {
  props: {
    handleSubmit: Function,
    instrument: Object,
  };

  constructor(props) {
    super(props);
    this.state = {
      instrumentData: JSON.stringify(this.props.instrument.data, null, 2),
    };
  }

  render() {
    return (
      <div className="modal" style={{display: 'block'}}>
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div className="modal-header">
                <h4 className="modal-title">Edit sequencer</h4>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <textarea className="form-control" rows={10} value={this.state.instrumentData} onChange={evt => this.setState({ instrumentData: evt.target.value})} />
                </div>
                {this.props.instrument.instrumentType == 'Synth' &&
                  <div className="btn-group">
                    <button className="btn-small btn btn-default" onClick={this.handlePreset.bind(this, PRESET_SYNTH_1)}>Preset #1</button>
                  </div>
                }
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  handlePreset(preset, evt) {
    evt.preventDefault();

    this.setState({ instrumentData: JSON.stringify(preset, null, 2) });
  }

  handleSubmit(evt: Event) {
    evt.preventDefault();

    this.props.handleSubmit({
      instrumentData: JSON.parse(this.state.instrumentData),
    });
  }
}

export default Form;
