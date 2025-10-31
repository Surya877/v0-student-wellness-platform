// Simple sound utility for UI interactions
export default function playSound() {
  // Create a simple beep sound using Web Audio API
  if (typeof window === "undefined") return

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.connect(gain)
    gain.connect(audioContext.destination)

    oscillator.frequency.value = 600
    oscillator.type = "sine"

    gain.gain.setValueAtTime(0.3, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  } catch (e) {
    // Fallback: silent if audio context not supported
  }
}
