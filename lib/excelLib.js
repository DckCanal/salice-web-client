import * as Excel from "exceljs";
import download from "downloadjs";

// TODO: correct params
// TODO: border
// TODO: export xlsx model creation to a function, leave only specific data compilation
export default async function excelInvoice(patient, value, issueDate) {
  const workbook = new Excel.Workbook();
  const ws = workbook.addWorksheet("Fattura", {
    pageSetup: {
      paperSize: 9,
      printArea: "A1:F39",
    },
  });

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
  ws.getColumn(1).width = 12;
  ws.getColumn(2).width = 17;
  ws.getColumn(3).width = 14;
  ws.getColumn(4).width = 14;
  ws.getColumn(5).width = 14;
  ws.getColumn(6).width = 14;

  ws.getCell("A1").alignment = { horizontal: "center" };
  ws.getCell("A2").alignment = { horizontal: "center" };
  ws.getCell("A4").alignment = { horizontal: "center" };
  ws.getCell("A5").alignment = { horizontal: "center" };
  ws.getCell("A6").alignment = { horizontal: "center" };
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
  ws.getCell("D8").font = mainFont;
  ws.getCell("A16").font = mainFont;
  ws.getCell("E16").font = mainFont;
  ws.getCell("A20").font = mainFont;
  ws.getCell("C34").font = mainFont;
  ws.getCell("C35").font = mainFont;
  ws.getCell("C36").font = mainFont;
  ws.getCell("A37").font = {
    name: "Vrinda",
    size: 8,
  };
  ws.getCell("A38").font = {
    name: "Vrinda",
    size: 8,
  };
  ws.getCell("A39").font = {
    name: "Vrinda",
    size: 8,
  };

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

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer]);
  download(
    blob,
    "Fattura.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}
