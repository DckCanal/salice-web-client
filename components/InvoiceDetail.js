"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { mutate } from "swr";
// import { useState } from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import { CircularProgress, TextField } from "@mui/material";

import StyledPaper from "./StyledPaper";
import { italianMonth } from "../lib/dateUtils";
import excelInvoice from "../lib/excelLib";
import { deleteInvoice } from "../lib/controller";
import { useInvoice, usePatient } from "../lib/hooks";
import ErrorBox from "./ErrorBox";

const TextLine = ({ children, width }) => {
  const w = width ? width : "auto";
  return (
    <Box sx={{ m: 1, w }}>
      <Typography variant="body1">{children}</Typography>
    </Box>
  );
};

const PaperContainer = ({ children }) => (
  <StyledPaper
    sx={{
      mt: { xs: 2, md: 4 },
      p: 4,
      mx: "auto",
      maxWidth: "700px",
      width: { xs: "100%", sm: "96%" },
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    {children}
  </StyledPaper>
);

// TODO: manage undefined patient while loading
export default function InvoiceDetail({ id }) {
  const router = useRouter();
  const {
    invoice,
    isLoading: isLoadingInvoice,
    error: invoiceError,
  } = useInvoice(id);
  const {
    patient,
    isLoading: isLoadingPatient,
    error: patientError,
  } = usePatient(invoice?.paziente);

  if (invoiceError) {
    console.log("Invoice error: ", invoiceError);
    return (
      <PaperContainer>
        <ErrorBox
          title="Errore nel caricamento della fattura"
          text={invoiceError?.message}
        />
      </PaperContainer>
    );
  }
  if (patientError) {
    console.log("Patient error: ", patientError);
    return (
      <PaperContainer>
        <ErrorBox
          title="Errore nel caricamento del paziente"
          text={patientError?.message}
        />
      </PaperContainer>
    );
  }

  if (
    //isLoadingInvoice ||
    //isLoadingPatient ||
    invoice === undefined ||
    patient === undefined
  )
    return (
      <PaperContainer>
        <CircularProgress sx={{ mx: "auto" }} />
      </PaperContainer>
    );

  const date = new Date(invoice.dataEmissione);
  const cashed = invoice.incassata; //invoice.dataIncasso !== undefined;
  return (
    <PaperContainer>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="h5">
          Fattura N. {invoice.numeroOrdine} del{" "}
          {`${date.getDate()} ${italianMonth(
            date.getMonth()
          ).toLowerCase()} ${date.getFullYear()}`}
        </Typography>
        <Box sx={{ mt: { xs: 2, md: 0 } }}>
          <IconButton
            onClick={() => {
              excelInvoice(patient, invoice);
            }}
          >
            <DownloadIcon />
          </IconButton>
          <Link href={`/invoices/update/${invoice._id}`} passHref>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton
            onClick={async (ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              await mutate("/api/invoices", deleteInvoice(invoice._id), {
                revalidate: false,
                populateCache: (_res, cacheData) => {
                  return {
                    ...cacheData,
                    data: {
                      ...cacheData.data,
                      invoices: cacheData.data.invoices.filter(
                        (i) => String(i._id) !== String(invoice._id)
                      ),
                    },
                  };
                },
              });
              router.push(`/patients/${patient._id}`);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          mt: 2,
          mx: { xs: 0, md: 2 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            mt: 1,
            width: { xs: "100%", md: "33%" },
            display: { xs: "none", md: "block" },
          }}
        >
          <Typography variant="button" sx={{ m: 2 }}>
            Intestatario
          </Typography>
        </Box>
        <Box sx={{ width: { xs: "100%", md: "66%" } }}>
          <Link href={`/patients/${patient._id}`} passHref>
            {" "}
            <Button variant="text">
              {patient.cognome} {patient.nome}
            </Button>
          </Link>
          <Divider />
          <Box sx={{ p: { xs: 2, md: 0 } }}>
            {patient.codiceFiscale && (
              // <TextLine>{patient.codiceFiscale}</TextLine>
              // <TextField
              //   disabled
              //   size="small"
              //   InputProps={{
              //     readOnly: true,
              //     endAdornment: (
              //       <InputAdornment position="end">
              //         <Tooltip title="Copia" arrow>
              //           <IconButton
              //             onClick={() =>
              //               navigator.clipboard.writeText(patient.codiceFiscale)
              //             }
              //           >
              //             <ContentCopyIcon />
              //           </IconButton>
              //         </Tooltip>
              //       </InputAdornment>
              //     ),
              //   }}
              //   sx={{ m: 1 }}
              //   defaultValue={patient.codiceFiscale}
              // />
              <Tooltip title="Copia" enterDelay={300} arrow>
                <Chip
                  color="primary"
                  variant="outlined"
                  label={patient.codiceFiscale}
                  onClick={() =>
                    navigator.clipboard.writeText(patient.codiceFiscale)
                  }
                  sx={{ my: 1 }}
                />
              </Tooltip>
            )}
            {patient.partitaIva && <TextLine>patient.partitaIva</TextLine>}
            <TextLine>
              {patient.indirizzoResidenza?.paese && (
                <span>Residente a {patient.indirizzoResidenza.paese} </span>
              )}
              {patient.indirizzoResidenza?.provincia && (
                <span>({patient.indirizzoResidenza.provincia}), </span>
              )}
              {patient.indirizzoResidenza?.cap && (
                <span>{patient.indirizzoResidenza.cap},</span>
              )}
              {patient.indirizzoResidenza?.via && (
                <span>{patient.indirizzoResidenza.via}</span>
              )}
              {patient.indirizzoResidenza?.civico && (
                <span>{patient.indirizzoResidenza.civico}</span>
              )}
            </TextLine>
            {patient.telefono && <TextLine>{patient.telefono}</TextLine>}
            {patient.email && (
              // <>
              //   <Chip
              //     component="a"
              //     variant="filled"
              //     label={`${patient.email}`}
              //     href={`mailto:${patient.email}`}
              //     clickable
              //     sx={{ mb: 1 }}
              //   />
              //   <Tooltip title="Copia" arrow>
              //     <IconButton
              //       sx={{ m: 1 }}
              //       onClick={() => navigator.clipboard.writeText(patient.email)}
              //     >
              //       <ContentCopyIcon />
              //     </IconButton>
              //   </Tooltip>
              // </>
              <Tooltip title="Copia" arrow>
                <Chip
                  //component="a"
                  variant="outlined"
                  color="primary"
                  label={`${patient.email}`}
                  onClick={() => navigator.clipboard.writeText(patient.email)}
                  sx={{ mb: 1 }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          mt: 2,
          mx: { xs: 0, md: 2 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            mt: 1,
            width: { xs: "100%", md: "33%" },
            //p: 2,
            pt: 1,
          }}
        >
          <Typography variant="button">Prestazione eseguita</Typography>
        </Box>
        <Box sx={{ width: { xs: "100%", md: "66%" }, p: 2, pt: 1, mt: 1 }}>
          <Typography>{invoice.testo}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          mt: 2,
          mx: { xs: 0, md: 2 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            mt: 1,
            width: { xs: "100%", md: "33%" },
            //p: 2,
            pt: 1,
          }}
        >
          <Typography variant="button">Valore</Typography>
        </Box>
        <Box sx={{ width: { xs: "100%", md: "66%" }, p: 2, pt: 1, mt: 1 }}>
          <Typography>{invoice.valore}€</Typography>
          {invoice.pagamentoTracciabile ? (
            <Typography variant="body2">Pagamento tracciabile</Typography>
          ) : (
            <Typography variant="body2">Pagamento non tracciabile</Typography>
          )}
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
          mb: { xs: 5, sm: 0 },
        }}
      >
        {cashed ? (
          new Date(invoice.dataIncasso).getTime() == date.getTime() ? (
            <Chip
              variant="outlined"
              color="success"
              icon={<DoneIcon fontSize="small" />}
              label="INCASSATA"
            />
          ) : (
            <Chip
              variant="outlined"
              color="success"
              icon={<DoneIcon fontSize="small" />}
              label={`INCASSATA IL ${new Date(
                invoice.dataIncasso
              ).toLocaleDateString()}`}
            />
          )
        ) : (
          <Chip
            variant="outlined"
            color="error"
            icon={<ErrorOutlineIcon fontSize="small" />}
            label="NON INCASSATA"
          />
        )}
      </Box>
    </PaperContainer>
  );
}
