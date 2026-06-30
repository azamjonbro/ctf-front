<template>
  <div class="min-h-screen bg-cyber-bg text-slate-200">


    <!-- Main Container -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div class="border-b border-white/5 pb-4">
        <h1 class="text-2xl font-bold font-mono text-white">// MENING JAMOA MARKAZIM</h1>
        <p class="text-xs text-slate-400">Operatsion guruhni yig'ing va topshiriqlarni yechishni muvofiqlashtiring.</p>
      </div>

      <!-- ACTIVE TEAM STATE -->
      <div v-if="team" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Team Details card -->
        <div class="glass-panel p-6 rounded-lg space-y-6">
          <div class="space-y-2">
            <span class="text-[10px] text-cyber-primary uppercase tracking-widest font-mono font-bold">// Jamoa ma'lumoti</span>
            <h2 class="text-2xl font-extrabold text-white font-mono uppercase truncate">{{ team.name }}</h2>
          </div>

          <div class="space-y-3 font-mono text-xs">
            <div class="flex justify-between border-b border-white/5 pb-2">
              <span class="text-slate-500">Global ball:</span>
              <span class="font-bold text-white">{{ team.points }} ball</span>
            </div>
            <div class="flex justify-between border-b border-white/5 pb-2">
              <span class="text-slate-500">Qo'lga kiritilgan yulduzlar:</span>
              <span class="font-bold text-cyber-primary">★ {{ team.stars }}</span>
            </div>
            <div class="flex justify-between border-b border-white/5 pb-2">
              <span class="text-slate-500">Jamoa o'rni:</span>
              <span class="font-bold text-cyber-secondary">#{{ team.ranking }}</span>
            </div>
          </div>

          <!-- Invite code block -->
          <div class="p-4 bg-white/5 rounded border border-white/5 space-y-2">
            <span class="text-[10px] text-slate-400 font-mono block">TAKTAK KODI (FAQAT SARDOR UCHUN)</span>
            <div class="flex items-center justify-between bg-cyber-bg border border-white/10 px-3 py-1.5 rounded">
              <span class="font-mono text-white text-xs select-all">{{ team.inviteCode }}</span>
              <span class="text-[10px] text-cyber-secondary uppercase font-bold select-none cursor-pointer" @click="copyCode">Nusxalash</span>
            </div>
          </div>

          <!-- Leave Team Button -->
          <div class="pt-4 border-t border-white/5">
            <button
              @click="handleLeaveTeam"
              :disabled="isLeaving"
              class="w-full py-2 bg-red-500/20 hover:bg-red-500/35 border border-red-500/40 text-red-200 text-xs font-bold font-mono rounded transition disabled:opacity-50"
            >
              {{ isLeaving ? 'JAMOADAN CHIQILMOQDA...' : "JAMOANI TARK ETISH" }}
            </button>
          </div>
        </div>

        <!-- Roster Column -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-lg space-y-4">
          <h3 class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase">// Operatsion guruh ({{ team.members.length }})</h3>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b border-white/10 text-xs font-mono uppercase text-slate-500 tracking-wider">
                  <th class="py-2.5 px-3">Foydalanuvchi nomi</th>
                  <th class="py-2.5 px-3">Ballar</th>
                  <th class="py-2.5 px-3">Yulduzlar</th>
                  <th class="py-2.5 px-3 text-right">Rol</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 text-slate-300">
                <tr v-for="m in team.members" :key="m._id" class="hover:bg-white/5 transition">
                  <td class="py-3 px-3 font-semibold text-white flex items-center space-x-2">
                    <span>{{ m.username }}</span>
                  </td>
                  <td class="py-3 px-3 font-mono">{{ m.points }}</td>
                  <td class="py-3 px-3 font-mono text-cyber-primary">★ {{ m.stars }}</td>
                  <td class="py-3 px-3 text-right font-mono text-xs">
                    <span v-if="team.leaderId._id === m._id" class="text-cyber-secondary font-bold">Sardor</span>
                    <span v-else class="text-slate-500">A'zo</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- NO TEAM STATE -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-8">
        <!-- Create Team Card -->
        <div class="glass-panel p-6 rounded-lg space-y-4 border border-cyber-primary/20">
          <h2 class="text-xl font-bold font-mono text-white uppercase tracking-wider">// YANGI JAMOA YARATISH</h2>
          <p class="text-xs text-slate-400">Yangi jamoa konteynerini ishga tushiring. Siz Jamoa Sardori etib tayinlanasiz.</p>
          
          <form @submit.prevent="handleCreateTeam" class="space-y-4">
            <div class="space-y-1">
              <label class="text-[10px] text-slate-500 font-mono block">Jamoa nomi</label>
              <input
                v-model="createName"
                type="text"
                placeholder="Team G-Force"
                class="w-full bg-cyber-card border border-white/10 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyber-primary"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full py-2 bg-cyber-primary text-[#0B1020] text-xs font-bold font-mono rounded transition hover:bg-cyber-primary/90"
            >
              JAMOA YARATISH
            </button>
          </form>
        </div>

        <!-- Join Team Card -->
        <div class="glass-panel p-6 rounded-lg space-y-4 border border-cyber-secondary/20">
          <h2 class="text-xl font-bold font-mono text-white uppercase tracking-wider">// JAMOAGA QO'SHILISH</h2>
          <p class="text-xs text-slate-400">Mavjud jamoa sardori tomonidan yuborilgan 12 ta belgidan iborat xavfsiz taklif kodini kiriting.</p>

          <form @submit.prevent="handleJoinTeam" class="space-y-4">
            <div class="space-y-1">
              <label class="text-[10px] text-slate-500 font-mono block">Taklif kodi</label>
              <input
                v-model="joinInviteCode"
                type="text"
                placeholder="4F8B3A..."
                class="w-full bg-cyber-card border border-white/10 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyber-secondary"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full py-2 bg-cyber-secondary text-[#0B1020] text-xs font-bold font-mono rounded transition hover:bg-cyber-secondary/90"
            >
              JAMOAGA QO'SHILISH
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import api from '../utils/api.js';

const toast = useToast();
const team = ref(null);

const createName = ref('');
const joinInviteCode = ref('');

const loadTeam = async () => {
  try {
    const res = await api.get('/teams/me');
    team.value = res.data.data;
  } catch (error) {
    team.value = null;
  }
};

const handleCreateTeam = async () => {
  if (!createName.value) return;
  try {
    const res = await api.post('/teams', { name: createName.value });
    toast.success(res.data.message);
    loadTeam();
  } catch (error) {
    const msg = error?.error?.message || 'Jamoa yaratish muvaffaqiyatsiz tugadi';
    toast.error(msg);
  }
};

const handleJoinTeam = async () => {
  if (!joinInviteCode.value) return;
  try {
    const res = await api.post('/teams/join', { inviteCode: joinInviteCode.value });
    toast.success(res.data.message);
    loadTeam();
  } catch (error) {
    const msg = error?.error?.message || 'Jamoaga qo\'shilish muvaffaqiyatsiz tugadi: taklif kodini tekshiring.';
    toast.error(msg);
  }
};

const isLeaving = ref(false);

const handleLeaveTeam = async () => {
  const confirmLeave = confirm('Haqiqatan ham ushbu jamoani tark etmoqchimisiz? Agar siz sardor bo\'lsangiz, sardorlik boshqa a\'zoga o\'tadi. Agar oxirgi a\'zo bo\'lsangiz, jamoa o\'chib ketadi.');
  if (!confirmLeave) return;

  isLeaving.value = true;
  try {
    const res = await api.post('/teams/leave');
    toast.success(res.data.message || 'Jamoani muvaffaqiyatli tark etdingiz!');
    loadTeam();
  } catch (error) {
    const msg = error?.error?.message || 'Jamoani tark etish muvaffaqiyatsiz tugadi';
    toast.error(msg);
  } finally {
    isLeaving.value = false;
  }
};

const copyCode = () => {
  if (team.value?.inviteCode) {
    navigator.clipboard.writeText(team.value.inviteCode);
    toast.info('Taklif kodi buferga nusxalandi!');
  }
};

onMounted(() => {
  loadTeam();
});
</script>
