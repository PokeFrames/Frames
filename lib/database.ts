import { BACKEND_URL } from "../config.js";
import { Battle } from "../types/types";

export const getBattleById = async (id: number) => {
  const response = await fetch(`${BACKEND_URL}/battle/${id}`);

  const data = await response.json();

  return data as Battle;
}

let isMinting = false;
let mintData : any = null;

export const assignPokemonToUser = async (senderId: number, hash: `0x${string}`) => {
  if(!isMinting) {
    isMinting = true;
    const response = await fetch(`${BACKEND_URL}/assign-pokemon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ senderId, hash })
    })
  
    mintData = await response.json();
  
    if(response.ok) {
      console.log("Minted pokemon", mintData);
      return mintData.pokemonId;
    } else {
      return "Failed to assign pokemon";
    }
  }

  return 0;
}

export const welcomeGift = async (userFid:number, userAddress:string) => {
  console.log("Sending welcome gift to", userFid, userAddress);
  const response = await fetch(`${BACKEND_URL}/welcome-gift`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userFid, userAddress })
  })

  if(response.ok) {
    console.log("Sent welcome gift");
    return "Sent welcome gift";
  } else {
    console.error("Failed to send welcome gift");
    return "Failed to send welcome gift";
  }
}

export const getPokemonById = async (
  pokemonId: number,
) => {
  const response = await fetch(`${BACKEND_URL}/pokemon/${pokemonId}`);

  const data = await response.json();
  
  return data;
}

export const getPokemonsByPlayerId = async (senderId: number, selectedPokemons: number[] = []) => {
  const response = await fetch(`${BACKEND_URL}/user/${senderId}/pokemons`);

  const data = await response.json();

  const inventory = JSON.parse(data.inventory) as number[];

  console.log(inventory);

  // gotta remove the selected pokemons from the inventory
  selectedPokemons.forEach(pokemonId => {
    const index = inventory.indexOf(pokemonId);
    if(index > -1) {
      inventory.splice(index, 1);
    }
  });

  return inventory;
}

export const getPokemonName = async (pokemonId : number) => {
  const response = await fetch(`${BACKEND_URL}/pokemon/${pokemonId}/name`);

  const data = await response.json();

  return data.name;
}

let isCreatingBattle = false;

export const createBattle = async (maker: number, maker_pokemons: number[], isCompetitive: boolean) => {
  if(!isCreatingBattle) {
    isCreatingBattle = true;
    const response = await fetch(`${BACKEND_URL}/create-battle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ maker, maker_pokemons: JSON.stringify(maker_pokemons), is_competitive: isCompetitive ? 1 : 0 })
    })
  
    if(response.ok) {
      const data = await response.json();
  
      const newBattle = data.newBattle;
  
      isCreatingBattle = false;

      return newBattle.id;
    } else {
      return "Failed to create battle";
    }
  } else {
    return "Already creating battle";
  }
}

export const getBattlesByStatus = async (status: string) => {
  const response = await fetch(`${BACKEND_URL}/get/${status}`);
  const data = await response.json();
  // TODO: handle other battle cases
  return data.battles as Battle[];
}

let isJoiningBattle = false;

export const joinBattle = async (battleId: number, taker: number, taker_pokemons: number[]) => {
  if(!isJoiningBattle) {
    isJoiningBattle = true;
    const response = await fetch(`${BACKEND_URL}/join-battle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ battleId, taker, taker_pokemons: JSON.stringify(taker_pokemons) })
    })
  
    if(response.ok) {
      const data = await response.json();

      const { message } = data.message;

      isJoiningBattle = false;
  
      return message;
    } else {
      return "Failed to join battle";
    }
  } else {
    return "Already joining battle";
  }
}

export const checkBattleCasual = async (battleId: number) => {
  const battle = await getBattleById(battleId);

  return battle.is_competitive === 0;
}

export const forfeitBattle = async (battleId: number, userFid: number) => {
  const response = await fetch(`${BACKEND_URL}/forfeit-battle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ battleId, userFid })
  })

  if(response.ok) {
    return "Forfeited battle";
  } else {
    return "Failed to forfeit battle";
  }
}

export const setSelectedPokemons = async (battleId: number, userFid: number, selectedPokemons: number[]) => {
  const response = await fetch(`${BACKEND_URL}/select-pokemons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ battleId, userFid, pokemons: JSON.stringify(selectedPokemons) })
  })

  if(response.ok) {
    return "Selected pokemons updated";
  } else {
    return "Failed to update selected pokemons";
  }
}

export const makeMove = async (battleId: number, userFid: number, move: number) => {
  const response = await fetch(`${BACKEND_URL}/make-move`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({battleId, userFid, move})
  })

  if(response.ok) {
    const data = await response.json();
    return data;
  } else {
    return "Failed to make move";
  }
}

export const getOpenBattles = async () => {
  const response = await fetch(`${BACKEND_URL}/get/waiting`);

  const data = await response.json();

  return data.battles as number[];
}