<template>
  <div class="min-h-screen bg-[#0B1020] text-slate-200 relative overflow-hidden">
    <!-- Subtle background binary code rain with dynamic opacity transition -->
    <canvas ref="matrixCanvas" class="absolute inset-0 transition-opacity duration-1000 pointer-events-none z-0" :class="isLoading ? 'opacity-[0.25]' : 'opacity-[0.05]'"></canvas>

    <!-- Hacker Loading State -->
    <div v-if="isLoading" class="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
      <div class="w-full max-w-md p-6 rounded-lg border border-cyber-primary/20 bg-[#0B1020]/90 glass-panel font-mono text-xs space-y-6 shadow-[0_0_50px_rgba(0,255,136,0.15)] relative overflow-hidden">
        <!-- Background decorative code logs -->
        <div class="absolute right-2 top-2 opacity-5 text-[8px] select-none pointer-events-none">
          0101010101010101010101010101
          1010101010101010101010101010
          0101010101010101010101010101
        </div>

        <!-- Terminal Header -->
        <div class="flex items-center justify-between border-b border-cyber-primary/20 pb-3 text-cyber-primary">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-cyber-primary animate-ping"></span>
            <span class="font-bold tracking-widest text-shadow-neon">// ALGORITM.CTF SECURE TERMINAL</span>
          </div>
          <span class="text-[9px] animate-pulse">STATUS: INITIALIZING...</span>
        </div>
        
        <!-- Terminal Console Text -->
        <div class="space-y-2 text-slate-300 min-h-[100px] flex flex-col justify-end">
          <div class="flex items-center space-x-2">
            <span class="text-cyber-primary">></span>
            <span>INITIALIZING DECRYPTION PROTOCOLS...</span>
          </div>
          <div v-if="loadingProgress > 25" class="flex items-center space-x-2">
            <span class="text-cyber-primary">></span>
            <span>CONNECTING TO DATABASE SECTOR [U-298]... <span class="text-cyber-primary font-bold">OK</span></span>
          </div>
          <div v-if="loadingProgress > 50" class="flex items-center space-x-2">
            <span class="text-cyber-primary">></span>
            <span>BYPASSING LOCAL CONTROLS... <span class="text-cyber-primary font-bold">SUCCESS</span></span>
          </div>
          <div v-if="loadingProgress > 75" class="flex items-center space-x-2">
            <span class="text-cyber-primary">></span>
            <span>DECRYPTING OPERATOR PROFILE DATA... <span class="text-cyber-secondary font-bold">DONE</span></span>
          </div>
        </div>

        <!-- System Diagnostics Grid -->
        <div class="grid grid-cols-2 gap-3 text-[10px] border-t border-b border-white/10 py-3 font-mono text-slate-400">
          <div class="flex justify-between pr-2 border-r border-white/5">
            <span>OPERATOR IP:</span>
            <span class="text-white font-bold">127.0.0.1</span>
          </div>
          <div class="flex justify-between pl-2">
            <span>PROTOCOL:</span>
            <span class="text-cyber-primary font-bold">ALGORITM.CTF</span>
          </div>
          <div class="flex justify-between pr-2 border-r border-white/5">
            <span>DECRYPT:</span>
            <span class="text-cyber-secondary font-bold">AES-256</span>
          </div>
          <div class="flex justify-between pl-2">
            <span>STATUS:</span>
            <span class="text-cyber-primary font-bold">ONLINE</span>
          </div>
        </div>
        
        <!-- Loader Animation -->
        <div class="space-y-1">
          <div class="flex justify-between text-[10px] text-cyber-primary font-mono font-bold">
            <span>[ SYSTEM BOOTSTRAPPING ]</span>
            <span>{{ loadingProgress }}%</span>
          </div>
          <div class="w-full bg-slate-900 border border-cyber-primary/20 h-3 p-0.5 rounded overflow-hidden relative">
            <div class="bg-gradient-to-r from-cyber-primary to-cyber-secondary h-full rounded-sm transition-all duration-150" :style="{ width: loadingProgress + '%' }"></div>
          </div>
        </div>

        <div class="text-center text-[9px] text-slate-500 animate-pulse uppercase tracking-wider font-mono">
          SECURE CHANNEL ESTABLISHED // ENCRYPTED ACCESS ONLY
        </div>
      </div>
    </div>

    <!-- Main Container -->
    <main v-else-if="profile" class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 relative z-10">
      <!-- Profile Header -->
      <div class="p-6 rounded-lg glass-panel border border-white/10 flex flex-col md:flex-row items-center gap-6">
        <div class="h-20 w-20 rounded-full border-2 border-cyber-primary bg-cyber-card flex items-center justify-center overflow-hidden">
          <img v-if="profile.profilePicture" :src="profile.profilePicture" class="w-full h-full object-cover" />
          <span v-else class="text-3xl font-extrabold text-cyber-primary font-mono">
            {{ profile.username.charAt(0).toUpperCase() }}
          </span>
        </div>
        
        <div class="text-center md:text-left space-y-1 flex-1">
          <div class="flex items-center gap-3 justify-center md:justify-start">
            <h1 class="text-2xl font-bold text-white font-mono uppercase tracking-wider">{{ profile.username }}</h1>
            <button v-if="isOwnProfile" @click="openEditModal" class="px-2 py-0.5 bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-primary text-[10px] rounded font-mono hover:bg-cyber-primary/20 transition">
              PROFILNI TAHRIRLASH
            </button>
          </div>
          <p class="text-xs text-slate-400">OPERATOR | MAMLAKAT: {{ profile.country || 'Noma\'lum' }}</p>
          <p class="text-sm text-slate-300 max-w-md italic mt-2">"{{ profile.description || 'Tavsif kiritilmagan.' }}"</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-6 text-center font-mono">
          <div class="px-4 py-2 bg-white/5 rounded border border-white/5">
            <span class="text-[10px] text-slate-500 block uppercase">Global o'rin</span>
            <span class="text-lg font-bold text-cyber-secondary">#{{ profile.ranking }}</span>
          </div>
          <div class="px-4 py-2 bg-white/5 rounded border border-white/5">
            <span class="text-[10px] text-slate-500 block uppercase">Ballar</span>
            <span class="text-lg font-bold text-white">{{ profile.points }}</span>
          </div>
          <div class="px-4 py-2 bg-white/5 rounded border border-white/5 col-span-2 md:col-span-1">
            <span class="text-[10px] text-slate-500 block uppercase">Yulduzlar</span>
            <span class="text-lg font-bold text-cyber-primary">★ {{ profile.stars }}</span>
          </div>
        </div>
      </div>

      <!-- Stats Breakdowns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- User statistics counts -->
        <div class="glass-panel p-6 rounded-lg space-y-4">
          <h2 class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase">// Yechimlar tahlili</h2>
          
          <div class="space-y-4 font-mono text-xs">
            <div class="flex justify-between items-center">
              <span class="text-slate-400">Jami yechilgan savollar:</span>
              <span class="font-bold text-white">{{ profile.statistics?.totalSolved || 0 }}</span>
            </div>
            
            <div class="space-y-1">
              <div class="flex justify-between items-center text-[10px] text-slate-400 uppercase">
                <span>Oson yechimlar</span>
                <span class="text-cyber-primary">{{ profile.statistics?.easySolved || 0 }} yechilgan</span>
              </div>
              <div class="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
                <div class="bg-cyber-primary h-full" :style="{ width: `${Math.min(100, (profile.statistics?.easySolved || 0) * 10)}%` }"></div>
              </div>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between items-center text-[10px] text-slate-400 uppercase">
                <span>O'rtacha yechimlar</span>
                <span class="text-cyber-secondary">{{ profile.statistics?.mediumSolved || 0 }} yechilgan</span>
              </div>
              <div class="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
                <div class="bg-cyber-secondary h-full" :style="{ width: `${Math.min(100, (profile.statistics?.mediumSolved || 0) * 10)}%` }"></div>
              </div>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between items-center text-[10px] text-slate-400 uppercase">
                <span>Qiyin yechimlar</span>
                <span class="text-cyber-danger">{{ profile.statistics?.hardSolved || 0 }} yechilgan</span>
              </div>
              <div class="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
                <div class="bg-cyber-danger h-full" :style="{ width: `${Math.min(100, (profile.statistics?.hardSolved || 0) * 10)}%` }"></div>
              </div>
            </div>

            <div class="flex justify-between items-center border-t border-white/5 pt-3">
              <span class="text-slate-400">Ishlatilgan maslahatlar:</span>
              <span class="font-bold text-cyber-danger">{{ profile.statistics?.hintsUsed || 0 }} ta ishlatilgan</span>
            </div>
          </div>
        </div>

        <!-- GitHub Style Activity Grid -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-lg space-y-4">
          <h2 class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase">// Operator faoliyati taqvimi</h2>
          
          <!-- Simple CSS Git grid display mock -->
          <div class="p-4 bg-cyber-bg/50 rounded border border-white/5">
            <div class="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto select-none" style="grid-template-columns: repeat(53, minmax(10px, 1fr));">
              <!-- Render 371 activity blocks (53 weeks * 7 days) -->
              <div
                v-for="day in calendarDays"
                :key="day.dateStr"
                class="w-2.5 h-2.5 rounded-sm transition"
                :class="getActivityColor(day.count)"
                :title="day.count > 0 ? `${day.dateStr}: ${day.count} ta faoliyat` : `${day.dateStr}: faoliyat yo'q`"
              ></div>
            </div>
            
            <div class="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-4">
              <span>Oxirgi 12 oylik faoliyat</span>
              <div class="flex items-center space-x-1">
                <span>Kamroq</span>
                <div class="w-2 h-2 rounded-sm bg-slate-800"></div>
                <div class="w-2 h-2 rounded-sm bg-cyber-primary/20"></div>
                <div class="w-2 h-2 rounded-sm bg-cyber-primary/50"></div>
                <div class="w-2 h-2 rounded-sm bg-cyber-primary"></div>
                <span>Ko'proq</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- History Sections -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- CTF History -->
        <div class="glass-panel p-6 rounded-lg space-y-4">
          <h2 class="text-sm font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-white border-b border-white/5 pb-2 uppercase tracking-widest">// ALGORITM.CTF ISHTIROK TARIXI</h2>
          
          <div v-if="profile.ctfHistory && profile.ctfHistory.length > 0" class="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            <div 
              v-for="ctf in profile.ctfHistory" 
              :key="ctf.challengeId" 
              class="p-4 bg-[#111625]/60 rounded border border-white/5 flex items-center justify-between hover:border-cyber-primary/30 transition group duration-300"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-white font-mono uppercase tracking-wider group-hover:text-cyber-primary transition duration-300">{{ ctf.title }}</span>
                  <span 
                    class="px-1.5 py-0.5 text-[9px] font-mono rounded"
                    :class="{
                      'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20': ctf.difficulty === 'easy',
                      'bg-cyber-secondary/10 text-cyber-secondary border border-cyber-secondary/20': ctf.difficulty === 'medium',
                      'bg-cyber-danger/10 text-cyber-danger border border-cyber-danger/20': ctf.difficulty === 'hard'
                    }"
                  >
                    {{ ctf.difficulty.toUpperCase() }}
                  </span>
                </div>
                <div class="text-[10px] text-slate-400 font-mono">
                  Kategoriya: {{ ctf.category }} | Savollar: {{ ctf.solvedQuestionsCount }}/{{ ctf.totalQuestions }}
                </div>
              </div>
              
              <div class="text-right font-mono space-y-1">
                <div class="text-xs font-bold text-white">{{ ctf.points }} BALL</div>
                <div class="text-[9px] text-cyber-primary flex items-center justify-end gap-1">
                  <span>★ {{ ctf.stars }}</span>
                  <span 
                    class="ml-2 px-1.5 py-0.5 rounded text-[8px] tracking-wider font-bold"
                    :class="ctf.status === 'completed' ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'"
                  >
                    {{ ctf.status === 'completed' ? 'TAMOM' : 'FAOLL' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="py-12 text-center text-xs text-slate-500 font-mono">
            Hech qanday CTF yechimlar tarixi topilmadi.
          </div>
        </div>

        <!-- Hackathon History -->
        <div class="glass-panel p-6 rounded-lg space-y-4">
          <h2 class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase">// Xakatonlar Natijalari</h2>
          
          <div v-if="profile.hackathonHistory && profile.hackathonHistory.length > 0" class="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            <div 
              v-for="hack in profile.hackathonHistory" 
              :key="hack.hackathonId" 
              class="p-4 bg-[#111625]/60 rounded border border-white/5 flex items-center justify-between hover:border-cyber-secondary/30 transition group duration-300"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-white font-mono uppercase tracking-wider group-hover:text-cyber-secondary transition duration-300">{{ hack.name }}</span>
                  <span 
                    class="px-1.5 py-0.5 text-[9px] font-mono rounded"
                    :class="{
                      'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20': hack.status === 'active',
                      'bg-slate-800 text-slate-400 border border-slate-700': hack.status === 'completed',
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20': hack.status === 'upcoming'
                    }"
                  >
                    {{ hack.status.toUpperCase() }}
                  </span>
                </div>
                <div class="text-[10px] text-slate-400 font-mono">
                  Challenges: {{ hack.solved }} ta yechilgan | Ishtirokchilar: {{ hack.totalTeams }} jamoa
                </div>
              </div>
              
              <div class="text-right font-mono space-y-1">
                <div 
                  class="text-sm font-black italic tracking-tighter"
                  :class="hack.rank <= 3 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.3)]' : 'text-slate-300'"
                >
                  {{ hack.rank ? `#${hack.rank} O'RIN` : 'Natijasiz' }}
                </div>
                <div class="text-[9px] text-slate-400">
                  {{ hack.points }} BALL
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="py-12 text-center text-xs text-slate-500 font-mono">
            Xakatonlarda ishtirok etilganlik tarixi topilmadi.
          </div>
        </div>
      </div>
    </main>

    <!-- Profile Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
      <div class="w-full max-w-md p-6 rounded-lg bg-[#0B1020] border border-white/10 glass-panel space-y-4">
        <h3 class="text-lg font-bold font-mono text-cyber-primary">// PROFIL MA'LUMOTLARINI TAHRIRLASH</h3>
        <form @submit.prevent="handleUpdateProfile" class="space-y-4 text-xs font-mono">
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-[10px] text-slate-400 uppercase">Ism</label>
              <input v-model="editForm.name" type="text" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-primary" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] text-slate-400 uppercase">Familiya</label>
              <input v-model="editForm.surname" type="text" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-primary" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-[10px] text-slate-400 uppercase">Yosh</label>
              <input v-model.number="editForm.age" type="number" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-primary" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] text-slate-400 uppercase">Mamlakat</label>
              <input v-model="editForm.country" type="text" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-primary" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] text-slate-400 uppercase">Holat/Biografiya tavsifi</label>
            <input v-model="editForm.description" type="text" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-primary" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] text-slate-400 uppercase">Profil rasmi</label>
            <div class="flex items-center gap-3">
              <input type="file" @change="onProfilePicUpload" accept="image/*" class="hidden" ref="profilePicInput" />
              <button type="button" @click="profilePicInput?.click()" class="px-3 py-1.5 bg-[#131C35] border border-white/10 rounded text-[10px] uppercase text-slate-300 font-mono">
                Rasm faylini tanlash
              </button>
              <span class="text-[10px] text-slate-500 truncate max-w-[200px]" v-if="editForm.profilePicture">
                {{ editForm.profilePicture.split('/').pop() }}
              </span>
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] text-slate-400 uppercase">Ma'lumotlar/Qurilma sozlamalari</label>
            <textarea v-model="editForm.information" rows="3" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-primary" placeholder="Qurilma sozlamalari haqida ma'lumot kiriting..."></textarea>
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="showEditModal = false" class="px-3 py-1.5 bg-white/5 rounded text-slate-300">BEKOR QILISH</button>
            <button type="submit" class="px-4 py-1.5 bg-cyber-primary text-[#0B1020] font-bold rounded">O'ZGARISHLARNI SAQLASH</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '../utils/api.js';
