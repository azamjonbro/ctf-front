<template>
  <div class="min-h-screen bg-cyber-bg text-cyber-text font-sans selection:bg-cyber-accent selection:text-white flex flex-col">
    <!-- Unified Hacker Navigation Bar -->
    <nav v-if="isAuthenticated" class="sticky top-0 z-40 border-b border-white/10 bg-[#0B1020]/90 backdrop-blur-md shadow-neon-primary">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between items-center">
          <span class="text-xl font-bold tracking-wider font-mono text-cyber-primary">
            // ALGORITM.<span class="text-cyber-secondary">CTF</span>
          </span>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex space-x-6 items-center text-xs font-mono">
            <router-link to="/" class="transition-colors hover:text-cyber-primary text-slate-400" active-class="text-cyber-primary font-bold">Boshqaruv paneli</router-link>
            <router-link to="/challenges" class="transition-colors hover:text-cyber-primary text-slate-400" active-class="text-cyber-primary font-bold">Topshiriqlar</router-link>
            <router-link to="/hackathons" class="transition-colors hover:text-cyber-primary text-slate-400" active-class="text-cyber-primary font-bold">Xakatonlar</router-link>
            <router-link to="/leaderboards" class="transition-colors hover:text-cyber-primary text-slate-400" active-class="text-cyber-primary font-bold">Peshqadamlar</router-link>
            <router-link to="/team" class="transition-colors hover:text-cyber-primary text-slate-400" active-class="text-cyber-primary font-bold">Mening jamoam</router-link>
            <router-link v-if="authStore.user" :to="`/profile/${authStore.user.username}`" class="transition-colors hover:text-cyber-primary text-slate-400" active-class="text-cyber-primary font-bold">Profil</router-link>
            
            <button @click="logout" class="ml-4 px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase font-mono hover:bg-red-500/20 hover:border-red-500/40 text-slate-300 transition">
              Chiqish
            </button>
          </div>

          <!-- Mobile Hamburger Toggle -->
          <div class="lg:hidden flex items-center">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-slate-400 hover:text-white focus:outline-none">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <transition name="slide-down">
        <div v-if="mobileMenuOpen" class="lg:hidden border-t border-white/5 bg-[#0B1020] px-4 py-3 space-y-2 font-mono text-xs">
          <router-link to="/" @click="mobileMenuOpen = false" class="block py-2 text-slate-400 hover:text-white" active-class="text-cyber-primary font-bold">// Boshqaruv paneli</router-link>
          <router-link to="/challenges" @click="mobileMenuOpen = false" class="block py-2 text-slate-400 hover:text-white" active-class="text-cyber-primary font-bold">// Topshiriqlar</router-link>
          <router-link to="/hackathons" @click="mobileMenuOpen = false" class="block py-2 text-slate-400 hover:text-white" active-class="text-cyber-primary font-bold">// Xakatonlar</router-link>
          <router-link to="/leaderboards" @click="mobileMenuOpen = false" class="block py-2 text-slate-400 hover:text-white" active-class="text-cyber-primary font-bold">// Peshqadamlar</router-link>
          <router-link to="/team" @click="mobileMenuOpen = false" class="block py-2 text-slate-400 hover:text-white" active-class="text-cyber-primary font-bold">// Mening jamoam</router-link>
          <router-link v-if="authStore.user" :to="`/profile/${authStore.user.username}`" @click="mobileMenuOpen = false" class="block py-2 text-slate-400 hover:text-white" active-class="text-cyber-primary font-bold">// Profil</router-link>
          <button @click="logout(); mobileMenuOpen = false" class="w-full text-left py-2 text-red-400 hover:text-red-300 font-bold border-t border-white/5 mt-2 pt-2">
            // Tizimdan chiqish
          </button>
        </div>
      </transition>
    </nav>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <router-view v-slot="{ Component }">
        <transition name="slide-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth.js';
import { useSocketStore } from './stores/socket.js';

const authStore = useAuthStore();
const socketStore = useSocketStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const mobileMenuOpen = ref(false);

const logout = async () => {
  await authStore.userLogout();
  router.push('/login');
};

const syncSocketConnection = () => {
  if (authStore.isAuthenticated) {
    socketStore.connectSocket();
  } else {
    socketStore.disconnectSocket();
  }
};

onMounted(() => {
  syncSocketConnection();
});

// Watch login state reactively
watch(() => authStore.isAuthenticated, () => {
  syncSocketConnection();
});
</script>

<style>
/* CSS styles are handled globally by assets/index.css */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.25s ease-out;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
