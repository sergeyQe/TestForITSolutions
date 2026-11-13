/**
 * Раскладывает строки из базы по ключам родителей — в том виде, которого ждёт DataLoader:
 * списки идут в порядке ключей, для ключа без строк — пустой список.
 * Порядок строк внутри списка сохраняется, поэтому сортировка из запроса не теряется.
 */
export function groupByKey<Key, Row>(
  keys: readonly Key[],
  rows: readonly Row[],
  keyOf: (row: Row) => Key,
): Row[][] {
  // Пустой список заводится для каждого ключа заранее: родитель без детей получит именно его
  const groups = new Map<Key, Row[]>(keys.map((key) => [key, []]));

  // Строка с ключом не из списка пропускается: её никто не запрашивал
  for (const row of rows) {
    groups.get(keyOf(row))?.push(row);
  }
  return keys.map((key) => groups.get(key) ?? []);
}
