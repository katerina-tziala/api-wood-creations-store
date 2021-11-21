export function getCreationQuery<U>(
  table: string,
  keys: string[],
  values: U[]
): string {
  const properties = getCommaSeparatedString(keys);
  const valuesIndexes = values.map((_, index) => `$${index + 1}`);
  const valuesString = getCommaSeparatedString(valuesIndexes);

  return `INSERT INTO ${table} (${properties}) VALUES(${valuesString}) RETURNING *`;
}

export function getUpdateQuery(
  table: string,
  keys: string[],
  where: string
): string {
  const queryParams = keys.map((key, index) => `${key} = $${index + 1}`);
  const setQuery = getCommaSeparatedString(queryParams);
  return `UPDATE ${table} SET ${setQuery} WHERE ${where} RETURNING *`;
}

function getCommaSeparatedString(values: string[]): string {
  return values.length ? values.join(', ') : '';
}
