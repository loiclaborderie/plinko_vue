import { riskLevels, ROW_REWARDS, type MaxRow, type Risk } from '@/constants/plinko'

export type SampleResults = {
  [index: number]: number[]
}

export function generateSampleResults(row: MaxRow) {
  const sampleResults: SampleResults = {}
  const risk: Risk = riskLevels[0]
  const rewardArray = ROW_REWARDS[row][risk]

  // For each reward value, create an empty array
  rewardArray.forEach((reward, index) => {
    sampleResults[index] = []
  })

  return sampleResults
}
