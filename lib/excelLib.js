import * as Excel from "exceljs";
import download from "downloadjs";
import { italianMonth } from "./dateUtils";

// TODO: test invoice generation with incomplete patient.indirizzoResidenza data
const createFileStructure = (ws) => {
  ws.mergeCells("A1:F1");
  ws.mergeCells("A2:F2");
  ws.mergeCells("A4:F4");
  ws.mergeCells("A5:C5");
  ws.mergeCells("D5:F5");
  ws.mergeCells("A6:C6");
  ws.mergeCells("D6:F6");
  ws.mergeCells("A16:D18");
  ws.mergeCells("E16:F18");
  ws.mergeCells("A20:D20");
  ws.mergeCells("E20:F20");
  ws.mergeCells("A37:F37");
  ws.mergeCells("A38:F38");
  ws.mergeCells("A39:F39");

  ws.getRow(1).height = 26.25;
  for (let i = 4; i <= 39; i++) {
    ws.getRow(i).height = 12.8;
  }
  ws.getColumn(1).width = 9 + 1;
  ws.getColumn(2).width = 15 + 1;
  ws.getColumn(3).width = 10 + 2;
  ws.getColumn(4).width = 10 + 2;
  ws.getColumn(5).width = 10 + 2;
  ws.getColumn(6).width = 10 + 2;

  ws.getCell("A1").alignment = { horizontal: "center" };
  ws.getCell("A2").alignment = { horizontal: "center" };
  ws.getCell("A4").alignment = { horizontal: "center" };
  ws.getCell("A5").alignment = { horizontal: "center" };
  ws.getCell("A6").alignment = { horizontal: "center" };
  ws.getCell("B10").alignment = { horizontal: "right" };
  ws.getCell("B11").alignment = { horizontal: "right" };
  ws.getCell("D5").alignment = { horizontal: "center" };
  ws.getCell("D6").alignment = { horizontal: "center" };
  ws.getCell("A16").alignment = { horizontal: "center", vertical: "middle" };
  ws.getCell("E16").alignment = { horizontal: "center", vertical: "middle" };
  ws.getCell("A20").alignment = { horizontal: "center" };
  ws.getCell("A37").alignment = { horizontal: "center" };
  ws.getCell("A38").alignment = { horizontal: "center" };
  ws.getCell("A39").alignment = { horizontal: "center" };

  const mainFont = { name: "Arial", size: 10 };
  ws.getCell("A1").font = {
    name: "Arial",
    size: 18,
  };
  ws.getCell("A2").font = {
    name: "Arial",
    size: 13,
    italic: true,
  };
  ws.getCell("A4").font = mainFont;
  ws.getCell("A5").font = mainFont;
  ws.getCell("A6").font = mainFont;
  ws.getCell("D5").font = mainFont;
  ws.getCell("D6").font = mainFont;
  ws.getCell("A10").font = mainFont;
  ws.getCell("A11").font = mainFont;
  ws.getCell("B10").font = mainFont;
  ws.getCell("B11").font = mainFont;
  ws.getCell("D8").font = mainFont;
  ws.getCell("D9").font = mainFont;
  ws.getCell("D10").font = mainFont;
  ws.getCell("D11").font = mainFont;
  ws.getCell("D12").font = mainFont;
  ws.getCell("D13").font = mainFont;
  ws.getCell("A16").font = mainFont;
  ws.getCell("E16").font = mainFont;
  ws.getCell("E20").font = mainFont;
  ws.getCell("A20").font = mainFont;
  ws.getCell("C34").font = mainFont;
  ws.getCell("C35").font = mainFont;
  ws.getCell("C36").font = mainFont;
  ws.getCell("F34").font = mainFont;
  ws.getCell("F35").font = mainFont;
  ws.getCell("F36").font = mainFont;
  ws.getCell("A37").font = {
    name: "Arial",
    size: 8,
  };
  ws.getCell("A38").font = {
    name: "Arial",
    size: 8,
  };
  ws.getCell("A39").font = {
    name: "Arial",
    size: 8,
  };

  ws.getCell("A16").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    right: { style: "hair" },
    bottom: { style: "hair" },
  };
  ws.getCell("E16").border = {
    top: { style: "thin" },
    left: { style: "hair" },
    right: { style: "thin" },
    bottom: { style: "hair" },
  };
  for (let i = 19; i <= 36; i++) {
    for (let j of ["A", "E", "F"]) {
      const style = j === "E" ? "hair" : "thin";
      const size = j === "F" ? "right" : "left";
      const c = ws.getCell(`${j}${i}`);
      if (!c.border) c.border = {};
      c.border[size] = { style };
    }
  }
  ws.getCell("A37").border = {
    left: { style: "thin" },
    right: { style: "thin" },
  };
  ws.getCell("A38").border = {
    left: { style: "thin" },
    right: { style: "thin" },
  };
  ws.getCell("A39").border = {
    left: { style: "thin" },
    right: { style: "thin" },
  };

  for (let i of ["A", "B", "C", "D", "E", "F"]) {
    let c;
    for (let j of [33, 36, 39]) {
      c = ws.getCell(`${i}${j}`);
      const s = j != 39 ? "hair" : "thin";
      if (c.border) c.border.bottom = { style: s };
      else c.border = { bottom: { style: s } };
    }
  }
  ws.getCell("C34").border = { left: { style: "hair" } };
  ws.getCell("C35").border = { left: { style: "hair" } };
  ws.getCell("C36").border.left = { style: "hair" };

  ws.getCell("E20").numFmt = `"€" #,##0.00`;
  ws.getCell("F34").numFmt = `"€" #,##0.00`;
  ws.getCell("F35").numFmt = `"€" #,##0.00`;
  ws.getCell("F36").numFmt = `"€" #,##0.00`;
};

