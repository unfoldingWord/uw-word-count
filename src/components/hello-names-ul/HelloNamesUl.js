import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { HelloName } from '../../components';

function HelloNamesUl({
  classes,
  names,
  style,
}) {
  const helloNameComponents = names.map(name =>
    <li>
      <HelloName name={name} />
    </li>
  );

  return (
    <ul className={classes.root} style={style}>
      {helloNameComponents}
    </ul>
  );
};

HelloNamesUl.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The names of the people to say hello to. */
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** The overriding CSS for this component */
  style: PropTypes.object,
};

const styles = theme => ({
  root: {
  },
});

export default withStyles(styles)(HelloNamesUl);
