/* const arraysList = [
//Markt
  {
    position: [12.766,0,-7.186,15.824,0,-5.622,9.242,0,7.186,3.291,0,4.155,1.097,0,3.796,-0.366,0,3.682,-2.959,0,3.666,-8.278,0,4.188,-15.792,0,5.915,-15.825,0,-7.186,12.732,0,-7.186,12.766,0,-7.186],
    center: [152672.289,221912.8],
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    indices: [1,5,6,6,7,1,1,4,5,7,8,1,1,3,4,8,10,1,1,2,3,8,9,10,10,0,1]
  },
  {
    position: [0.086,0,-0.051,0.086,0,0.051,-0.087,0,0.051,-0.087,0,-0.051,0.086,0,-0.051,0.086,0,-0.051],
    center: [152686.233,221916.106],
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],
    texcoord: [0,0,0,0,0,0,0,0,0,0,],
    indices: [4,1,2,2,3,4,4,0,1]
  },
  {
    position: [5.604,0,-15.23,13.699,0,-9.551,13.663,0,-9.261,8.425,0,-1.338,15.348,0,2.931,7.179,0,15.231,-7.289,0,5.535,-14.432,0,0.869,-14.469,0,0.724,-13.882,0,0.036,-13.809,0,-0.181,-15.348,0,-1.121,-8.828,0,-11.504,-5.934,0,-10.021,-0.183,0,-6.512,5.568,0,-15.23,5.604,0,-15.23],
    center: [152611.96,221887.047],
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    indices: [9,14,3,3,6,9,9,10,14,14,1,3,3,4,6,6,7,9,10,12,14,14,15,1,1,2,3,4,5,6,7,8,9,10,11,12,12,13,14,15,0,1]
  },
  {
    position: [2.709,0,-16.893,9.715,0,-12.711,5.535,0,-5.704,5.109,0,-4.86,4.993,0,-4.347,5.032,0,-3.613,5.573,0,-2.659,6.077,0,-2.256,6.657,0,-1.999,8.902,0,-1.485,11.147,0,-1.119,13.547,0,-0.898,16.101,0,-0.898,17.959,0,-1.045,17.959,0,16.857,17.882,0,16.894,6.115,0,16.894,-11.418,0,7.319,-11.767,0,7.136,-11.922,0,7.099,-12.038,0,7.172,-14.476,0,5.815,-12.928,0,3.284,-17.96,0,-0.128,-7.78,0,-15.242,-7.509,0,-15.132,-1.007,0,-10.693,0.116,0,-12.784,2.671,0,-16.893,2.709,0,-16.893],
    center: [152528.021,221830.273],
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    indices: [18,6,7,7,8,18,18,26,6,8,9,18,26,5,6,9,10,18,26,28,5,10,11,18,28,4,5,11,12,18,18,19,26,28,3,4,12,15,18,19,22,26,28,2,3,12,13,15,15,17,18,19,20,22,22,24,26,28,1,2,13,14,15,15,16,17,20,21,22,22,23,24,24,25,26,26,27,28,28,0,1]
  },
  {
    position: [-14.463,0,-14.333,-6.583,0,-10.394,-1.345,0,-7.586,6.103,0,-3.237,14.8,0,1.661,21.046,0,5.428,21.046,0,5.702,15.569,0,14.332,15.376,0,14.332,5.718,0,8.75,5.622,0,8.75,3.508,0,12.448,3.316,0,12.414,-21.046,0,-1.49,-14.511,0,-14.333,-14.463,0,-14.333],
    center: [152641.934,221904.085],
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    indices: [10,1,5,5,9,10,10,12,1,1,3,5,5,7,9,12,14,1,1,2,3,3,4,5,5,6,7,7,8,9,10,11,12,12,13,14,14,0,1]
  },
  {
    position: [-6.904,0,-15.586,2.949,0,-9.647,6.532,0,-7.618,15.713,0,-1.347,15.787,0,-1.199,5.113,0,13.556,4.964,0,13.63,-2.426,0,9.351,-2.948,0,9.056,-3.097,0,9.056,-6.755,0,15.474,-6.904,0,15.585,-15.525,0,10.384,-10.487,0,1.567,-15.078,0,-1.716,-15.675,0,-2.158,-15.787,0,-2.343,-6.942,0,-15.586,-6.904,0,-15.586],
    center: [152566.757,221854.666],
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    indices: [8,13,1,1,5,8,8,9,13,13,15,1,1,3,5,5,7,8,9,11,13,15,17,1,1,2,3,3,4,5,5,6,7,9,10,11,11,12,13,13,14,15,15,16,17,17,0,1]
  },
  {
    position: [-7.274,0,-13.547,-0.244,0,-9.201,15.348,0,0.108,15.487,0,0.262,6.612,0,13.547,-6.647,0,4.67,-8.875,0,3.283,-12.772,0,0.57,-15.487,0,-1.218,-7.587,0,-13.239,-7.378,0,-13.547,-7.308,0,-13.547,-7.274,0,-13.547],
    center: [152589.241,221870.52],
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    indices: [5,9,1,1,3,5,5,7,9,9,11,1,1,2,3,3,4,5,5,6,7,7,8,9,9,10,11,11,0,1]
  },
  {
    position: [-2.13,0,-12.745,12.882,0,-2.49,12.941,0,-2.373,2.725,0,12.746,-12.435,0,2.52,-12.941,0,2.11,-2.159,0,-12.745,-2.13,0,-12.745],
    center: [152548.76,221843.153],
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    indices: [2,4,6,6,1,2,2,3,4,4,5,6,6,0,1]
  },
//Frans Oomsplein
  {                                                                                                                                                
    position: [16.803,0,-23.14,16.803,0,-8.65,9.453,0,3.524,4.443,0,12.051,-2.249,0,23.041,-2.395,0,23.14,-2.615,0,23.041,-13.877,0,16.486,-13.914,0,16.388,-11.61,0,12.593,-11.391,0,11.607,-11.464,0,10.917,-11.683,0,10.325,-12.122,0,9.734,-12.927,0,9.192,-16.73,0,7.368,-16.803,0,7.22,-12.817,0,-0.567,-6.527,0,2.39,4.735,0,-16.24,4.626,0,-16.437,0.128,0,-19.986,-4.041,0,-22.105,-7.112,0,-23.091,16.766,0,-23.14,16.803,0,-23.14],
    center: [152471.879,221865.72],                                                                                                                
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],                                                                                                                   
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],                              
    indices: [11,18,19,19,5,11,11,12,18,19,24,5,5,10,11,12,13,18,19,20,24,24,2,5,5,9,10,13,14,18,20,21,24,2,3,5,5,7,9,14,16,18,21,22,24,24,1,2,3,4,5,5,6,7,7,8,9,14,15,16,16,17,18,22,23,24,24,0,1]                                                                                                 
  },                                                                                                                                               
  {                                                                                                                                                
    position: [-2.072,0,-17.119,5.517,0,-13.382,5.704,0,-13.141,7.007,0,-12.498,19.719,0,-6.47,20.325,0,-6.108,16.506,0,1.366,16.227,0,1.728,3.05,0,-4.742,2.304,0,-4.943,1.373,0,-4.983,0.535,0,-4.782,-0.21,0,-4.381,-0.815,0,-3.818,-1.327,0,-3.014,-12.736,0,16.355,-13.201,0,17.118,-13.294,0,17.118,-20.325,0,12.939,-10.361,0,-3.577,-10.268,0,-3.617,-10.035,0,-3.496,-9.849,0,-3.898,-10.081,0,-4.059,-8.172,0,-7.435,-7.939,0,-7.394,-7.8,0,-7.716,-7.939,0,-7.836,-7.241,0,-9.042,-5.285,0,-12.257,-5.006,0,-12.257,-4.913,0,-12.578,-5.053,0,-12.659,-2.352,0,-17.119,-2.212,0,-17.039,-2.119,0,-17.119,-2.072,0,-17.119],
    center: [152505.027,221860.192],                                                                                                               
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],                                                 
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,],                                                                                                                                   
    indices: [11,12,31,31,10,11,12,13,31,31,4,10,13,30,31,31,32,4,13,21,30,32,3,4,4,9,10,13,14,21,21,25,30,32,2,3,4,8,9,14,17,21,21,22,25,25,26,30,  32,35,2,4,6,8,14,15,17,17,19,21,22,23,25,26,28,30,32,34,35,35,1,2,4,5,6,6,7,8,15,16,17,17,18,19,19,20,21,23,24,25,26,27,28,28,29,30,32,33,34,35,0,1]
  },
//Hooghuisstraat
  {                                                                                                                                                
    position: [-19.381,0,-11.724,-14.25,0,-9.402,-12.624,0,-8.822,-7.087,0,-6.442,-1.042,0,-3.656,5.258,0,-0.928,10.947,0,1.655,15.367,0,-3.511,15.469,0,-3.482,22.632,0,2.67,14.757,0,11.725,11.862,0,10.274,-10.186,0,0.755,-22.632,0,-4.788,-19.432,0,-11.724,-19.381,0,-11.724],                
    center: [152497.634,221996.135],                                                                                                               
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],                              
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],                                                                      
    indices: [6,12,1,1,4,6,6,9,12,1,2,4,6,7,9,9,11,12,12,14,1,2,3,4,4,5,6,7,8,9,9,10,11,12,13,14,14,0,1]                                           
  },                                                                                                                                               
  {                                                                                                                                                
    position: [1.343,0,-14.173,10.981,0,-8.414,11.011,0,-8.35,10.892,0,-8.158,6.386,0,-1.44,6.147,0,-0.992,13.07,0,2.079,9.848,0,9.021,2.566,0,5.79,0.925,0,7.774,-3.223,0,13.98,-3.342,0,14.14,-3.461,0,14.172,-13.07,0,8.061,-9.907,0,2.911,-7.997,0,0.351,-7.012,0,-1.12,-3.252,0,-7.135,1.313,0,-14.173,1.343,0,-14.173],                                                                                                                        
    center: [152530.2,222009.976],                                                                                                                 
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],      
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],                                                      
    indices: [18,5,9,9,16,18,18,4,5,5,8,9,9,13,16,18,2,4,5,6,8,9,11,13,13,15,16,18,1,2,2,3,4,6,7,8,9,10,11,11,12,13,13,14,15,16,17,18,18,0,1]      
  },                                                                                                                                               
  {                                                                                                                                                
    position: [6.06,0,-18.884,14.677,0,-14.109,14.747,0,-13.978,8.091,0,-3.734,6.69,0,-1.39,0.84,0,7.77,-4.309,0,15.453,-4.344,0,15.714,-4.064,0,16.929,-4.239,0,17.32,-5.114,0,18.579,-6.586,0,18.883,-14.747,0,13.196,-14.747,0,13.022,-14.047,0,11.937,-3.293,0,-4.341,2.382,0,-13.327,6.025,0,-18.884,6.06,0,-18.884],                                                                                                                           
    center: [152591.586,221915.458],                                                                                                               
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],            
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],                                                          
    indices: [6,7,15,15,3,6,7,11,15,15,1,3,3,4,6,7,9,11,11,13,15,15,17,1,1,2,3,4,5,6,7,8,9,9,10,11,11,12,13,13,14,15,15,16,17,17,0,1]              
  }, {
    position: [4.606,0,-15.068,13.581,0,-9.42,13.513,0,-9.217,8.704,0,-1.742,9.618,0,-1.167,15.037,0,1.809,15.071,0,1.945,9.585,0,11.618,2.235,0,7.83,-2.371,0,15.068,-11.108,0,10.231,-11.142,0,10.164,-10.939,0,9.825,-6.74,0,3.297,-14.732,0,-0.829,-15.071,0,-1.066,-10.228,0,-12.092,-1.998,0,-  7.56,0.237,0,-8.101,4.572,0,-15.068,4.606,0,-15.068],                                                                                            
    center: [152574.426,221944.591],                                                                                                               
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],                                                                                                                                                  
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],                                                  
    indices: [3,8,13,13,18,3,3,4,8,8,9,13,13,15,18,18,1,3,4,6,8,9,11,13,15,17,18,18,19,1,1,2,3,4,5,6,6,7,8,9,10,11,11,12,13,13,14,15,15,16,17,19,0,1]                                                                                                                                               
  }, {
    position: [8.518,0,-23.883,18.09,0,-17.85,18.046,0,-17.74,8.913,0,-4.4,7.684,0,-2.297,-2.898,0,14.419,-3.601,0,15.305,-9.045,0,23.884,-18.091,0,18.238,-13.963,0,11.541,-9.836,0,5.231,-5.445,0,-1.743,-3.689,0,-4.732,1.58,0,-12.924,7.42,0,-22.389,8.298,0,-23.773,8.474,0,-23.883,8.518,0,-23.883],                                                                                                                                           
    center: [152551.707,221977.923],                                                                                                               
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,],                  
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],                                                              
    indices: [13,14,6,6,11,13,14,3,6,6,10,11,14,1,3,3,4,6,6,8,10,14,16,1,1,2,3,4,5,6,6,7,8,8,9,10,11,12,13,14,15,16,16,0,1]                        
  },                                                                                                                                               
  {                                                                                                                                                
    position: [35.79,0,-66.25,45.081,0,-59.409,45.081,0,-58.815,7.602,0,-1.413,-17.208,0,38.441,-21.009,0,44.39,-25.654,0,50.784,-30.933,0,58.963,-30.933,0,59.558,-35.367,0,66.101,-35.79,0,66.25,-36.634,0,65.804,-45.08,0,60.748,-44.975,0,60.004,-32.411,0,39.185,-22.065,0,22.678,-16.892,0,14.945,-10.874,0,4.982,-9.079,0,3.049,1.584,0,-13.904,16.787,0,-37.252,18.582,0,-39.631,21.115,0,-43.944,35.685,0,-66.25,35.79,0,-66.25],           
    center: [152483.504,222084.788],                                                                                                               
    normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,
  1,0,0,1,0,0,1,0,0,1,0,],                                                                                                                         
    texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],                                  
    indices: [3,7,14,14,21,3,3,6,7,7,10,14,14,18,21,21,1,3,3,4,6,7,8,10,10,12,14,14,16,18,18,19,21,21,23,1,1,2,3,4,5,6,8,9,10,10,11,12,12,13,14,14,
  15,16,16,17,18,19,20,21,21,22,23,23,0,1]                                                                                                         
  },                                                                                                                                                                                                                                                                                              
//Kerkstraat

];*/

