import { useBalanceStore } from '@/stores/balanceStore'
import { usePlinkoStore } from '@/stores/plinkoStore'
import axios from 'axios'
import {toast} from 'vue-sonner'
export class PlinkoGameManager {
  async requestGame(amount: number) {
    const plinko = usePlinkoStore()
    try {
      const result = await axios.post('/api/plinko/bet', {
        row: plinko.maxRows,
        risk: plinko.risk,
        amount,
      })

      const { drop_point, multiplier, balance } = result.data

      console.log('result', { drop_point, multiplier, balance })

      let startRound = true
      if (amount > 0) {
        const balanceStore = useBalanceStore()
        startRound = balanceStore.substractWager(amount)
        // we check if we can pay the amount due to start
      }

      if (!startRound) {
        return
      }

      console.log('api result', result)
      const earningResult = amount > 0 ? amount * multiplier : null

      console.log('we gonna drop ball', { result, earningResult })
      plinko.dropBall(drop_point, earningResult, amount)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      console.error('Request failed:', message)
      toast({
        title: 'Error',
        description: 'Failed to place bet. Please try again.',
      })
    }
  }
}
