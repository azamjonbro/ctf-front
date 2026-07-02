<template>
  <div class="min-h-screen bg-cyber-bg text-slate-200">


    <!-- Main Container -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div class="border-b border-white/5 pb-4">
        <h1 class="text-2xl font-bold font-mono text-white">// XAKATONLAR</h1>
        <p class="text-xs text-slate-400">Vaqt bilan cheklangan jamoaviy musobaqalar. Ro'yxatdan o'tgan jamoalar maxsus peshqadamlar jadvali uchun kurashadilar.</p>
      </div>

      <!-- Hackathons Feed -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="h in hackathons"
          :key="h._id"
          class="rounded-lg glass-panel overflow-hidden border border-white/10 flex flex-col justify-between"
        >
          <div class="h-40 bg-slate-800 relative">
            <img v-if="h.coverImage" :src="h.coverImage" class="w-full h-full object-cover" alt="Cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-cyber-bg to-transparent"></div>
            <div class="absolute bottom-4 left-6">
              <span class="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded font-bold"
                :class="{
                  'bg-cyber-primary text-[#0B1020]': h.status === 'running',
                  'bg-cyber-secondary text-[#0B1020]': h.status === 'open',
                  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30': h.status === 'closed',
                  'bg-slate-700 text-slate-300': h.status === 'finished'
                }"
              >
                {{ h.status === 'running' ? 'faol' : h.status === 'open' ? 'ochiq' : h.status === 'closed' ? 'yopilgan' : 'yakunlangan' }}
              </span>
              <h2 class="text-xl font-bold text-white font-mono mt-1 uppercase">{{ h.name }}</h2>
            </div>
          </div>

          <div class="p-6 space-y-4">
            <p class="text-xs text-slate-400 leading-relaxed">{{ h.description }}</p>

            <div class="grid grid-cols-2 gap-4 font-mono text-[10px] text-slate-400">
              <div>
                <span class="block text-slate-500 uppercase">Boshlanadi</span>
                <span class="text-slate-300 font-semibold">{{ new Date(h.hackathonStart).toLocaleString() }}</span>
              </div>
              <div>
                <span class="block text-slate-500 uppercase">Tugaydi</span>
                <span class="text-slate-300 font-semibold">{{ new Date(h.hackathonEnd).toLocaleString() }}</span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="border-t border-white/5 pt-4 flex items-center justify-between">
              <div v-if="h.status !== 'finished'" class="text-xs font-mono">
                <span class="text-[9px] text-slate-500 block uppercase">
                  {{ h.phase === 'hackathon_starts' ? 'boshlanishiga qoldi' : h.phase === 'hackathon_ends' ? 'tugashiga qoldi' : 'vaqt qolmadi' }}
                </span>
                <span class="font-bold text-cyber-secondary text-sm">{{ formatCountdown(h.countdownSeconds) }}</span>
              </div>
              <div v-else class="text-xs text-slate-500 font-mono">TADBIR YAKUNLANDI</div>

              <div class="flex space-x-2">
                <button
                  @click="toggleParticipants(h._id)"
                  class="px-3 py-1.5 rounded font-mono font-bold text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition flex items-center"
                >
                  {{ expandedHackathons[h._id] ? 'JAMOALARNI YASHIRISH' : 'JAMOALARNI KO\'RISH' }}
                </button>
                <button
                  v-if="h.status === 'open' && !isRegistered(h._id)"
                  @click="registerTeam(h._id)"
                  class="px-4 py-1.5 rounded font-mono font-bold text-[10px] bg-cyber-secondary hover:bg-cyber-secondary/90 text-[#0B1020] transition"
                >
                  JAMOANI RO'YXATDAN O'TKAZISH
                </button>
                <span
                  v-else-if="h.status === 'open' && isRegistered(h._id)"
                  class="px-4 py-1.5 rounded font-mono font-bold text-[10px] bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/40 flex items-center cursor-default uppercase"
                >
                  Ro'yxatdan o'tgan
                </span>
                <span
                  v-else-if="h.status === 'closed' && isRegistered(h._id)"
                  class="px-4 py-1.5 rounded font-mono font-bold text-[10px] bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/40 flex items-center cursor-default uppercase"
                >
                  Ro'yxatdan o'tgan
                </span>
                <span
                  v-else-if="h.status === 'closed' && !isRegistered(h._id)"
                  class="px-4 py-1.5 rounded font-mono font-bold text-[10px] bg-slate-700/20 text-slate-500 border border-slate-700/40 flex items-center cursor-default uppercase font-mono"
                >
                  Yopiq (Closed)
                </span>
                <button
                  v-if="h.status === 'running' || h.status === 'finished'"
                  @click="enterHackathon(h._id)"
                  class="px-4 py-1.5 rounded font-mono font-bold text-[10px] bg-cyber-primary hover:bg-cyber-primary/90 text-[#0B1020] transition"
                >
                  ARENAGA KIRISH
                </button>
              </div>
            </div>
          </div>

          <!-- Collapsible Registered Teams Table -->
          <div v-if="expandedHackathons[h._id]" class="border-t border-white/10 bg-slate-950/40 p-5 transition-all duration-300">
            <h3 class="text-xs font-mono font-bold text-cyber-secondary mb-3 uppercase tracking-wider">// RO'YXATDAN O'TGAN JAMOALAR ({{ registeredTeams[h._id]?.length || 0 }})</h3>
            <div v-if="!registeredTeams[h._id] || registeredTeams[h._id].length === 0" class="text-xs font-mono text-slate-500 py-2">
              Hali jamoalar ro'yxatdan o'tmadi.
            </div>
            <div v-else class="overflow-x-auto">
              <table class="w-full text-left font-mono text-[11px] border-collapse">
                <thead>
                  <tr class="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th class="py-2 pr-2">Jamoa nomi</th>
                    <th class="py-2 px-2">Sardor</th>
                    <th class="py-2 px-2 text-center">A'zolar</th>
                    <th class="py-2 pl-2 text-right">Ballar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="team in registeredTeams[h._id]" :key="team._id" class="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td class="py-2.5 pr-2 font-bold text-white flex items-center space-x-1">
                      <span>{{ team.name }}</span>
                      <span v-if="myTeam && myTeam._id === team._id" class="bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30 px-1 py-0.2 rounded text-[8px] uppercase font-bold ml-1">Siz</span>
                    </td>
                    <td class="py-2.5 px-2 text-slate-300">
                      {{ team.leaderId?.username || 'Noma\'lum' }}
                    </td>
                    <td class="py-2.5 px-2 text-center text-slate-300">
                      <span class="inline-block px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold" :title="team.members?.map(m => m.username).join(', ')">
                        {{ team.members?.length || 0 }}
                      </span>
                    </td>
                    <td class="py-2.5 pl-2 text-right font-bold text-cyber-secondary">
                      {{ team.points }} ball
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '../utils/api.js';

