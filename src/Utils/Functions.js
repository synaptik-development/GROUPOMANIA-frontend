const { default: axios } = require("axios");
let headers = { headers: { authorization: `Bearer ${sessionStorage.token}` } };

// requête sans authentification
exports.postLogin = async (url, data) => {
  const response = await axios.post(url, data);
  headers = { headers: { authorization: `Bearer ${response.data.token}` } };
  return response.data;
};

// requêtes avec authentification
exports.getHTTP = async (url) => {
  const response = await axios.get(url, headers);
  return response.data;
};

exports.postHTTP = async (url, data) => {
  const response = await axios.post(url, data, headers);
  return response.data;
};

exports.putHTTP = async (url, data) => {
  const response = await axios.put(url, data, headers);
  return response.data;
};

exports.deleteHTTP = async (url) => {
  const response = await axios.delete(url, headers);
  return response.data;
};

