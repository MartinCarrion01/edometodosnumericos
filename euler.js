const math = require("mathjs");
const xlsx = require("xlsx");
const path = require("path");

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
  const workBook = xlsx.utils.book_new();
  const workSheetData = [workSheetColumnNames, ...data];
  const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
  xlsx.writeFile(workBook, path.resolve(filePath));
};

const exportUsersToExcel = (
  rows,
  workSheetColumnNames,
  workSheetName,
  filePath
) => {
  let data;
  if (provided) {
    data = rows.map((row) => {
      return [row.t, row.y, row.yEx, row.err];
    });
  } else {
    data = rows.map((row) => {
      return [row.t, row.y];
    });
  }
  exportExcel(data, workSheetColumnNames, workSheetName, filePath);
};

const workSheetColumnName1 = ["t", "y"];
const workSheetColumnName2 = ["t", "y", "yEx", "Err abs"];

const workSheetName = "EDO euler";
const filePath = "./output/euleredo.xlsx";

const Row = function (t, y) {
  this.t = t;
  this.y = y;
};

const RowEx = function (t, y, yEx, err) {
  this.t = t;
  this.y = y;
  this.yEx = yEx;
  this.err = err;
};

const rows = [];

//Consideramos la edo diferencial y'(t) + k(t) * y(t)^n = g(t)
//Si y(t) aparece elevado a un numero n, ir a la línea 91 y cambiar 
//el parametro de Math.pow(y,n) donde n es el exponente al cual esta 
//elevado y

//DeltaT
const deltaT = 0.25;

//funcion g(t)
const g = (t) => {
  return -2 * t - 1;
};

//coeficiente k multiplicando a y(t), puede ser una función
const k = (t) => {
  return 2;
};

//valor t inicial
let t = 0;

//valor y inicial
let y = 2;

//k1 usado para el incremento
let k1;

//solucion exacta
const yex = (t) => {
  return Math.exp(2 * t) + t + 1;
};
const provided = false;

for (let i = 0; i < 50; i++) {
  if (provided) {
    rows.push(new RowEx(t, y, yex(t), Math.abs(yex(t) - y)));
  } else {
    rows.push(new Row(t, y));
  }
  k1 = deltaT * (g(t) - k(t) * Math.pow(y, 1));
  t = t + deltaT;
  y = y + k1;
}

if (provided) {
  exportUsersToExcel(rows, workSheetColumnName2, workSheetName, filePath);
} else {
  exportUsersToExcel(rows, workSheetColumnName1, workSheetName, filePath);
}