const router = useRouter();
const toast = useToast();
const hackathons = ref([]);
const myTeam = ref(null);
const registeredTeams = ref({});
const expandedHackathons = ref({});
const countdownInterval = ref(null);

const startCountdownTimer = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
  }
  countdownInterval.value = setInterval(() => {
    let hasZeroed = false;
    hackathons.value.forEach(h => {
      if (h.countdownSeconds > 0) {
        h.countdownSeconds--;
        if (h.countdownSeconds === 0) {
          hasZeroed = true;
        }
      }
    });
    if (hasZeroed) {
      loadHackathons();
    }
  }, 1000);
};

const formatCountdown = (secs) => {
  const d = Math.floor(secs / (3600 * 24));
  const h = Math.floor((secs % (3600 * 24)) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return `${d}k ${h}s ${m}d`;
};

const isRegistered = (hackathonId) => {
  if (!myTeam.value || !myTeam.value.hackathonsJoined) return false;
  return myTeam.value.hackathonsJoined.includes(hackathonId);
};

const loadMyTeam = async () => {
  try {
    const res = await api.get('/teams/me');
    myTeam.value = res.data.data;
  } catch (error) {
    myTeam.value = null;
  }
};

const loadHackathons = async () => {
  try {
    const res = await api.get('/hackathons');
    hackathons.value = res.data.data;
    startCountdownTimer();
  } catch (error) {
    toast.error('Xakatonlarni yuklab bo\'lmadi.');
  }
};

const fetchRegisteredTeams = async (hackathonId) => {
  try {
    const res = await api.get(`/hackathons/${hackathonId}/registered-teams`);
    registeredTeams.value[hackathonId] = res.data.data;
  } catch (error) {
    toast.error('Ro\'yxatdan o\'tgan jamoalarni yuklab bo\'lmadi.');
  }
};

const toggleParticipants = async (hackathonId) => {
  if (expandedHackathons.value[hackathonId]) {
    expandedHackathons.value[hackathonId] = false;
  } else {
    await fetchRegisteredTeams(hackathonId);
    expandedHackathons.value[hackathonId] = true;
  }
};

const registerTeam = async (hackathonId) => {
  try {
    await api.post(`/teams/register-hackathon/${hackathonId}`);
    toast.success('Jamoangiz muvaffaqiyatli ro\'yxatdan o\'tkazildi!');
    await loadMyTeam();
    await loadHackathons();
    await fetchRegisteredTeams(hackathonId);
    expandedHackathons.value[hackathonId] = true;
  } catch (error) {
    const msg = error?.error?.message || 'Ro\'yxatdan o\'tish muvaffaqiyatsiz tugadi: Jamoa sardori ekanligingiz va kamida 3 a\'zoga ega ekanligingizni tekshiring.';
    toast.error(msg);
  }
};

const enterHackathon = (hackathonId) => {
  router.push(`/hackathons/${hackathonId}`);
};

onMounted(() => {
  loadHackathons();
  loadMyTeam();
});

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
  }
});
</script>
