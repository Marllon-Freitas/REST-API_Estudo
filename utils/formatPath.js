// formate the path to the correct format
const formatPath = (path) => {
  return path.replace(/\\/g, '/');
};

module.exports = { formatPath };