import { computed } from 'vue';
import { useAuthStore } from '../stores/auth.store.js';

export function useCurrentEntity(activeTab) {
  const authStore = useAuthStore();

  const currentEntityId = computed(() => {
    if (!authStore.user) return null;
    
    const tab = typeof activeTab === 'string' ? activeTab : activeTab.value;
    if (tab === 'users') {
      return authStore.user.id || authStore.user._id || null;
    }
    if (tab === 'teams') {
      return authStore.user.teamId || null;
    }
    return null;
  });

  return {
    currentEntityId,
  };
}
