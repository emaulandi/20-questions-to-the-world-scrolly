// for watch and hot reload
require('../index.html')
import './style/base.scss';
import './style/story-layout.scss';

import logoImg from './img/logo.png';

let logo = document.getElementById('logo');
logo.src = logoImg;

const arr = [1, 2, 3];
console.log(arr);
console.log(...arr);

var materials = [
  'Hydrogen',
  'Helium',
  'Lithium',
  'Beryllium'
];

console.log(materials.map(material => material.length));
