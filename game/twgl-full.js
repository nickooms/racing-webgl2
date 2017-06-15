import primitives from './primitives.js';
import twgl from './twgl.js';
import m4 from './m4.js';
import v3 from './v3.js';

/* define([
    './twgl',
    './m4',
    './v3',
    './primitives',
  ], function(
    twgl,
    m4,
    v3,
    primitives
  ) {

    "use strict";*/

    twgl.m4 = m4;
    twgl.v3 = v3;
    twgl.primitives = primitives;
    export default twgl;
// });