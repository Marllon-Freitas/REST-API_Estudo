// formate the path to the correct format
const formatPath = (path) => {
  if (path === null) return null;
  return path.replace(/\\/g, '/');
};

module.exports = { formatPath };