const populateFixedData = (ws) => {
  ws.getCell("A1").value = "MARCO DE CANAL";
  ws.getCell("A2").value = "Massofisioterapista";
  ws.getCell("A4").value =
    "Via Vittorio Veneto 15/A, 47842, San Giovanni in Marignano (RN)";
  ws.getCell("A5").value = "c.f: DCNMRC90L25D142Z";
  ws.getCell("A6").value = "e-mail: marco.decanal@gmail.com";
  ws.getCell("D5").value = "p.i: 04370000400";
  ws.getCell("D6").value = "tel: 3385330241";
  ws.getCell("D8").value = "Spett.le";
  ws.getCell("A10").value = "Fattura N.";
  ws.getCell("A11").value = "del";
  ws.getCell("A16").value = "Prestazioni eseguite";
  ws.getCell("E16").value = "Importo in euro";
  ws.getCell("C34").value = "Totale";
  ws.getCell("C35").value = "Rivalsa Inps 4%";
  ws.getCell("C36").value = "Netto a pagare";
  ws.getCell("A37").value =
    "Operazione senza applicazione dell’Iva ai sensi  Legge 190 del 23/12/2014 art.1 commi da 54 ad 89";
  ws.getCell("A38").value =
    "Operazione effettuata ai sensi art. 1, commi da 54 ad 89 della Legge 190 del 23/12/2014 - Regime forfetario.";
  ws.getCell("A39").value =
    "Il compenso non soggetto a ritenute d’acconto ai sensi della Legge 190 del 23/12/2014 art.1 comma 67";
};

export default async function excelInvoice(patient, invoice) {
  const workbook = new Excel.Workbook();
  const ws = workbook.addWorksheet("Fattura", {
    pageSetup: {
      paperSize: 9,
      printArea: "A1:F39",
      horizontalCentered: true,
    },
  });
  createFileStructure(ws);
  populateFixedData(ws);

  // ---- POPULATING INVOICE ---- //
  ws.getCell("B10").value = invoice.numeroOrdine;
  const date = new Date(invoice.dataEmissione);
  ws.getCell("B11").value = `${date.getDate()} ${italianMonth(
    date.getMonth()
  )} ${date.getFullYear()}`;
  ws.getCell("D9").value = `${patient.nome} ${patient.cognome}`;
  if (patient.indirizzoResidenza?.civico && patient?.indirizzoResidenza.via) {
    ws.getCell(
      "D10"
    ).value = `${patient.indirizzoResidenza.via} N. ${patient.indirizzoResidenza.civico}`;
  }
  if (patient?.indirizzoResidenza.cap) {
    ws.getCell("D11").value = `${patient.indirizzoResidenza.cap}`;
  }
  if (
    patient?.indirizzoResidenza.paese &&
    patient?.indirizzoResidenza.provincia
  ) {
    ws.getCell(
      "D12"
    ).value = `${patient.indirizzoResidenza.paese} (${patient.indirizzoResidenza.provincia})`;
  }
  if (patient.codiceFiscale) {
    ws.getCell("D13").value = `C.F.: ${patient.codiceFiscale}`;
  }
  ws.getCell("E20").value = invoice.valore;
  ws.getCell("A20").value = invoice.testo;
  const value = Number.parseFloat(invoice.valore);
  const inps = (value * 4) / 104;
  ws.getCell("F34").value = value - inps;
  ws.getCell("F35").value = inps;
  ws.getCell("F36").value = value;
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer]);
  const invName = `${invoice.numeroOrdine}-${
    date.getMonth() + 1
  }_${date.getFullYear()} - ${patient.cognome}.xlsx`;
  download(
    blob,
    invName,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}
