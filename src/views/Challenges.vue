<template>
  <div class="min-h-screen bg-cyber-bg text-slate-200">


    <!-- Main Container -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div class="border-b border-white/5 pb-4">
        <h1 class="text-2xl font-bold font-mono text-white">// DOIMIY TOPSHIRIQLAR</h1>
        <p class="text-xs text-slate-400">Skripting, veb, tarmoq va tizimlar bo'yicha ko'nikmalarni oshiring. Global reytingga ta'sir qiladi.</p>
      </div>

      <!-- Challenges Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="c in challenges"
          :key="c._id"
          class="p-6 rounded-lg bg-cyber-card border border-white/5 flex flex-col justify-between h-[180px] hover:border-cyber-primary/40 transition hover:-translate-y-0.5"
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
            <h2 class="text-lg font-bold text-white font-mono uppercase mt-2 truncate">{{ c.title }}</h2>
            <p class="text-xs text-slate-400 line-clamp-2 mt-1">{{ c.shortDescription }}</p>
          </div>

          <div class="border-t border-white/5 pt-3 mt-3 flex justify-between items-center text-xs">
            <span class="text-[10px] font-mono text-slate-500">Muallif: {{ c.author?.username || 'Tizim' }}</span>
            <button
              @click="enterChallenge(c._id)"
              class="px-4 py-1.5 rounded font-mono font-bold text-[10px] tracking-wider text-[#0B1020] bg-cyber-primary hover:bg-cyber-primary/95 transition"
            >
              TOPSHIRIQNI BOSHLASH
            </button>
          </div>
        </div>
        
        <div v-if="challenges.length === 0" class="col-span-full py-16 text-center text-slate-500 font-mono text-sm space-y-2">
          <svg class="mx-auto h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
          <p>Ma'lumotlar bazasida faol doimiy topshiriqlar topilmadi.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useChallengeStore } from '../stores/challenge.store.js';

const router = useRouter();
const toast = useToast();
const challengeStore = useChallengeStore();

const challenges = computed(() => challengeStore.challenges);

const loadChallenges = async () => {
  try {
    await challengeStore.fetchChallenges();
  } catch (error) {
    toast.error('Topshiriqlarni yuklab bo\'lmadi.');
  }
};

const enterChallenge = (challengeId) => {
  router.push(`/challenges/${challengeId}`);
};

onMounted(() => {
  loadChallenges();
});
</script>
