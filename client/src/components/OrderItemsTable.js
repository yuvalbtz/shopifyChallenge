import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import gql from 'graphql-tag'
import {useQuery} from '@apollo/react-hooks'
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

const columns = [
  { id: 'id', label: 'id' },
 
  { id: 'lineItemTitle', label: 'Line Item Title',align: 'center'},
  
  {id: 'price',label: 'Price',align: 'center',
  format: (value) => value.toFixed(2)+'₪',
   
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
 },
  container: {
    minHeight: '83vh',
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [rows, setRows] = React.useState([])
  const params = useParams()

  const {loading}= useQuery(GET_ORDERItems,{
       variables:{
          orderId:Number(params.orderNumber)
       },
       onCompleted:(data) => setRows(data.getOrderItems),
       onError:(err) => console.log(err),  
   })
  
   
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          {loading && (<CircularProgress size={60} style={{position:'absolute', left:'50%', bottom:'50%'}}/>)}
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <>
               <TableRow  hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}


const GET_ORDERItems = gql`

query getOrderItems($orderId:Float!){
        getOrderItems(orderId:$orderId){
            lineItemTitle
            id
            ShopifyOrderNumber
            price
        }
      
    }



`;