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
            <table class="w-full text-left text-sm border-collapse font-mono">
              <thead>
                <tr class="border-b border-white/10 text-xs font-mono uppercase text-slate-400 bg-white/5">
                  <th class="py-3 px-4">🏆 O'rin</th>
                  <th class="py-3 px-4">Nomi</th>
                  <th class="py-3 px-4 text-center">⚡ Ballar</th>
                  <th class="py-3 px-4 text-center">🚩 Flaglar</th>
                  <th class="py-3 px-4 text-center">📝 Savollar</th>
                  <th class="py-3 px-4 text-center">✅ Yechilgan</th>
                  <th class="py-3 px-4">⏱️ Tugallash vaqti</th>
                  <th class="py-3 px-4 text-center">📊 O'zgarish</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr
                  v-for="(item, index) in (activeTab === 'users' ? userLeaderboard : teamLeaderboard)"
                  :key="item._id"
                  class="hover:bg-white/5 transition duration-150"
                  :class="{
                    'bg-cyber-primary/5 border-l-2 border-cyber-primary': item._id === currentEntityId,
                    'bg-yellow-500/2 border-l border-yellow-500/10': index === 0 && item._id !== currentEntityId,
                    'bg-cyber-secondary/2 border-l border-cyber-secondary/10': index === 1 && item._id !== currentEntityId,
                    'bg-cyber-accent/2 border-l border-cyber-accent/10': index === 2 && item._id !== currentEntityId,
                  }"
                >
                  <td class="py-3.5 px-4 font-bold">
                    <span :class="{
                      'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]': index === 0,
                      'text-cyber-secondary drop-shadow-[0_0_6px_rgba(0,180,255,0.4)]': index === 1,
                      'text-cyber-accent drop-shadow-[0_0_6px_rgba(255,0,128,0.4)]': index === 2,
                      'text-slate-400': index > 2
                    }">
                      #{{ item.ranking && item.ranking !== 999999 ? item.ranking : index + 1 }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-bold text-white">
                    <div class="flex items-center space-x-2">
                      <span v-if="activeTab === 'users'" class="text-base select-none" :title="item.country || 'Global'">
                        {{ getCountryFlag(item.country) }}
                      </span>
                      <span>{{ activeTab === 'users' ? item.username : item.name }}</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 text-center font-bold text-cyber-secondary">{{ item.points }} Pts</td>
                  <td class="py-3.5 px-4 text-center text-cyber-primary font-bold">{{ item.solvedFlagsCount || 0 }}</td>
                  <td class="py-3.5 px-4 text-center text-cyber-accent font-bold">{{ item.solvedQuestionsCount || 0 }}</td>
                  <td class="py-3.5 px-4 text-center text-slate-300">{{ item.totalSolved || 0 }}</td>
                  <td class="py-3.5 px-4 text-slate-400 text-xs">
                    {{ activeTab === 'users' ? (item.finishTime ? new Date(item.finishTime).toLocaleString() : '—') : (item.finishTime || '—') }}
                  </td>
                  <td class="py-3.5 px-4 text-center font-bold text-xs">
                    <span v-if="item.positionChange > 0" class="text-cyber-primary">+{{ item.positionChange }} ▲</span>
                    <span v-else-if="item.positionChange < 0" class="text-cyber-danger">{{ item.positionChange }} ▼</span>
                    <span v-else class="text-slate-600">-</span>
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
import { useAuthStore } from '../stores/auth.store.js';
import { useLeaderboardStore } from '../stores/leaderboard.store.js';
import { useCurrentEntity } from '../composables/useCurrentEntity.js';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const leaderboardStore = useLeaderboardStore();
const toast = useToast();

const activeTab = ref('users');

const { currentEntityId } = useCurrentEntity(activeTab);

const userLeaderboard = computed(() => leaderboardStore.userLeaderboard);
const teamLeaderboard = computed(() => leaderboardStore.teamLeaderboard);
const surrounding = computed(() => leaderboardStore.surrounding);

const loadLeaderboard = async () => {
  try {
    if (activeTab.value === 'users') {
      await leaderboardStore.fetchUserLeaderboard();
    } else {
      await leaderboardStore.fetchTeamLeaderboard();
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

const getCountryFlag = (country) => {
  if (!country) return '🌐';
  const c = country.toLowerCase().trim();
  if (c === 'uzbekistan' || c === 'uz') return '🇺🇿';
  if (c === 'united states' || c === 'us' || c === 'usa') return '🇺🇸';
  if (c === 'russia' || c === 'ru') return '🇷🇺';
  if (c === 'kazakhstan' || c === 'kz') return '🇰🇿';
  if (c === 'turkey' || c === 'tr') return '🇹🇷';
  if (c === 'united kingdom' || c === 'uk' || c === 'gb') return '🇬🇧';
  if (c === 'germany' || c === 'de') return '🇩🇪';
  return '🌐';
};
</script>
