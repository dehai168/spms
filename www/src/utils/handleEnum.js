export default (enums = []) => {
  const rs = {};
  let i = enums.length - 1;

  do {
    if (Object.hasOwnProperty.call(rs, enums[i].type)) {
      rs[enums[i].type].push({ value: enums[i].keyid, label: enums[i].name });
    } else {
      rs[enums[i].type] = [{ value: enums[i].keyid, label: enums[i].name }];
    }
  } while (i--);
  return rs;
}