import { useAuthStore } from '../stores/auth.js';

const route = useRoute();
const toast = useToast();
const authStore = useAuthStore();
const profile = ref(null);
const calendarData = ref([]);

const isLoading = ref(true);
const loadingProgress = ref(0);
const matrixCanvas = ref(null);

const isOwnProfile = computed(() => {
  return authStore.user && profile.value && authStore.user.username.toLowerCase() === profile.value.username.toLowerCase();
});

const profilePicInput = ref(null);
const showEditModal = ref(false);
const editForm = ref({
  name: '',
  surname: '',
  age: null,
  country: '',
  description: '',
  information: '',
  profilePicture: ''
});

const onProfilePicUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  toast.info('Rasm yuklanmoqda...');
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await api.post('/ctfs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    editForm.value.profilePicture = res.data.data.url;
    toast.success('Rasm muvaffaqiyatli yuklandi!');
  } catch (error) {
    toast.error(error?.error?.message || 'Rasm yuklash muvaffaqiyatsiz tugadi');
  }
};

const openEditModal = () => {
  if (!profile.value) return;
  editForm.value = {
    name: profile.value.name || '',
    surname: profile.value.surname || '',
    age: profile.value.age || null,
    country: profile.value.country || '',
    description: profile.value.description || '',
    information: profile.value.information || '',
    profilePicture: profile.value.profilePicture || ''
  };
  showEditModal.value = true;
};

