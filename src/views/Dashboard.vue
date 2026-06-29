<template>
  <div class="min-h-screen bg-[#0B1020] text-slate-200">


    <!-- Main Container -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <!-- Welcome Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between p-6 rounded-lg glass-panel border border-cyber-primary/20">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white font-mono">
            Xush kelibsiz, operator <span class="text-cyber-primary">{{ stats?.username || authStore.user?.username }}</span>
          </h1>
          <p class="text-xs text-slate-400 mt-1">Holat: Faol | Tugun ulanishi: Xavfsiz</p>
        </div>
        
        <div class="mt-4 md:mt-0 flex items-center space-x-4">
          <div class="text-right">
            <span class="text-xs text-slate-400 uppercase tracking-wider block">Global o'rin</span>
            <span class="text-2xl font-bold text-cyber-secondary">#{{ stats?.ranking && stats?.ranking !== 999999 ? stats?.ranking : (authStore.user?.ranking && authStore.user?.ranking !== 999999 ? authStore.user?.ranking : 'Reytingsiz') }}</span>
          </div>
        </div>
      </div>

      <!-- Quick stats grids -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-lg bg-[#131C35] border border-white/5 space-y-2">
          <span class="text-xs text-slate-400 block uppercase font-semibold">Umumiy ballar</span>
          <span class="text-3xl font-extrabold text-white font-mono tracking-tight">{{ stats !== null ? stats.points : (authStore.user?.points || 0) }}</span>
        </div>
        
        <div class="p-5 rounded-lg bg-[#131C35] border border-white/5 space-y-2">
          <span class="text-xs text-slate-400 block uppercase font-semibold">Qo'lga kiritilgan yulduzlar</span>
          <span class="text-3xl font-extrabold text-cyber-primary font-mono tracking-tight">★ {{ stats !== null ? stats.stars : (authStore.user?.stars || 0) }}</span>
        </div>

        <div class="p-5 rounded-lg bg-[#131C35] border border-white/5 space-y-2">
          <span class="text-xs text-slate-400 block uppercase font-semibold">Yechilganlar</span>
          <span class="text-3xl font-extrabold text-cyber-secondary font-mono tracking-tight">{{ stats !== null ? stats.solves : 0 }}</span>
        </div>

        <div class="p-5 rounded-lg bg-[#131C35] border border-white/5 space-y-2">
          <span class="text-xs text-slate-400 block uppercase font-semibold">Faol jamoa</span>
          <span class="text-sm font-bold text-white block truncate mt-2 font-mono text-cyber-accent">{{ stats?.teamName || 'Jamoa yo\'q' }}</span>
        </div>
      </div>

      <!-- Chart analytics and real-time solves feeds -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Analytics Column -->
        <div class="lg:col-span-2 p-6 rounded-lg glass-panel space-y-4">
          <h2 class="text-lg font-bold font-mono border-b border-white/5 pb-2 text-white">// KO'NIKMALAR PROFILI</h2>
          <!-- Apex Radar Chart -->
          <apexchart type="radar" height="300" :options="chartOptions" :series="chartSeries"></apexchart>
        </div>

        <!-- Real-time Live Feeds -->
        <div class="p-6 rounded-lg glass-panel flex flex-col h-[400px]">
          <h2 class="text-lg font-bold font-mono border-b border-white/5 pb-3 text-white flex items-center justify-between">
            <span>// JONLI FAOLIYAT TASMASI</span>
            <span class="h-2 w-2 rounded-full bg-cyber-primary animate-pulse"></span>
          </h2>

          <div class="flex-1 overflow-y-auto mt-4 space-y-3 pr-2">
            <div v-for="(solve, i) in socketStore.liveSolves.slice(0, 8)" :key="i" class="p-3 rounded bg-white/5 border-l-2 border-cyber-primary text-xs space-y-1">
              <div class="flex justify-between items-center text-slate-400">
                <span class="font-bold text-slate-200 font-mono">{{ solve.teamName }}</span>
                <span>hozirgina yechdi</span>
              </div>
              <p class="font-semibold text-cyber-secondary">{{ solve.challengeTitle }}</p>
              <div class="flex justify-between items-center text-[10px] text-slate-500">
                <span>+{{ solve.points }} Ball</span>
                <span>★ {{ solve.stars }}</span>
              </div>
            </div>
            
            <div v-if="socketStore.liveSolves.length === 0" class="h-full flex flex-col items-center justify-center text-center text-slate-500 py-10 space-y-2">
              <svg class="h-8 w-8 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span class="text-xs">Jonli flag yechilishlari kutilmoqda...</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { useSocketStore } from '../stores/socket.js';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import VueApexCharts from 'vue3-apexcharts';
import api from '../utils/api.js';

const authStore = useAuthStore();
const socketStore = useSocketStore();
const toast = useToast();
const router = useRouter();

// Register apexchart locally to make code clean
const apexchart = VueApexCharts;

const stats = ref(null);

// Skill categories radar chart config
const chartSeries = ref([{
  name: 'Yechilganlar soni',
  data: [0, 0, 0, 0, 0]
}]);

const chartOptions = ref({
  chart: {
    toolbar: { show: false },
    background: 'transparent'
  },
  colors: ['#00FF88'],
  xaxis: {
    categories: ['Web Exploitation', 'Reverse Engineering', 'Cryptography', 'Forensics', 'PWN'],
    labels: {
      style: {
        colors: ['#64748B', '#64748B', '#64748B', '#64748B', '#64748B'],
        fontFamily: 'Inter'
      }
    }
  },
  theme: { mode: 'dark' },
  markers: { size: 4 },
  stroke: { width: 2 },
  fill: { opacity: 0.3 }
});

const loadDashboardStats = async () => {
  try {
    const res = await api.get('/users/dashboard-stats');
    stats.value = res.data.data;
    
    // Update radar chart data
    const skills = res.data.data.skillsProfile || {};
    chartSeries.value = [{
      name: 'Yechilganlar soni',
      data: [
        skills['Web Exploitation'] || 0,
        skills['Reverse Engineering'] || 0,
        skills['Cryptography'] || 0,
        skills['Forensics'] || 0,
        skills['PWN'] || 0
      ]
    }];
  } catch (error) {
    toast.error('Operator statistikasini yuklab bo\'lmadi');
  }
};

onMounted(() => {
  loadDashboardStats();
});

const logout = async () => {
  try {
    await authStore.userLogout();
    toast.success('Tizimdan muvaffaqiyatli chiqildi');
    router.push('/login');
  } catch (error) {
    toast.error('Tizimdan chiqish muvaffaqiyatsiz tugadi');
  }
};
</script>
