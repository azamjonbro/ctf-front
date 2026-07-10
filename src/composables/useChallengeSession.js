import { onUnmounted } from 'vue';
import { useChallengeStore } from '../stores/challenge.store.js';

export function useChallengeSession() {
  const challengeStore = useChallengeStore();
  let timerInterval = null;

  const startTimer = (onExpire) => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (challengeStore.timeRemaining > 0) {
        challengeStore.timeRemaining--;
      } else {
        clearInterval(timerInterval);
        if (onExpire) onExpire();
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  onUnmounted(() => {
    stopTimer();
  });

  return {
    startTimer,
    stopTimer,
  };
}
