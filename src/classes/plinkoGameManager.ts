import { useBalanceStore } from '@/stores/balanceStore'
import { usePlinkoStore } from '@/stores/plinkoStore'
import axios from 'axios'
export class PlinkoGameManager {
  async requestGame(amount: number) {
    let startRound = true
    const balanceStore = useBalanceStore()
    if (amount > 0) {
      startRound = balanceStore.canAfford(amount)
      // we check if we can pay the amount due to start
    }

    if (!startRound) {
      throw Error("You don't have enough balance")
    }

    const plinko = usePlinkoStore()
    try {
      const result = await axios.post('/api/plinko/bet', {
        row: plinko.maxRows,
        risk: plinko.risk,
        amount,
      })

      // Deduct wager only after successful API call
      if (amount > 0) {
        balanceStore.substractWager(amount)
      }

      const { drop_point, multiplier, balance } = result.data

      console.log('result', { drop_point, multiplier, balance })

      console.log('api result', result)
      const earningResult = amount > 0 ? amount * multiplier : null

      console.log('we gonna drop ball', { result, earningResult })
      plinko.dropBall(drop_point, earningResult, multiplier)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      console.error('Request failed:', message)
      throw Error(message)
    }
  }
}
