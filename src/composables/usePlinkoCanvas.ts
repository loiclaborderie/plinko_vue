import { ref } from 'vue'
import { usePlinkoStore } from '@/stores/plinkoStore'
import { storeToRefs } from 'pinia'
import { unpaddify } from '@/helpers/padding'
import { generateSampleResults } from '@/helpers/sampling'

export function usePlinkoCanvas() {
  const ctx = ref<CanvasRenderingContext2D | null>(null)
  const plinko = usePlinkoStore()
  const refreshId = ref<number | null>(null)
  const { obstacles, balls } = storeToRefs(plinko)
  const canvaSize = { screenWidth: 800, baseMaxHeight: 800 }

  function initialize(canvas: HTMLCanvasElement) {
    if (!canvas) return

    canvas.width = canvaSize.screenWidth
    canvas.height = canvaSize.baseMaxHeight
    ctx.value = canvas.getContext('2d')
    plinko.createObstacles()
    plinko.sampleResults = generateSampleResults(plinko.maxRows)
  }

  function draw() {
    if (!ctx.value) return
    ctx.value.clearRect(0, 0, canvaSize.screenWidth, canvaSize.baseMaxHeight)

    obstacles.value.forEach((obstacle) => {
      if (!ctx.value) return

      obstacle.updateBlinkEffect()

      if (obstacle.willBlink) {
        ctx.value.beginPath()
        ctx.value.arc(
          unpaddify(obstacle.x),
          unpaddify(obstacle.y),
          obstacle.radius + obstacle.blinkFrameCount * 0.5,
          0,
          Math.PI * 2,
        )

        ctx.value.fillStyle = `rgba(255, 255, 255, ${obstacle.expandingCircleOpacity})`
        ctx.value.fill()

        ctx.value.strokeStyle = `rgba(255, 255, 255, ${obstacle.expandingCircleOpacity})`
        ctx.value.lineWidth = 2
        ctx.value.stroke()
        ctx.value.closePath()
      }
      ctx.value.beginPath()
      ctx.value.arc(unpaddify(obstacle.x), unpaddify(obstacle.y), obstacle.radius, 0, Math.PI * 2)

      ctx.value.fillStyle = '#F1F1F1'
      ctx.value.fill()
      ctx.value.closePath()
    })

    balls.value.forEach((ball) => {
      if (!ctx.value) return
      ball.draw(ctx.value)
      ball.update()
    })
  }

  function update() {
    draw()
    refreshId.value = requestAnimationFrame(update)
  }

  function stop() {
    if (refreshId.value !== null) {
      cancelAnimationFrame(refreshId.value)
    }
  }

  return { initialize, update, stop }
}
