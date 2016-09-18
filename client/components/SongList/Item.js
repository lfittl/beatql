import React from 'react';
import { Link } from 'react-router';

class Item extends React.Component {
  render() {
    return (
      <li>
        <Link to={'/' + this.props.song.id}>
          {this.props.song.id}
        </Link>
      </li>
    );
  }
}

export default Item;
