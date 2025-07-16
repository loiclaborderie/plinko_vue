import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { GAME_NAMES, type GAME_NAMES as GameName } from './../constants/games'

type GameResultMap = {
  [key in GameName]: number[]
}

export const useGameResultStore = defineStore('gameResult', () => {
  const ongoingGame = ref<GameName | null>(null)

  const gameResult = ref<GameResultMap>(
    GAME_NAMES.reduce((acc, name) => {
      acc[name] = []
      return acc
    }, {} as GameResultMap),
  )

  function addGameResult(game: GameName, result: number) {
    if (!GAME_NAMES.includes(game)) {
      throw new Error(`Invalid game name: ${game}`)
    }
    gameResult.value[game].push(result)
    // Keep only the last 20 results to prevent memory issues
    if (gameResult.value[game].length > 20) {
      gameResult.value[game] = gameResult.value[game].slice(-20)
    }
  }

  function getLastNResultsForGame(game: GameName, n: number = 5) {
    return gameResult.value[game].slice(-n)
  }

  const currentResults = computed<number[]>(() => {
    if (!ongoingGame.value) return []
    return getLastNResultsForGame(ongoingGame.value)
  })

  function resetGameResults(game: GameName) {
    gameResult.value[game] = []
  }

  function resetCurrentGameResults() {
    if (ongoingGame.value) {
      resetGameResults(ongoingGame.value)
    }
  }

  return {
    ongoingGame,
    gameResult,
    addGameResult,
    getLastNResultsForGame,
    currentResults,
    resetGameResults,
    resetCurrentGameResults,
  }
})
