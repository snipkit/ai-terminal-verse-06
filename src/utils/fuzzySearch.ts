export function fuzzySearch(list: any[], query: string) {
  const q = query.toLowerCase();
  return list.filter(item =>
    item.name.toLowerCase().includes(q) ||
    (item.description && item.description.toLowerCase().includes(q))
  );
}
