const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  for (let f of allowedFields) {
    if (obj[f]) newObj[f] = obj[f];
  }
  return newObj;
};
module.exports = filterObj;
