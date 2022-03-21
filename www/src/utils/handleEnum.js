export default (enums = []) => {
  const rs = {};
  let i = enums.length - 1;

  while (i >= 0) {
    if (Object.hasOwnProperty.call(rs, enums[i].type)) {
      rs[enums[i].type].push({ value: enums[i].keyid, label: enums[i].name });
    } else {
      rs[enums[i].type] = [{ value: enums[i].keyid, label: enums[i].name }];
    }

    i--;
  };
  return rs;
}