const handleUpdateProfile = async () => {
  try {
    const res = await api.put('/users/profile', editForm.value);
    toast.success(res.data.message);
    showEditModal.value = false;
    loadProfile();
  } catch (error) {
    const msg = error?.error?.message || 'Profilni yangilash muvaffaqiyatsiz tugadi';
    toast.error(msg);
  }
};

const loadProfile = async () => {
  isLoading.value = true;
  loadingProgress.value = 0;

  const progressInterval = setInterval(() => {
    if (loadingProgress.value < 90) {
      loadingProgress.value += Math.floor(Math.random() * 12) + 5;
    }
  }, 100);

  try {
    const res = await api.get(`/users/profile/${route.params.username}`);
    setTimeout(() => {
      clearInterval(progressInterval);
      loadingProgress.value = 100;
      profile.value = res.data.data;
      isLoading.value = false;
    }, 1200);
  } catch (error) {
    clearInterval(progressInterval);
    toast.error('Foydalanuvchi profili ma\'lumotlarini yuklab bo\'lmadi.');
    isLoading.value = false;
  }
};

const loadCalendar = async () => {
  try {
    const res = await api.get(`/users/activity-calendar?username=${route.params.username}`);
    calendarData.value = res.data.data;
  } catch (error) {
    // calendar logs fallbacks
  }
};

