
/*
'id_in_previous-file': {
  ...'data_to_overwrite_to'...
}
*/

export const updatePropertiesOfItems = (updates = {}, items) => {
  const ids = Object.keys(updates)
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const { id: itemId } = item
    if (ids.includes(itemId)) {
      // update the object with the updated data
      items[i] = {
        ...items[i],
        ...updates[itemId]
      }
    }
  }
  return items
}