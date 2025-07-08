// import { useBalanceStore } from '@/stores/balanceStore'

// class WagerManager {
//   private gameManager: GameManager
//   private balanceStore: ReturnType<typeof useBalanceStore>

//   constructor(gameManager: GameManager, balanceStore: ReturnType<typeof useBalanceStore>) {
//     this.gameManager = gameManager
//     this.balanceStore = balanceStore
//   }

//   startWager(amount: number) {
//     // Start a new wager
//     const result = this.gameManager.startGame()
//     if (result.error) {
//       console.error(result.error)
//       return
//     }

//     if (this.balanceStore.balance >= amount) {
//       this.balanceStore.subtract(amount)
//     } else {
//       console.error('Insufficient balance')
//     }
//   }

//   endWager(amountWon: number) {
//     // End the wager and add the winnings
//     this.balanceStore.add(amountWon)
//   }
// }
