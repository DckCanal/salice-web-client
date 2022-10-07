import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FilterListIcon from "@mui/icons-material/FilterList";
import visuallyHidden from "@mui/utils/visuallyHidden";
import PatientDetail from "./PatientDetail";

/*
  EnhancedTable. Field to show:
    - nome cognome
    - ultimaModifica
    - lastYear invoice amount
    - email (mailto link)
    - telefono (WhatsApp link)
    - prezzo

  Can be ordered by:
    - cognome
    - ultimaModifica
    - lastYear invoice amount
    - prezzo
*/

// TODO: style links
// TODO: correct whatsapp link

function createData(
  id,
  nome,
  cognome,
  ultimaModifica,
  email,
  telefono,
  prezzo,
  fatturatoUltimoAnno
) {
  return {
    id,
    nome,
    cognome,
    ultimaModifica,
    email,
    telefono,
    prezzo,
    fatturatoUltimoAnno,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "id",
    hidden: true,
  },
  {
    id: "cognome",
    numeric: false,
    disablePadding: false,
    label: "Cognome",
  },
  {
    id: "nome",
    numeric: false,
    disablePadding: false,
    label: "Nome",
  },
  {
    id: "ultimaModifica",
    numeric: false,
    disablePadding: false,
    label: "Ultima modifica",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "e-mail",
  },
  {
    id: "telefono",
    numeric: false,
    disablePadding: false,
    label: "Telefono",
  },
  {
    id: "prezzo",
    numeric: true,
    disablePadding: false,
    label: "Prezzo standard",
  },
  {
    id: "fatturatoUltimoAnno",
    numeric: true,
    disablePadding: false,
    label: "Fatturato",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) =>
          !headCell.hidden ? (
            <TableCell
              key={headCell.id}
              align={"left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ) : null
        )}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const EnhancedTableToolbar = (props) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Pazienti
      </Typography>

      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {};

// TODO: add handleDeletePatients = async () => {...}
export default function PatientList({
  invoices,
  patients,
  dataManager,
  openPatientDetail,
}) {
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("ultimaModifica");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const rows = patients.map((p) => {
    return createData(
      p._id,
      p.nome,
      p.cognome,
      p.ultimaModifica,
      p.email,
      p.telefono,
      p.prezzo,
      p.fatturatoUltimoAnno
    );
  });
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, id) => {
    // const row = rows.find((r) => r.id == id);
    // console.log(`Selected: ${row.nome} ${row.cognome}`);
    openPatientDetail(id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // TODO: add handleDeletePatients = async () => {...}
  const handleDeletePatients = async () => {
    console.log("Work in progress...");
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ m: 2, p: 2 }}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      tabIndex={-1}
                      key={row.id}
                    >
                      {
                        // TODO: add buttons to download docx
                      }
                      <TableCell align="left">
                        {row.cognome ? row.cognome : "---"}
                      </TableCell>
                      <TableCell align="left">
                        {row.nome ? row.nome : "---"}
                      </TableCell>
                      <TableCell align="left">
                        {new Date(
                          row.ultimaModifica ? row.ultimaModifica : "---"
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell align="left">
                        {row.email ? (
                          <a href={`mailto:${row.email}`}>{row.email}</a>
                        ) : (
                          "---"
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {row.telefono ? (
                          <a href={`https://wa.me/${row.telefono}`}>
                            {row.telefono}
                          </a>
                        ) : (
                          "---"
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {row.prezzo ? row.prezzo : "---"}
                      </TableCell>
                      <TableCell align="left">
                        {row.fatturatoUltimoAnno}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
