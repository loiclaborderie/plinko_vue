import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlinkoStore } from '@/stores/plinkoStore'
import { ROW_REWARDS } from '@/constants/plinko'

export function usePlinkoTileColors() {
  const { risk, maxRows } = storeToRefs(usePlinkoStore())

  return computed(() => {
    const rowData = ROW_REWARDS[maxRows.value]
    const rewards = rowData[risk.value]

    const middleIndex = Math.floor(rewards.length / 2)

    return rewards.map((val, idx) => {
      const dist = Math.abs(idx - middleIndex)
      const maxDist = middleIndex

      const normalized = dist / maxDist

      const hue = 60 * (1 - normalized)

      return `hsl(${hue}, 90%, 50%)`
    })
  })
}
