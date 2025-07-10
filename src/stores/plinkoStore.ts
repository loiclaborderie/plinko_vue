import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { paddify, unpaddify } from '@/helpers/padding'
import {
  CANVA_HEIGHT,
  CANVA_WIDTH,
  friction,
  ballColor,
  type MaxRow,
  type Risk,
} from '@/constants/plinko'
import { type SampleResults } from '@/helpers/sampling'
import { useBalanceStore } from './balanceStore'
import { toast } from 'vue-sonner'

export const usePlinkoStore = defineStore('plinkoGame', () => {
  const gravity = paddify(0.2)
  const balls = ref<Ball[]>([])
  const obstacles = ref<Obstacle[]>([])
  const maxRows = ref<MaxRow>(16)
  const risk = ref<Risk>('low')
  const ballRadius = computed(() => (7 * 16) / maxRows.value)
  const obstacleRadius = computed(() => (4 * 16) / maxRows.value)
  const spacing = computed(() => {
    return unpaddify(calculateSpacing(maxRows.value))
  })
  const gameActive = computed(() => balls.value.length > 0)
  const sampleResults = ref<SampleResults>()

  // Custom getter for max rows to prevent changing the value while the game is active
  const tempMaxRows = computed({
    get: () => maxRows.value,
    set: (value: MaxRow) => {
      if (!gameActive.value) {
        maxRows.value = value
      }
    },
  })

  // Custom getter for risk to prevent changing the value while the game is active
  const tempRisk = computed({
    get: () => risk.value,
    set: (value: Risk) => {
      if (!gameActive.value) {
        risk.value = value
      }
    },
  })

  // Initialize obstacles
  function createObstacles() {
    obstacles.value = []
    const HALF_CANVA_WIDTH = CANVA_WIDTH / 2
    const bottomMargin = 15
    const fakeRows = maxRows.value + 2
    const availableHeight = CANVA_HEIGHT - bottomMargin
    const ySpacing = availableHeight / maxRows.value
    for (let row = 2; row < fakeRows; row++) {
      const y = ySpacing * (row - 1) - obstacleRadius.value
      const numObstacles = row + 1
      for (let obstacle = 0; obstacle < numObstacles; obstacle++) {
        const x = HALF_CANVA_WIDTH - spacing.value * (row / 2 - obstacle)
        const obstacleObj = new Obstacle(paddify(x), paddify(y), obstacleRadius.value)
        obstacles.value.push(obstacleObj)
      }
    }
  }

  function calculateSpacing(maxRows: number) {
    const obstacleAmount = maxRows + 2
    const spacing = CANVA_WIDTH / obstacleAmount
    return paddify(spacing)
  }

  // function generateDropPoint(): number {
  //   const center = CANVA_WIDTH / 2
  //   const variation = 50
  //   const randomOffset = Math.random() * variation - Math.floor(variation / 2)
  //   const dropPoint = center + randomOffset
  //   const roundedDropPoint = parseFloat(dropPoint.toFixed(5))
  //   return paddify(roundedDropPoint)
  // }

  // Create a new ball
  function dropBall(dropPoint: number, earningResult: number | null, wager: number) {
    const newBall = new Ball(
      dropPoint,
      paddify(35),
      2,
      2,
      ballRadius.value,
      ballColor,
      (result: number) => {
        const index = balls.value.indexOf(newBall)
        if (index !== -1) {
          balls.value.splice(index, 1)
        }
        const tile = document.getElementById(`tile_${result}`)
        if (tile) {
          tile.style.transform = 'translateY(10%)'
          tile.style.transition = 'transform 0.2s ease-in-out'
          const resetTransform = () => {
            tile.style.transform = ''
            tile.style.transition = ''
            tile.removeEventListener('transitionend', resetTransform)
          }

          tile.addEventListener('transitionend', resetTransform)
        }
        if (earningResult) {
          console.log({earningResult, wager})
          const balanceStore = useBalanceStore()
          balanceStore.add(earningResult, !gameActive.value)
          // We only sync balance with server if there is no ball falling
          const resultAmount = Math.abs(wager - earningResult)
          const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(resultAmount)
          toast.message(earningResult > wager ? 'Nice!' : 'Too bad!', {
            description: `You ${earningResult > wager ? 'earned' : 'lost'} ${formattedAmount}!`,
          })
        } else if (earningResult! - wager === 0) {
          toast.message('Even!', {
            description: 'You made even!',
          })
        } else {
          toast.message('Free Play', {
            description: 'You played for nothing hehe!',
          })
        }
      },
    )

    balls.value.push(newBall)
  }

  // Ball class
  class Ball {
    x: number
    y: number
    dx: number
    dy: number
    radius: number
    color: string
    onFinish: (index: number) => void

    constructor(
      x: number,
      y: number,
      dx: number,
      dy: number,
      radius: number,
      color: string,
      onFinish: (index: number) => void,
    ) {
      this.y = y
      this.x = x
      this.dx = dx
      this.dy = dy
      this.radius = radius
      this.color = color
      this.onFinish = onFinish
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath()
      ctx.arc(unpaddify(this.x), unpaddify(this.y), this.radius, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()
      ctx.closePath()
    }

    update() {
      this.dy += gravity
      this.x += this.dx
      this.y += this.dy

      // Handle obstacle collision
      obstacles.value.forEach((obstacle) => {
        const distance = Math.hypot(this.x - obstacle.x, this.y - obstacle.y)
        if (distance < paddify(this.radius + obstacle.radius)) {
          obstacle.blink()
          const angle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x)
          const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
          this.dx = speed * friction.x * Math.cos(angle)
          this.dy = speed * friction.y * Math.sin(angle)

          const overlap = this.radius + obstacleRadius.value - unpaddify(distance)
          this.x += paddify(overlap * Math.cos(angle))
          this.y += paddify(overlap * Math.sin(angle))
        }
      })

      if (unpaddify(this.y) - this.radius > CANVA_HEIGHT) {
        this.dy = 0
        this.dx = 0
        const mostLeftObstacle = Math.min(...obstacles.value.map((obstacle) => obstacle.x))
        const mostRightObstacle = Math.max(...obstacles.value.map((obstacle) => obstacle.x))
        const lastRowY = Math.max(...obstacles.value.map((obstacle) => obstacle.y))
        if (this.x < mostLeftObstacle || this.x > mostRightObstacle) {
          this.onFinish(-1)
        } else {
          const lastRowObstacles = obstacles.value.filter((obstacle) => obstacle.y === lastRowY)

          lastRowObstacles.sort((a, b) => a.x - b.x)

          let rewardIndex = -1
          for (let i = 0; i < lastRowObstacles.length - 1; i++) {
            const leftObstacle = lastRowObstacles[i]
            const rightObstacle = lastRowObstacles[i + 1]

            if (this.x >= leftObstacle.x && this.x <= rightObstacle.x) {
              rewardIndex = i
              break
            }
          }
          this.onFinish(rewardIndex)
        }
      }
    }
  }

  // Obstacle class
  class Obstacle {
    x: number
    y: number
    radius: number
    willBlink: boolean
    blinkFrameCount: number
    expandingCircleOpacity: number
    totalFrameCount: number

    constructor(x: number, y: number, radius: number) {
      this.x = x
      this.y = y
      this.radius = radius
      this.willBlink = false
      this.blinkFrameCount = 0
      this.expandingCircleOpacity = 0
      this.totalFrameCount = 20
    }

    blink() {
      if (this.willBlink) return
      this.willBlink = true
      this.blinkFrameCount = 0
      this.expandingCircleOpacity = 0.3
    }

    updateBlinkEffect() {
      if (this.willBlink) {
        this.blinkFrameCount++

        if (this.blinkFrameCount > this.totalFrameCount) {
          this.expandingCircleOpacity = Math.max(0, this.expandingCircleOpacity - 0.05)

          if (this.expandingCircleOpacity <= 0) {
            this.willBlink = false
            this.blinkFrameCount = 0
          }
        }
      }
    }
  }

  return {
    balls,
    obstacles,
    dropBall,
    createObstacles,
    paddify,
    unpaddify,
    maxRows: tempMaxRows,
    sampleResults,
    spacing,
    risk: tempRisk,
    gameActive,
  }
})
