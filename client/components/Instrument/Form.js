import React from 'react';

class Form extends React.Component {
  props: {
    handleSubmit: Function,
    instrument: Object,
  };

  render() {
    return (
      <div className="modal">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <textarea ref={r => this.instrumentData = r} defaultValue={JSON.stringify(this.props.instrument.data)} />
          <button type="submit">Save</button>
        </form>
      </div>
    );
  }

  handleSubmit(evt: Event) {
    evt.preventDefault();

    this.props.handleSubmit({
      instrumentData: JSON.parse(this.instrumentData.value),
    });
  }
}

export default Form;