const calendarDays = computed(() => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);
  
  const days = [];
  const tempDate = new Date(startDate);
  
  for (let i = 0; i < 371; i++) {
    const year = tempDate.getFullYear();
    const month = String(tempDate.getMonth() + 1).padStart(2, '0');
    const date = String(tempDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${date}`;
    
    const dataObj = calendarData.value.find(item => item._id === dateStr);
    const count = dataObj ? dataObj.count : 0;
    
    days.push({
      dateStr,
      count
    });
    
    tempDate.setDate(tempDate.getDate() + 1);
  }
  return days;
});

const getActivityColor = (count) => {
  if (count === 0) return 'bg-slate-800';
  if (count <= 2) return 'bg-cyber-primary/20';
  if (count <= 5) return 'bg-cyber-primary/50';
  return 'bg-cyber-primary';
};

// Binary Rain Background logic
let cleanupMatrix = null;

const initMatrix = () => {
  const canvas = matrixCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  const binary = '01';
  const alphabet = binary.split('');
  const fontSize = 14;
  const columns = Math.ceil(canvas.width / fontSize);
  const rainDrops = Array(columns).fill(-20);
  
  const draw = () => {
    ctx.fillStyle = 'rgba(11, 16, 32, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00FF88'; // cyber-primary
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < rainDrops.length; i++) {
      const text = alphabet[Math.floor(Math.random() * alphabet.length)];
      ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
      
      if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
      }
      rainDrops[i]++;
    }
  };
  
  const interval = setInterval(draw, 35);
  
  return () => {
    clearInterval(interval);
    window.removeEventListener('resize', resizeCanvas);
  };
};

onMounted(() => {
  loadProfile();
  loadCalendar();
  // Brief delay to allow ref binding
  setTimeout(() => {
    cleanupMatrix = initMatrix();
  }, 100);
});

onUnmounted(() => {
  if (cleanupMatrix) cleanupMatrix();
});

watch(() => route.params.username, () => {
  loadProfile();
  loadCalendar();
});
</script>
