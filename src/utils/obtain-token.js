export const obtainToken = () =>
  JSON.parse(localStorage.getItem('user'))?.token || null;