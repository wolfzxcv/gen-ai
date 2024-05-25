import { readFileSync, writeFileSync } from 'fs';

const csvData = readFileSync('./FAQ.csv', 'utf8');
const lines = csvData.split('\n');
const filteredData = lines
  .slice(1) // Skip the first line (header)
  .map((line) => line.split(',').slice(0, 2).join(' ').replaceAll('"', ''))
  .join(' '); // Split by comma, select first two elements

const infoData = readFileSync('./info.txt', 'utf8');

const data = {
  infoData,
  filteredData
};

writeFileSync('./data.json', JSON.stringify(data, null, 2), 'utf8');

console.log('data.json created successfully!');