const arraysList = [
// Markt
{
  position: [5.604,0,-15.23,13.699,0,-9.551,13.663,0,-9.261,8.425,0,-1.338,15.348,0,2.931,7.179,0,15.231,-7.289,0,5.535,-14.432,0,0.869,-14.469,0,0.724,-13.882,0,0.036,-13.809,0,-0.181,-15.348,0,-1.121,-8.828,0,-11.504,-5.934,0,-10.021,-0.183,0,-6.512,5.568,0,-15.23,5.604,0,-15.23],
  center: [152611.96,221887.047],
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  indices: [1,0,15,14,13,12,12,11,10,9,8,7,6,5,4,3,2,1,1,15,14,14,12,10,9,7,6,6,4,3,3,1,14,14,10,9,9,6,3,3,14,9]
}, {                                                                                                                                             
  position: [12.766,0,-7.186,15.824,0,-5.622,9.242,0,7.186,3.291,0,4.155,1.097,0,3.796,-0.366,0,3.682,-2.959,0,3.666,-8.278,0,4.188,-15.792,0,5.915,-15.825,0,-7.186,12.732,0,-7.186,12.766,0,-7.186],                                                                                            
  center: [152672.289,221912.8],                                                                                                                 
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],                                                       
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],                                                                                       
  indices: [1,0,10,10,9,8,3,2,1,1,10,8,4,3,1,1,8,7,5,4,1,1,7,6,6,5,1]                                                                            
}, {                                                                                                                                             
  position: [-14.463,0,-14.333,-6.583,0,-10.394,-1.345,0,-7.586,6.103,0,-3.237,14.8,0,1.661,21.046,0,5.428,21.046,0,5.702,15.569,0,14.332,15.376,0,14.332,5.718,0,8.75,5.622,0,8.75,3.508,0,12.448,3.316,0,12.414,-21.046,0,-1.49,-14.511,0,-14.333,-14.463,0,-14.333],                           
  center: [152641.934,221904.085],                                                                                                               
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],                               
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],                                                                       
  indices: [1,0,14,14,13,12,12,11,10,9,8,7,7,6,5,5,4,3,3,2,1,1,14,12,9,7,5,5,3,1,1,12,10,10,9,5,5,1,10]                                          
}, {                                                                                                                                             
  position: [2.709,0,-16.893,9.715,0,-12.711,5.535,0,-5.704,5.109,0,-4.86,4.993,0,-4.347,5.032,0,-3.613,5.573,0,-2.659,6.077,0,-2.256,6.657,0,-1.999,8.902,0,-1.485,11.147,0,-1.119,13.547,0,-0.898,16.101,0,-0.898,17.959,0,-1.045,17.959,0,16.857,17.882,0,16.894,6.115,0,16.894,-11.418,0,7.319,-11.767,0,7.136,-11.922,0,7.099,-12.038,0,7.172,-14.476,0,5.815,-12.928,0,3.284,-17.96,0,-0.128,-7.78,0,-15.242,-7.509,0,-15.132,-1.007,0,-10.693,0.116,0,-12.784,2.671,0,-16.893,2.709,0,-16.893],                                                                                              
  center: [152528.021,221830.273],                                                                                                               
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],                                                                                            
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],               
  indices: [1,0,28,28,27,26,26,25,24,24,23,22,22,21,20,17,16,15,15,14,13,2,1,28,26,24,22,22,20,19,18,17,15,15,13,12,3,2,28,26,22,19,18,15,12,4,3,28,26,19,18,18,12,11,5,4,28,18,11,10,5,28,26,18,10,9,6,5,26,18,9,8,6,26,18,18,8,7,7,6,18]                                                        
}, {                                                                                                                                             
  position: [0.086,0,-0.051,0.086,0,0.051,-0.087,0,0.051,-0.087,0,-0.051,0.086,0,-0.051,0.086,0,-0.051],                                         
  center: [152686.233,221916.106],                                                                                                               
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],                                                                                           
  texcoord: [0,0,0,0,0,0,0,0,0,0],                                                                                                               
  indices: [1,0,4,4,3,2,2,1,4]                                                                                                                   
}, {                                                                                                                                             
  position: [-6.904,0,-15.586,2.949,0,-9.647,6.532,0,-7.618,15.713,0,-1.347,15.787,0,-1.199,5.113,0,13.556,4.964,0,13.63,-2.426,0,9.351,-2.948,0,9.056,-3.097,0,9.056,-6.755,0,15.474,-6.904,0,15.585,-15.525,0,10.384,-10.487,0,1.567,-15.078,0,-1.716,-15.675,0,-2.158,-15.787,0,-2.343,-6.942,0,-15.586,-6.904,0,-15.586],                                                                                                                      
  center: [152566.757,221854.666],                                                                                                               
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],             
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],                                                           
  indices: [1,0,17,17,16,15,15,14,13,13,12,11,11,10,9,7,6,5,5,4,3,3,2,1,1,17,15,13,11,9,8,7,5,5,3,1,1,15,13,13,9,8,8,5,1,1,13,8]                 
}, {                                                                                                                                             
  position: [-7.274,0,-13.547,-0.244,0,-9.201,15.348,0,0.108,15.487,0,0.262,6.612,0,13.547,-6.647,0,4.67,-8.875,0,3.283,-12.772,0,0.57,-15.487,0,-1.218,-7.587,0,-13.239,-7.378,0,-13.547,-7.308,0,-13.547,-7.274,0,-13.547],                                                                     
  center: [152589.241,221870.52],                                                                                                                
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],                                                 
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],                                                                                   
  indices: [1,0,11,11,10,9,9,8,7,7,6,5,5,4,3,3,2,1,1,11,9,9,7,5,5,3,1,1,9,5]                                                                     
}, {                                                                                                                                             
  position: [-2.13,0,-12.745,12.882,0,-2.49,12.941,0,-2.373,2.725,0,12.746,-12.435,0,2.52,-12.941,0,2.11,-2.159,0,-12.745,-2.13,0,-12.745],      
  center: [152548.76,221843.153],                                                                                                                
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],                                                                               
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0],                                                                                                       
  indices: [1,0,6,6,5,4,4,3,2,2,1,6,6,4,2]                                                                                                       
}, 
// Frans Oomsplein
{
  position: [16.803,0,-23.14,16.803,0,-8.65,9.453,0,3.524,4.443,0,12.051,-2.249,0,23.041,-2.395,0,23.14,-2.615,0,23.041,-13.877,0,16.486,-13.914,0,16.388,-11.61,0,12.593,-11.391,0,11.607,-11.464,0,10.917,-11.683,0,10.325,-12.122,0,9.734,-12.927,0,9.192,-16.73,0,7.368,-16.803,0,7.22,-12.817,0,-0.567,-6.527,0,2.39,4.735,0,-16.24,4.626,0,-16.437,0.128,0,-19.986,-4.041,0,-22.105,-7.112,0,-23.091,16.766,0,-23.14,16.803,0,-23.14],
  center: [152471.879,221865.72],
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  indices: [1,0,24,24,23,22,18,17,16,16,15,14,9,8,7,7,6,5,5,4,3,2,1,24,24,22,21,18,16,14,9,7,5,5,3,2,24,21,20,18,14,13,10,9,5,5,2,24,24,20,19,18,13,12,11,10,5,5,24,19,18,12,11,11,5,19,19,18,11]
}, {
  position: [-2.072,0,-17.119,5.517,0,-13.382,5.704,0,-13.141,7.007,0,-12.498,19.719,0,-6.47,20.325,0,-6.108,16.506,0,1.366,16.227,0,1.728,3.05,0,-4.742,2.304,0,-4.943,1.373,0,-4.983,0.535,0,-4.782,-0.21,0,-4.381,-0.815,0,-3.818,-1.327,0,-3.014,-12.736,0,16.355,-13.201,0,17.118,-13.294,0,17.118,-20.325,0,12.939,-10.361,0,-3.577,-10.268,0,-3.617,-10.035,0,-3.496,-9.849,0,-3.898,-10.081,0,-4.059,-8.172,0,-7.435,-7.939,0,-7.394,-7.8,0,-7.716,-7.939,0,-7.836,-7.241,0,-9.042,-5.285,0,-12.257,-5.006,0,-12.257,-4.913,0,-12.578,-5.053,0,-12.659,-2.352,0,-17.119,-2.212,0,-17.039,-2.119,0,-17.119,-2.072,0,-17.119],
  center: [152505.027,221860.192],
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  indices: [1,0,35,34,33,32,30,29,28,28,27,26,25,24,23,21,20,19,19,18,17,17,16,15,8,7,6,6,5,4,2,1,35,35,34,32,30,28,26,25,23,22,21,19,17,17,15,14,8,6,4,2,35,32,30,26,25,25,22,21,21,17,14,9,8,4,3,2,32,30,25,21,21,14,13,10,9,4,4,3,32,30,21,13,4,32,31,31,30,13,10,4,31,31,13,12,11,10,31,31,12,11]
},
// Lombaartstraat
{                                                                                                                                               
  position: [62.051,0,-159.509,69.757,0,-154.638,34.919,0,-94.801,31.226,0,-89.234,14.208,0,-36.703,11.158,0,-25.222,9.392,0,-20.7,2.97,0,0.87,1.044,0,5.74,-11.96,0,46.443,-15.974,0,59.315,-15.974,0,60.707,-18.864,0,68.013,-25.286,0,89.582,-26.088,0,90.974,-30.584,0,104.889,-46.959,0,157.073,-54.665,0,153.246,-56.11,0,159.508,-56.752,0,159.508,-69.596,0,152.55,-69.757,0,147.68,-69.435,0,147.332,-62.05,0,151.507,-60.124,0,151.507,-54.986,0,148.724,-54.184,0,147.332,-44.069,0,114.978,-41.18,0,106.977,-38.29,0,97.584,-36.845,0,91.321,-31.065,0,74.971,-26.891,0,60.359,-25.286,0,56.88,-11.479,0,12.35,-7.305,0,0.174,-2.488,0,-15.829,-2.328,0,-17.917,-1.204,0,-22.091,22.236,0,-94.801,24.323,0,-98.28,25.607,0,-97.236,60.766,0,-158.813,61.89,0,-159.509,62.051,0,-159.509],                                                                                                 
  center: [152643.557,221684.286],                                                                                                               
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],  
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],                                                                                                    
  indices: [1,0,43,43,42,41,41,40,39,39,38,37,35,34,33,33,32,31,31,30,29,28,27,26,23,22,21,21,20,19,19,18,17,17,16,15,14,13,12,12,11,10,8,7,6,6,5,4,3,2,1,1,43,41,41,39,37,31,29,28,23,21,19,17,15,14,12,10,9,9,8,6,3,1,41,41,37,36,33,31,28,24,23,19,17,14,12,12,9,6,4,3,41,41,36,35,25,24,19,17,12,6,6,4,41,41,35,33,26,25,19,17,6,41,41,33,28,28,26,19,19,17,41,41,28,19]                                                                       
}, {                                                                                                                                             
  position: [7.637,0,-9.182,7.637,0,4.02,7.606,0,4.039,5.144,0,2.619,5.113,0,2.638,1.405,0,9.105,1.326,0,9.181,-7.337,0,4.001,-2.319,0,-4.807,-3.534,0,-5.728,-7.636,0,-8.683,-7.337,0,-9.163,7.621,0,-9.182,7.637,0,-9.182],                                                                     
  center: [152574.965,221848.248],                                                                                                               
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],                                           
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],                                                                               
  indices: [1,0,12,12,11,10,8,7,6,6,5,4,3,2,1,12,10,9,8,6,4,3,1,12,12,9,8,8,4,3,3,12,8]                                                          
},
// Hooghuisstraat
{                                                                                                                                               
  position: [4.606,0,-15.068,13.581,0,-9.42,13.513,0,-9.217,8.704,0,-1.742,9.618,0,-1.167,15.037,0,1.809,15.071,0,1.945,9.585,0,11.618,2.235,0,7.83,-2.371,0,15.068,-11.108,0,10.231,-11.142,0,10.164,-10.939,0,9.825,-6.74,0,3.297,-14.732,0,-0.829,-15.071,0,-1.066,-10.228,0,-12.092,-1.998,0,-7.56,0.237,0,-8.101,4.572,0,-15.068,4.606,0,-15.068],                                                                                            
  center: [152574.426,221944.591],                                                                                                               
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0], 
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],                                                   
  indices: [1,0,19,17,16,15,15,14,13,13,12,11,11,10,9,8,7,6,6,5,4,3,2,1,1,19,18,18,17,15,13,11,9,8,6,4,3,1,18,18,15,13,13,9,8,8,4,3,3,18,13,13,8,3]                                                                                                                                               
}, {                                                                                                                                             
  position: [35.79,0,-66.25,45.081,0,-59.409,45.081,0,-58.815,7.602,0,-1.413,-17.208,0,38.441,-21.009,0,44.39,-25.654,0,50.784,-30.933,0,58.963,-30.933,0,59.558,-35.367,0,66.101,-35.79,0,66.25,-36.634,0,65.804,-45.08,0,60.748,-44.975,0,60.004,-32.411,0,39.185,-22.065,0,22.678,-16.892,0,14.945,-10.874,0,4.982,-9.079,0,3.049,1.584,0,-13.904,16.787,0,-37.252,18.582,0,-39.631,21.115,0,-43.944,35.685,0,-66.25,35.79,0,-66.25],           
  center: [152483.504,222084.788],                                                                                                               
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],                                                                                                                          
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],                                   
  indices: [1,0,23,23,22,21,21,20,19,18,17,16,16,15,14,14,13,12,12,11,10,10,9,8,6,5,4,3,2,1,1,23,21,21,19,18,18,16,14,14,12,10,10,8,7,6,4,3,3,1,21,21,18,14,14,10,7,7,6,3,3,21,14,14,7,3]                                                                                                         
}, {                                                                                                                                             
  position: [1.343,0,-14.173,10.981,0,-8.414,11.011,0,-8.35,10.892,0,-8.158,6.386,0,-1.44,6.147,0,-0.992,13.07,0,2.079,9.848,0,9.021,2.566,0,5.79,.925,0,7.774,-3.223,0,13.98,-3.342,0,14.14,-3.461,0,14.172,-13.07,0,8.061,-9.907,0,2.911,-7.997,0,0.351,-7.012,0,-1.12,-3.252,0,-7.135,1.313,0,-14.173,1.343,0,-14.173],                                                                                                                        
  center: [152530.2,222009.976],                                                                                                                 
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],       
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],                                                       
  indices: [1,0,18,18,17,16,15,14,13,13,12,11,11,10,9,8,7,6,4,3,2,2,1,18,16,15,13,13,11,9,8,6,5,4,2,18,16,13,9,9,8,5,5,4,18,18,16,9,9,5,18]      
}, {                                                                                                                                             
  position: [-19.381,0,-11.724,-14.25,0,-9.402,-12.624,0,-8.822,-7.087,0,-6.442,-1.042,0,-3.656,5.258,0,-0.928,10.947,0,1.655,15.367,0,-3.511,15.469,0,-3.482,22.632,0,2.67,14.757,0,11.725,11.862,0,10.274,-10.186,0,0.755,-22.632,0,-4.788,-19.432,0,-11.724,-19.381,0,-11.724],                
  center: [152497.634,221996.135],                                                                                                               
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],                               
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],                                                                       
  indices: [1,0,14,14,13,12,11,10,9,9,8,7,6,5,4,4,3,2,1,14,12,12,11,9,9,7,6,4,2,1,12,9,6,6,4,1,1,12,6]                                           
}, {                                                                                                                                             
  position: [6.06,0,-18.884,14.677,0,-14.109,14.747,0,-13.978,8.091,0,-3.734,6.69,0,-1.39,0.84,0,7.77,-4.309,0,15.453,-4.344,0,15.714,-4.064,0,16.929,-4.239,0,17.32,-5.114,0,18.579,-6.586,0,18.883,-14.747,0,13.196,-14.747,0,13.022,-14.047,0,11.937,-3.293,0,-4.341,2.382,0,-13.327,6.025,0,-18.884,6.06,0,-18.884],                                                                                                                           
  center: [152591.586,221915.458],                                                                                                               
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],             
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],                                                           
  indices: [1,0,17,17,16,15,15,14,13,13,12,11,11,10,9,9,8,7,6,5,4,3,2,1,1,17,15,15,13,11,11,9,7,6,4,3,3,1,15,15,11,7,6,3,15,15,7,6]              
}, {                                                                                                                                             
  position: [8.518,0,-23.883,18.09,0,-17.85,18.046,0,-17.74,8.913,0,-4.4,7.684,0,-2.297,-2.898,0,14.419,-3.601,0,15.305,-9.045,0,23.884,-18.091,0,18.238,-13.963,0,11.541,-9.836,0,5.231,-5.445,0,-1.743,-3.689,0,-4.732,1.58,0,-12.924,7.42,0,-22.389,8.298,0,-23.773,8.474,0,-23.883,8.518,0,-23.883],                                                                                                                                           
  center: [152551.707,221977.923],                                                                                                               
  normal: [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],                   
  texcoord: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],                                                               
  indices: [1,0,16,16,15,14,13,12,11,10,9,8,8,7,6,6,5,4,3,2,1,1,16,14,10,8,6,6,4,3,3,1,14,11,10,6,6,3,14,13,11,6,6,14,13]                        
}];
