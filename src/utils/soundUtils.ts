// Success sound for transactions and wallet funding
export const playSuccessSound = () => {
  try {
    // Create a pleasant notification sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // First tone - C note
    const oscillator1 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    
    oscillator1.connect(gainNode1);
    gainNode1.connect(audioContext.destination);
    oscillator1.type = 'sine';
    
    oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    gainNode1.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator1.start();
    oscillator1.stop(audioContext.currentTime + 0.2);
    
    // Second tone - E note
    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      oscillator2.type = 'sine';
      
      oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
      gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator2.start();
      oscillator2.stop(audioContext.currentTime + 0.3);
    }, 150);
    
  } catch (error) {
    console.log('Sound not supported or failed to play');
  }
};