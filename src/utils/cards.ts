export function addIdentifier(data: App.Pokemon[]) {
  return data.map((po, index) => ({
    ...po,
    identifier: index + 1
  }));
}

export const findCurrentCard = (current: App.Pokemon, cards: App.Pokemon[]) =>
  cards.find((_) => _.identifier === current.identifier) !== undefined;