import React from 'react';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable from 'material-table';
import { wordCount } from '../../core';
import * as util from '../../core/utilities.js';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

function WordCountBasic({
  format,
  text,
  classes,
  children,
  style,
}) {

  console.log("format:",format); // format='xxx' format='string'
  let results = text ? wordCount(text,format): wordCount(children,format);
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
          let mt = util.wf_to_mt(results.wordFrequency);
  //let aw = util.aw_to_mt(results.allWords);
  return (
    <Paper className={classes.paper}>
      <Typography className={classes.root} style={style}>
        Total number of words: <strong>{results.total}</strong> <br/>
        Distinct number of words: <strong>{results.distinct}</strong> <br/> 
        Number of Markdown Level 1 Headings: <strong>{results.l1count}</strong>
      </Typography>
      <MaterialTable
        icons={tableIcons}
        title={mt.title}
        columns={mt.columns}
        data={mt.data}
        options={mt.options}
      />
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


/* code graveyard

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


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


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


*/