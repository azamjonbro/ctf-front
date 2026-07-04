<template>
  <div class="min-h-screen bg-cyber-bg text-slate-200">


    <!-- Main Container -->
    <main v-if="hackathon" class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <!-- Hackathon Header Capsule -->
      <div class="p-6 rounded-lg glass-panel border border-cyber-primary/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="space-y-1">
          <span class="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded font-bold"
            :class="hackathon.status === 'active' ? 'bg-cyber-primary text-[#0B1020]' : 'bg-slate-700 text-slate-300'"
          >
            {{ hackathon.status === 'active' ? 'FAOL XAKATON ARENASI' : 'YAKUNLANGAN XAKATON ARENASI' }}
          </span>
          <h1 class="text-3xl font-extrabold text-white font-mono uppercase tracking-wide mt-2">{{ hackathon.name }}</h1>
          <p class="text-slate-400 text-xs leading-relaxed max-w-2xl">{{ hackathon.description }}</p>
        </div>

        <div class="flex space-x-4">
          <div class="p-4 bg-white/5 rounded border border-white/5 font-mono text-center min-w-[120px]">
            <span class="text-[9px] text-slate-500 block uppercase">Maksimal jamoalar</span>
            <span class="text-lg font-bold text-white block mt-1">{{ hackathon.maxTeams }}</span>
          </div>
          <div class="p-4 bg-white/5 rounded border border-white/5 font-mono text-center min-w-[120px]">
            <span class="text-[9px] text-slate-500 block uppercase">Xakaton holati</span>
            <span class="text-xs font-bold block mt-1 uppercase"
              :class="hackathon.status === 'active' ? 'text-cyber-secondary' : 'text-slate-400'"
            >
              {{ hackathon.status === 'active' ? 'FAOL' : 'YAKUNLANGAN' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Challenges List (Left 2 cols) -->
        <div class="lg:col-span-2 space-y-4">
          <h3 class="text-sm font-bold font-mono text-white uppercase tracking-wider pl-1">// Xakaton topshiriqlari ko'rsatmalari</h3>
          
          <div v-if="hackathon.status === 'finished'" class="p-8 rounded bg-cyber-card border border-white/10 text-center font-mono text-xs text-slate-400 space-y-3 py-16">
            <span class="text-4xl block mb-2">🏁</span>
            <span class="text-white font-extrabold text-sm block">XAKATON YAKUNLANDI</span>
            <span>Musobaqa o'z nihoyasiga yetdi. Faqat natijalar va jamoalar reytingi ko'rinadi.</span>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="c in challenges"
              :key="c._id"
              class="p-5 rounded-lg bg-cyber-card border border-white/5 flex flex-col justify-between h-[180px] hover:border-cyber-primary/40 transition"
            >
              <div>
                <div class="flex justify-between items-center text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                  <span>{{ c.category }}</span>
                  <span :class="{
                    'text-cyber-primary': c.difficulty === 'easy',
                    'text-cyber-secondary': c.difficulty === 'medium',
                    'text-cyber-danger': c.difficulty === 'hard',
                  }">
                    {{ c.difficulty === 'easy' ? 'oson' : c.difficulty === 'medium' ? 'o\'rtacha' : 'qiyin' }} (★ {{ c.stars }})
                  </span>
                </div>
                <h2 class="text-base font-bold text-white font-mono uppercase mt-2 truncate">{{ c.title }}</h2>
                <p class="text-xs text-slate-400 line-clamp-2 mt-1">{{ c.shortDescription }}</p>
              </div>

              <div class="border-t border-white/5 pt-3 mt-3 flex justify-between items-center text-xs">
                <span class="text-[9px] font-mono text-slate-500 uppercase">
                  Sessiya: <span class="font-bold" :class="getSessionStatusClass(c.sessionStatus)">
                    {{ c.sessionStatus === 'completed' ? 'yakunlangan' : c.sessionStatus === 'active' ? 'faol' : 'boshlanmagan' }}
                  </span>
                </span>
                <button
                  @click="launchChallenge(c._id)"
                  class="px-3 py-1.5 rounded font-mono font-bold text-[9px] tracking-wider text-[#0B1020] bg-cyber-primary hover:bg-cyber-primary/95 transition"
                >
                  MAQSADNI BOSHLASH
                </button>
              </div>
            </div>

            <div v-if="challenges.length === 0" class="col-span-full py-16 text-center text-slate-500 font-mono text-sm space-y-2">
              <svg class="mx-auto h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
              <p>Hozircha ushbu xakaton uchun topshiriqlar joylashtirilmagan.</p>
            </div>
          </div>
        </div>

        <!-- Standings Leaderboard (Right 1 col) -->
        <div class="glass-panel p-6 rounded-lg space-y-4 border border-white/5 self-start">
          <h3 class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase">// Jonli jamoalar reytingi</h3>
          
          <div class="space-y-3 font-mono text-xs">
            <div
              v-for="(row, idx) in standings"
              :key="row.teamId"
              class="flex justify-between items-center p-2 rounded"
              :class="row.isCurrentUserTeam ? 'bg-cyber-primary/10 border-l-2 border-cyber-primary font-bold' : 'bg-white/5'"
            >
              <div class="flex items-center space-x-2">
                <span class="text-slate-500 font-bold">#{{ idx + 1 }}</span>
                <span class="text-white truncate max-w-[120px]">{{ row.teamName }}</span>
              </div>
              <div class="text-right text-cyber-secondary">{{ row.score }} ball</div>
            </div>

            <div v-if="standings.length === 0" class="text-center py-6 text-slate-500">
              Reyting jadvalini hisoblash jarayoni ketmoqda...
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '../utils/api.js';
import { useSocketStore } from '../stores/socket.js';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const hackathon = ref(null);
const challenges = ref([]);
const standings = ref([]);

const loadArenaData = async () => {
  try {
    const [detailsRes, challengesRes, standingsRes] = await Promise.all([
      api.get(`/hackathons/${route.params.hackathonId}`),
      api.get(`/hackathons/${route.params.hackathonId}/challenges`),
      api.get(`/hackathons/${route.params.hackathonId}/standings`)
    ]);

    hackathon.value = detailsRes.data.data;
    challenges.value = challengesRes.data.data;
    standings.value = standingsRes.data.data.leaderboard || [];
  } catch (error) {
    const errorMsg = error?.error?.message || 'Xakaton arenasi sessiyasini ishga tushirib bo\'lmadi';
    toast.error(errorMsg);
    router.push('/hackathons');
  }
};

const getSessionStatusClass = (status) => {
  if (status === 'completed') return 'text-cyber-primary';
  if (status === 'active') return 'text-cyber-secondary animate-pulse';
  return 'text-slate-500';
};

const launchChallenge = (challengeId) => {
  router.push(`/challenges/${challengeId}`);
};

const socketStore = useSocketStore();

const handleRealtimeUpdate = (data) => {
  loadArenaData();
};

onMounted(() => {
  loadArenaData();
  if (socketStore.socket) {
    socketStore.socket.on('hackathon:started', handleRealtimeUpdate);
    socketStore.socket.on('hackathon:finished', handleRealtimeUpdate);
    socketStore.socket.on('challenge:solved', handleRealtimeUpdate);
    socketStore.socket.on('leaderboard:refresh', handleRealtimeUpdate);
  }
});

onUnmounted(() => {
  if (socketStore.socket) {
    socketStore.socket.off('hackathon:started', handleRealtimeUpdate);
    socketStore.socket.off('hackathon:finished', handleRealtimeUpdate);
    socketStore.socket.off('challenge:solved', handleRealtimeUpdate);
    socketStore.socket.off('leaderboard:refresh', handleRealtimeUpdate);
  }
});
</script>
