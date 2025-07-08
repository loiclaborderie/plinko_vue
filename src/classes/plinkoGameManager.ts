import { useBalanceStore } from '@/stores/balanceStore'
import { usePlinkoStore } from '@/stores/plinkoStore'
import { useUserStore } from '@/stores/userStore'

export class PlinkoGameManager {
  async requestGame(amount: number) {
    const url = 'http://127.0.0.1:8000/api/plinko/bet'
    const plinko = usePlinkoStore()
    const user = useUserStore()
    // post on this url with the row and riskSelected, and an amouht of 0
    try {
      const _headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
      if (user.token) {
        _headers['Authorization'] = `Bearer ${user.token}`
      }
      const _body = JSON.stringify({
        row: plinko.maxRows,
        risk: plinko.risk,
        amount: amount,
      })
      const dataFetch = new URLSearchParams({
        row: plinko.maxRows.toString(),
        risk: plinko.risk,
        amount: amount.toString(),
      })
      console.log(dataFetch)
      const result = await fetch(url, {
        method: 'POST',
        headers: _headers,
        body: dataFetch,
      })

      // Check if the response status indicates an error
      if (!result.ok) {
        const errorData = await result.json()
        throw new Error(`API Error: ${result.status} - ${errorData.message || 'Unknown error'}`)
      }
      this.substractAmount(amount)

      const data: { drop_point: number; multiplier: number; balance: number } = await result.json()
      console.log(data)
      let earningResult: number | null = amount * data.multiplier
      if (amount === 0) {
        earningResult = null
        alert(`You won ${data.multiplier}!`)
      }
      plinko.dropBall(data.drop_point, earningResult)
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Request failed:', e.message)
      } else {
        console.error('Request failed:', e)
      }
    }
  }

  substractAmount(amount: number) {
    if (amount > 0) {
      const balanceStore = useBalanceStore()
      balanceStore.subtract(amount)
    }
  }
}
