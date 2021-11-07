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

const workSheetName = "EDO rk";
const filePath = "./output/rkedo.xlsx";

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
//Si y(t) aparece elevado a un numero n, ir a la línea 98 y cambiar
//el parametro de Math.pow(y,n) donde n es el exponente al cual esta
//elevado y . Acá en runge-kutta hay que hacer lo mismo para el yg, entonces
//ir a la linea 101 y hacer lo mismo que se indica anteriormente

//DeltaT
const deltaT = 0.08;

//Constante omega usada para runge kutta (euler modificado: w = 1, euler mejorado: w = 1/2)
const omega = 0.5;

//funcion g(t)
const g = (t) => {
  return 0;
};

//coeficiente k multiplicando a y(t), puede ser una funcion
const k = (t) => {
  return -2 * t;
};

//valor t inicial
let t = 0;

//valor y inicial
let y = 1;

//valores t y g auxiliares de runge kutta
let tg, yg;

//valores k1 y k2 para incrementos de y e yg respectivamente
let k1, k2;

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
  k1 = deltaT * (g(t) - k(t) * Math.pow(y, 2));
  tg = t + deltaT / (2 * omega);
  yg = y + k1 / (2 * omega);
  k2 = deltaT * (g(tg) - k(tg) * Math.pow(yg, 2));
  t = t + deltaT;
  y = y + (1 - omega) * k1 + omega * k2;
}

if (provided) {
  exportUsersToExcel(rows, workSheetColumnName2, workSheetName, filePath);
} else {
  exportUsersToExcel(rows, workSheetColumnName1, workSheetName, filePath);
}
