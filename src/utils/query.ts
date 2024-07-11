import { PUBLIC_API_URL } from "$env/static/public";

const query = `
query getUnevolvedPokmons {
  pokemon_v2_pokemonspecies(where: {evolves_from_species_id: {_is_null: true}}, limit: 300) {
    name
    id
  }
}
`;

interface QueryResponse {
  name: string
  id: string
}

export async function queryUnevolvedPokmons(): Promise<QueryResponse> {
  const result = await fetch(PUBLIC_API_URL, {
    method: 'POST',
    body: JSON.stringify({ query })
  });

  const json = await result.json();
  return json.data.pokemon_v2_pokemonspecies
}
