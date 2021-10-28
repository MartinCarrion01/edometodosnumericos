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
      return [row.t, row.y1, row.y2, row.y1ex, row.y2ex, row.errY1, row.errY2];
    });
  } else {
    data = rows.map((row) => {
      return [row.t, row.y1, row.y2];
    });
  }
  exportExcel(data, workSheetColumnNames, workSheetName, filePath);
};

const workSheetColumnName1 = ["t", "y1", "y2"];
const workSheetColumnName2 = [
  "t",
  "y1",
  "y2",
  "y1Ex",
  "y2Ex",
  "erry1",
  "erry2",
];

const workSheetName = "Sistema de ecuaciones RK";
const filePath = "./output/sistemark.xlsx";

const multiplicar = (matrix, vector) => {
  let result = [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
  ];
  return result;
};

const rows = [];

const Row = function (t, y1, y2) {
  this.t = t;
  this.y1 = y1;
  this.y2 = y2;
};

const RowEx = function (t, y1, y2, y1Ex, y2Ex, errY1, errY2) {
  this.t = t;
  this.y1 = y1;
  this.y2 = y2;
  this.y1ex = y1Ex;
  this.y2ex = y2Ex;
  this.errY1 = errY1;
  this.errY2 = errY2;
};

//Consideremos el sistema de 2 EDO
// y1'(t) = a*y1(t) + b*y2(t) + g(t)*k(t)
// y2'(t) = c*y1(t) + d*y2(t) + g(t)*l(t)

//Delta t
const deltaT = 0.01;

//Omega
const omega = 0.5;

//Coeficientes a, b , c , d
const a = 0;
const b = 1;
const c = -4;
const d = 0;

//Matriz de coeficientes
const coef = [
  [a, b],
  [c, d],
];

//Valores iniciales
let t = 0;

//Vector de estado inicial
let yVec = [0, 0];

//Funcion g(t)
const g = (t) => math.sin(3 * t);

//Funcion k(t)
const k = (t) => 0;

//Funcion l(t)
const l = (t) => 10;

//Vector independiente
const vecInd = (t) => [g(t) * k(t), g(t) * l(t)];

//Vector auxiliar para calcular vector k1
let kAux1;

//Vector de incrementos k1
let kVector1;

//Valor tg auxiliar
let tg;

//Vector de estado yg auxiliar
let ygVec = [0, 0];

//Vector auxiliar para calcular vector k2
let kAux2;

//Vector de incrementos k2
let kVector2;

//soluciones exactas
const y1Ex = (t) => {
  return (1 / 3) * 1 * Math.exp(-2 * t) + (14 / 3) * 1 * Math.exp(-8 * t);
};
const y2Ex = (t) => {
  return (1 / 3) * 2 * Math.exp(-2 * t) + (14 / 3) * (1 / 2) * Math.exp(-8 * t);
};
const provided = true;

for (let i = 0; i < 5000; i++) {
  if (provided) {
    rows.push(
      new RowEx(
        t,
        yVec[0],
        yVec[1],
        y1Ex(t),
        y2Ex(t),
        Math.abs(y1Ex(t) - yVec[0]),
        Math.abs(y2Ex(t) - yVec[1])
      )
    );
  } else {
    rows.push(new Row(t, yVec[0], yVec[1]));
  }
  kAux1 = multiplicar(coef, yVec);
  for (let s = 0; s < 2; s++) {
    kAux1[s] = kAux1[s] + vecInd(t)[s];
  }
  kVector1 = kAux1.map((element) => element * deltaT);
  tg = t + deltaT / (2 * omega);
  for (let m = 0; m < 2; m++) {
    ygVec[m] = yVec[m] + kVector1[m] / (2 * omega);
  }
  kAux2 = multiplicar(coef, ygVec);
  for (let n = 0; n < 2; n++) {
    kAux2[n] = kAux2[n] + vecInd(t)[n];
  }
  kVector2 = kAux2.map((element) => element * deltaT);
  t = t + deltaT;
  for (let j = 0; j < 2; j++) {
    yVec[j] = yVec[j] + (1 - omega) * kVector1[j] + omega * kVector2[j];
  }
}

if (provided) {
  exportUsersToExcel(rows, workSheetColumnName2, workSheetName, filePath);
} else {
  exportUsersToExcel(rows, workSheetColumnName1, workSheetName, filePath);
}
