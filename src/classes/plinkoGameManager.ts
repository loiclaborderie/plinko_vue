import { useBalanceStore } from '@/stores/balanceStore'
import { usePlinkoStore } from '@/stores/plinkoStore'
import axios from 'axios'
import { computed } from 'vue'

export class PlinkoGameManager {
  async requestGame(amount: number) {
    const plinko = usePlinkoStore()
    try {
      const result= await axios.post('/api/plinko/bet', {
        row: plinko.maxRows,
        risk: plinko.risk,
        amount
      })

      const { drop_point, multiplier, balance } = result.data

      console.log('result', { drop_point, multiplier, balance })

      let startRound = true
      if(amount > 0){
        const balanceStore = useBalanceStore()
        startRound = balanceStore.substractWager(amount)
        // we check if we can pay the amount due to start
      }

      if(!startRound){
        return
      }

      console.log('api result', result)
      const earningResult = amount > 0 ? amount * multiplier : null
      const resultWord = computed(() => {
        if (multiplier === 1) return 'made even'
        return multiplier > 1 ? 'earned' : 'lost'
      })

      if (amount > 0) {
        if (multiplier === 1) {
          alert('You made even!')
        } else {
          const resultAmount = Math.abs(amount * (multiplier - 1))
          alert(`You ${resultWord.value} ${resultAmount.toFixed(2)}!`)
        }
      } else {
        alert('You played for nothing hehe!')
      }
      console.log('we gonna drop ball', {result, earningResult})
      plinko.dropBall(drop_point, earningResult)
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Request failed:', e.message)
      } else {
        console.error('Request failed:', e)
      }
    }
  }

}
