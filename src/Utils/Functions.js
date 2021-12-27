const { default: axios } = require("axios");
const headers = { headers: { authorization: `Bearer ${sessionStorage.token}` } }

exports.getHTTP = async (url) => {
  const response = await axios.get(url, headers);
  return response.data;
};

exports.postHTTP = async (url, data) => {
  const response = await axios.post(url, data, headers);
  return response.data;
};
