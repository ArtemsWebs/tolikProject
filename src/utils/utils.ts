export function getOptionForArray<T extends readonly string[], K extends readonly string[]>(
  fieldArray: T,
  nameArray: K,
) {
  if (fieldArray.length !== nameArray.length) return [];

  return fieldArray.map((val, index) => ({ value: val, label: nameArray[index] }));
}