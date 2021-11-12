export function getCommaSeparatedString(values: string[]): string {
  return values.length ? values.join(', ') : '';
}

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

export function getUpdateQuery(table: string, data: Object): string {
  const queryParams = extractUpdateProperties(data);
  const setQuery = getCommaSeparatedString(queryParams);
  return `UPDATE ${table} SET ${setQuery} WHERE id=($1) RETURNING *`;
}

function extractUpdateProperties(data: Object): string[] {
  let updateProperties = [];

  for (const [key, value] of Object.entries(data)) {
    const setValue = typeof value === 'string' ? `'${value}'` : `${value}`;
    updateProperties.push(`${key} = ${setValue}`);
  }
  return updateProperties;
}
