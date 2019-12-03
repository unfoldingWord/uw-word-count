import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
} from '@material-ui/core';

import { HelloName } from '../../components';

function HelloNamesList({
  classes,
  names,
}) {
  const helloNameComponents = names.map(name =>
    <ListItem>
      <HelloName name={name} />
    </ListItem>
  );

  return (
    <List className={classes.root}>
      {helloNameComponents}
    </List>
  );
};

HelloNamesList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The names of the people to say hello to. */
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const styles = theme => ({
  root: {
  },
});

export default withStyles(styles)(HelloNamesList);
