import { PUBLIC_API_URL } from "$env/static/public";

const query = `
query getUnevolvedPokmons {
  pokemon_v2_pokemonspecies(where: {evolves_from_species_id: {_is_null: true}}, limit: 300) {
    name
    id
  }
}
`;

export async function queryUnevolvedPokmons() {
  const result = await fetch(PUBLIC_API_URL, {
    method: 'POST',
    body: JSON.stringify({ query })
  });

  return await result.json();
}
