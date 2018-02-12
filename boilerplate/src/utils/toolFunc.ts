function isEmpty(value: any) {
  if (value == null || value === '') {
    return true;
  } else if (Array.isArray(value)) {
    return value.length === 0;
  } else if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  return false;
}

function objToString (obj: any) {
  let str = '';
  if (!isEmpty(obj)) {
    str = Object.keys(obj)
    .map((key: any) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
  }
  return str;
}

function getToken () {
  return localStorage.getItem('userToken');
}

export {
  isEmpty,
  objToString,
  getToken
};
