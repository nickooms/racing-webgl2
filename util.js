const float3 = x => parseFloat(x.toFixed(3));

const dir = x => console.dir(x, { colors: true, depth: null });

module.exports = { float3, dir };
