<template>
  <div class="min-h-screen bg-cyber-bg text-slate-200">


    <!-- Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div class="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 class="text-2xl font-bold font-mono text-white">// PLATFORMA REYTINGLARI</h1>
          <p class="text-xs text-slate-400">Taktikaviy reyting jadvallari va global operatorlar reytingi</p>
        </div>

        <!-- Tab selection -->
        <div class="flex space-x-2 bg-cyber-card p-1 rounded border border-white/5 text-xs font-mono">
          <button
            @click="activeTab = 'users'"
            class="px-4 py-1.5 rounded transition"
            :class="activeTab === 'users' ? 'bg-cyber-primary text-[#0B1020] font-bold' : 'text-slate-400 hover:text-white'"
          >
            OPERATORLAR
          </button>
          <button
            @click="activeTab = 'teams'"
            class="px-4 py-1.5 rounded transition"
            :class="activeTab === 'teams' ? 'bg-cyber-secondary text-[#0B1020] font-bold' : 'text-slate-400 hover:text-white'"
          >
            JAMOALAR
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Rankings Table -->
        <div class="lg:col-span-3 glass-panel rounded-lg p-6 space-y-4">
          <h2 class="text-lg font-bold font-mono text-white uppercase flex items-center space-x-2">
            <span>{{ activeTab === 'users' ? 'Global operatorlar reytingi' : 'Global jamoalar reytingi' }}</span>
          </h2>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b border-white/10 text-xs font-mono uppercase text-slate-400 tracking-wider">
                  <th class="py-3 px-4">O'rin</th>
                  <th class="py-3 px-4">Nomi</th>
                  <th class="py-3 px-4">Ballar</th>
                  <th class="py-3 px-4">Yulduzlar</th>
                  <th class="py-3 px-4 text-center">O'zgarish</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr
                  v-for="(item, index) in (activeTab === 'users' ? userLeaderboard : teamLeaderboard)"
                  :key="item._id"
                  class="hover:bg-white/5 transition"
                  :class="{ 'bg-cyber-primary/5 border-l-2 border-cyber-primary': item._id === currentTargetId }"
                >
                  <td class="py-4 px-4 font-mono font-bold text-white flex items-center space-x-2">
                    <span :class="{'text-cyber-primary': index === 0, 'text-cyber-secondary': index === 1, 'text-cyber-accent': index === 2}">
                      #{{ item.ranking && item.ranking !== 999999 ? item.ranking : index + 1 }}
                    </span>
                  </td>
                  <td class="py-4 px-4 font-semibold text-white">
                    <div class="flex items-center space-x-2">
                      <span v-if="activeTab === 'users'" class="text-slate-400 text-xs">[{{ item.country || 'WW' }}]</span>
                      <span>{{ activeTab === 'users' ? item.username : item.name }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-4 font-mono text-cyber-secondary font-bold">{{ item.points }}</td>
                  <td class="py-4 px-4 font-mono text-cyber-primary">★ {{ item.stars }}</td>
                  <td class="py-4 px-4 text-center font-mono text-xs">
                    <span v-if="item.positionChange > 0" class="text-cyber-primary">+{{ item.positionChange }} ▲</span>
                    <span v-else-if="item.positionChange < 0" class="text-cyber-danger">{{ item.positionChange }} ▼</span>
                    <span v-else class="text-slate-500">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Surroundings Column -->
        <div class="space-y-6">
          <div class="glass-panel p-6 rounded-lg space-y-4">
            <h3 class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase">// Nisbiy reyting</h3>
            
            <div class="space-y-3">
              <!-- Users Above -->
              <div v-for="user in surrounding.above" :key="user._id" class="p-3 bg-white/5 rounded border border-white/5 text-xs opacity-75">
                <div class="flex justify-between font-mono">
                  <span class="text-cyber-secondary">#{{ user.ranking }}</span>
                  <span class="font-bold text-white">{{ user.username || user.name }}</span>
                </div>
                <div class="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>{{ user.points }} ball</span>
                  <span>★ {{ user.stars }}</span>
                </div>
              </div>

              <!-- Current User Rank Indicator -->
              <div class="p-3 bg-cyber-primary/10 rounded border border-cyber-primary/45 text-xs text-center font-mono relative">
                <span class="absolute -top-2 left-2 px-1 bg-cyber-bg text-cyber-primary text-[9px] uppercase">Mening o'rnim</span>
                <div class="text-lg font-bold text-cyber-primary">#{{ surrounding.currentUserRank || surrounding.currentTeamRank || '999+' }}</div>
                <div class="text-[10px] text-slate-300 mt-0.5">Ballar: {{ authStore.user?.points || 0 }}</div>
              </div>

              <!-- Users Below -->
              <div v-for="user in surrounding.below" :key="user._id" class="p-3 bg-white/5 rounded border border-white/5 text-xs opacity-75">
                <div class="flex justify-between font-mono">
                  <span class="text-cyber-secondary">#{{ user.ranking }}</span>
                  <span class="font-bold text-white">{{ user.username || user.name }}</span>
                </div>
                <div class="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>{{ user.points }} ball</span>
                  <span>★ {{ user.stars }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import api from '../utils/api.js';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();

const activeTab = ref('users');
const userLeaderboard = ref([]);
const teamLeaderboard = ref([]);
const surrounding = ref({ currentUserRank: null, currentTeamRank: null, above: [], below: [] });

const currentTargetId = computed(() => {
  return activeTab.value === 'users' ? authStore.user?.id : null; // can be adapted for team
});

const loadLeaderboard = async () => {
  try {
    if (activeTab.value === 'users') {
      const res = await api.get('/leaderboards/users');
      userLeaderboard.value = res.data.data.leaderboard;
      surrounding.value = res.data.data.surrounding;
    } else {
      const res = await api.get('/leaderboards/teams');
      teamLeaderboard.value = res.data.data.leaderboard;
      surrounding.value = res.data.data.surrounding;
    }
  } catch (error) {
    toast.error('Reytinglarni yuklab bo\'lmadi. Tarmoqqa ulanish xatosi.');
  }
};

onMounted(() => {
  loadLeaderboard();
});

watch(activeTab, () => {
  loadLeaderboard();
});
</script>
