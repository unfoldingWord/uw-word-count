import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { wordCount } from '../../core';

function WordCountBasic({
  format,
  classes,
  children,
  style,
}) {

  console.log("format:",format); // format='xxx' format='string'
  let results = wordCount(children,format);
  if ( ! results.isValidFormat ) {
    return (
      <Typography className={classes.root} style={style} 
        align='center' variant='h6'>
      Invalid format: {format} <br/>
      Valid formats are: {results.validFormats} <br/>
      Default is 'markdown'
      </Typography>
    )
  }
  return (
    <Paper className={classes.paper}>
      <Typography className={classes.root} style={style}>
        Total number of words: {results.total} <br/>
        Distinct number of words: {results.distinct} <br/> 
        Number of Markdown Level 1 Headings: {results.l1count}
      </Typography>
      <Typography className={classes.root} style={style} 
        align='center' variant='h6'>
      List of all the words
      </Typography>
      <div>
        <List dense={true}>
        {results.allWords.map( (w,n) => (
          <ListItem key={n}>
            <ListItemText primary={w} />
          </ListItem>
      ) ) }
      </List>
      </div>
      <Typography className={classes.root} style={style} 
        align='center' variant='h6'>
      Word Frequency Table
      </Typography>

      <Table className={classes.table} 
          size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Word</TableCell>
                <TableCell align="center">Count</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.from(Object.keys(results.wordFrequency))
                .sort().map(skey => (
                <TableRow key={skey}>
                  <TableCell component="th" scope="row">
                      {skey}
                  </TableCell>
                  <TableCell align="center">{results.wordFrequency[skey]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    </Paper>
);
};

WordCountBasic.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** @ignore */
  style: PropTypes.object,
  /** text format: default is Markdown */
  format: PropTypes.string,
};

const styles = theme => ({
  root: {
  },
});

export default withStyles(styles)(WordCountBasic);
