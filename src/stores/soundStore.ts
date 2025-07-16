// soundStore.ts
import { defineStore } from 'pinia'
import { ref, readonly, computed } from 'vue'

interface SoundOptions {
  pitchVariation?: number
  volumeVariation?: number
  filterVariation?: number
  startTimeVariation?: number
  baseVolume?: number
}

interface SoundMap {
  [key: string]: string
}

class SoundPlayer {
  private audioContext: AudioContext | null = null
  private audioBuffer: AudioBuffer | null = null
  private currentSource: AudioBufferSourceNode | null = null
  private src: string

  constructor(src: string) {
    this.src = src
    this.initializeAudio()
    this.loadAudioFile()
  }

  private async initializeAudio(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.error('Web Audio API not supported:', error)
    }
  }

  private async loadAudioFile(): Promise<void> {
    if (!this.audioContext) return

    try {
      const response = await fetch(this.src)
      const arrayBuffer = await response.arrayBuffer()
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
    } catch (error) {
      console.error('Error loading audio file:', error)
    }
  }

  async playVariation(options: SoundOptions = {}): Promise<void> {
    if (!this.audioContext || !this.audioBuffer) {
      console.warn('Audio not ready')
      return
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    if (this.currentSource) {
      this.currentSource.stop()
    }

    // Create audio nodes
    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    const filterNode = this.audioContext.createBiquadFilter()

    source.buffer = this.audioBuffer

    // Get variation amounts from options (with defaults)
    const pitchVar = options.pitchVariation ?? 0.1
    const volumeVar = options.volumeVariation ?? 0.1
    const filterVar = options.filterVariation ?? 500
    const startTimeVar = options.startTimeVariation ?? 0.02
    const baseVol = options.baseVolume ?? 0.8

    // Apply randomization
    const pitchRandom = (Math.random() - 0.5) * 2 * pitchVar
    const volumeRandom = (Math.random() - 0.5) * 2 * volumeVar
    const filterRandom = (Math.random() - 0.5) * 2 * filterVar
    const startTimeRandom = (Math.random() - 0.5) * 2 * startTimeVar

    // Apply pitch variation (playback rate)
    source.playbackRate.value = 1 + pitchRandom

    // Apply volume variation
    gainNode.gain.value = Math.max(0.1, baseVol + volumeRandom)

    // Apply filter variation
    filterNode.type = 'lowpass'
    filterNode.frequency.value = Math.max(100, 1000 + filterRandom)
    filterNode.Q.value = 1

    // Apply start time variation
    const startTime = this.audioContext.currentTime + Math.max(0, startTimeRandom)

    // Connect nodes: source -> filter -> gain -> destination
    source.connect(filterNode)
    filterNode.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    source.start(startTime)

    this.currentSource = source

    source.onended = () => {
      this.currentSource = null
    }
  }

  async play(): Promise<void> {
    if (!this.audioContext || !this.audioBuffer) {
      console.warn('Audio not ready')
      return
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    if (this.currentSource) {
      this.currentSource.stop()
    }

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()

    source.buffer = this.audioBuffer

    gainNode.gain.value = 0.8
    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    source.start()

    this.currentSource = source

    // Clean up when finished
    source.onended = () => {
      this.currentSource = null
    }
  }

  stop(): void {
    if (this.currentSource) {
      this.currentSource.stop()
      this.currentSource = null
    }
  }
}

export const useSoundStore = defineStore('sound', () => {
  const sounds = ref(new Map<string, SoundPlayer>())
  const isEnabled = ref(true)

  const loadSound = (name: string, src: string): void => {
    sounds.value.set(name, new SoundPlayer(src))
  }

  const playSoundVariant = async (name: string, options: SoundOptions = {}): Promise<void> => {
    if (!isEnabled.value) return

    const sound = sounds.value.get(name)
    if (!sound) {
      console.warn(`Sound "${name}" not found`)
      return
    }

    await sound.playVariation(options)
  }

  const playSound = async (name: string): Promise<void> => {
    if (!isEnabled.value) return

    const sound = sounds.value.get(name)
    if (!sound) {
      console.warn(`Sound "${name}" not found`)
      return
    }

    await sound.play()
  }

  const stopSound = (name: string): void => {
    const sound = sounds.value.get(name)
    if (sound) {
      sound.stop()
    }
  }

  const stopAllSounds = (): void => {
    sounds.value.forEach(sound => sound.stop())
  }

  const toggleSound = (): void => {
    isEnabled.value = !isEnabled.value
  }

  const preloadSounds = (soundMap: SoundMap): void => {
    Object.entries(soundMap).forEach(([name, src]) => {
      loadSound(name, src)
    })
  }

  const removeSound = (name: string): boolean => {
    const sound = sounds.value.get(name)
    if (sound) {
      sound.stop()
    }
    return sounds.value.delete(name)
  }

  const hasSound = (name: string): boolean => {
    return sounds.value.has(name)
  }

  const soundCount = computed(() => sounds.value.size)
  const availableSounds = computed(() => Array.from(sounds.value.keys()))

  return {
    sounds: readonly(sounds),
    isEnabled,
    loadSound,
    playSound,
    playSoundVariant,
    stopSound,
    stopAllSounds,
    toggleSound,
    preloadSounds,
    removeSound,
    hasSound,
    soundCount,
    availableSounds
  }
})

export type { SoundOptions, SoundMap }
