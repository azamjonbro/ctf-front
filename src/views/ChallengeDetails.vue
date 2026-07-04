<template>
  <div class="min-h-screen bg-cyber-bg text-slate-200">
    <main v-if="challenge" class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      <!-- HEADER PANEL -->
      <div class="p-6 rounded-lg glass-panel border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <img v-if="challenge.image" :src="challenge.image" class="w-24 h-24 rounded border border-white/10 shadow-neon-primary object-cover" alt="Challenge Image" />
          <div v-else class="w-24 h-24 rounded bg-slate-800 border border-white/10 flex items-center justify-center font-mono text-slate-500 text-xs text-center p-2 uppercase">RASM YO'Q</div>
          
          <div>
            <div class="flex items-center space-x-3">
              <span class="text-xs uppercase px-2 py-0.5 rounded font-mono font-bold"
                :class="{
                  'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20': challenge.difficulty === 'easy',
                  'bg-cyber-secondary/10 text-cyber-secondary border border-cyber-secondary/20': challenge.difficulty === 'medium',
                  'bg-cyber-danger/10 text-cyber-danger border border-cyber-danger/20': challenge.difficulty === 'hard',
                }"
              >
                {{ challenge.difficulty === 'easy' ? 'oson' : challenge.difficulty === 'medium' ? 'o\'rtacha' : 'qiyin' }}
              </span>
              <span class="text-xs font-mono text-slate-400">Yulduzlar: {{ challenge.stars }}</span>
              <span class="text-xs font-mono text-slate-400">Kategoriya: {{ challenge.category }}</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white font-mono mt-2 uppercase tracking-wide">{{ challenge.title }}</h1>
            <p class="text-slate-400 text-sm mt-1 max-w-2xl">{{ challenge.shortDescription }}</p>
          </div>
        </div>

        <!-- Timer/Join State -->
        <div class="p-4 rounded bg-cyber-card border border-white/5 font-mono text-center min-w-[160px] self-stretch md:self-auto flex flex-col justify-center">
          <template v-if="hasActiveSession">
            <span class="text-[10px] text-slate-500 block uppercase tracking-wider">Sessiyadan qolgan vaqt</span>
            <span class="text-2xl font-bold block mt-1" :class="timeRemaining <= 300 ? 'text-cyber-danger animate-pulse' : 'text-cyber-secondary'">
              {{ formatTime(timeRemaining) }}
            </span>
            <span class="text-[10px] text-slate-500 block uppercase tracking-wider mt-2">Xato urinishlar</span>
            <span class="text-sm font-bold block" :class="(challenge?.failedAttempts || 0) >= 4 ? 'text-cyber-danger' : 'text-white'">
              {{ challenge?.failedAttempts || 0 }} / 5
            </span>
          </template>
          <template v-else>
            <span class="text-[10px] text-slate-500 block uppercase tracking-wider mb-2">Davomiyligi: {{ challenge.timerMinutes }} daqiqa</span>
            <button @click="joinChallenge" class="w-full py-2 bg-cyber-primary hover:bg-cyber-primary/90 text-[#0B1020] text-xs font-bold font-mono rounded tracking-wider transition shadow-neon-primary uppercase">
              TOPSHIRIQQA QO'SHILISH
            </button>
          </template>
        </div>
      </div>

      <!-- IF NOT JOINED YET: DISPLAY PRE-SESSION DETAILS -->
      <div v-if="!hasActiveSession" class="glass-panel rounded-lg p-8 border border-white/10 space-y-6">
        <h2 class="text-lg font-bold font-mono text-white border-b border-white/5 pb-2 uppercase">// TOPSHIRIQ HAQIDA UMUMIY MA'LUMOT</h2>
        <div class="text-slate-300 text-sm leading-relaxed max-w-none font-sans" v-html="challenge.longDescription"></div>
        
        <!-- Challenge-level Attachments -->
        <div v-if="challenge.attachments && challenge.attachments.length > 0" class="p-4 rounded bg-[#131C35]/40 border border-white/5 space-y-2 font-mono text-xs">
          <span class="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">// Biriktirilgan fayllar (Challenge Attachments)</span>
          <div class="flex flex-wrap gap-3">
            <a v-for="(url, idx) in challenge.attachments" :key="idx" :href="url" download class="flex items-center space-x-2 text-[10px] font-mono text-cyber-primary hover:text-white bg-[#0B1020]/80 px-3 py-1.5 rounded border border-cyber-primary/20 transition">
              <svg class="h-3 w-3 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span>Resursni yuklab olish [{{ idx + 1 }}]</span>
            </a>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 font-mono text-xs text-slate-400">
          <div class="p-4 bg-slate-950/40 rounded border border-white/5 space-y-1">
            <span class="text-slate-500 block uppercase text-[10px]">Umumiy savollar</span>
            <span class="text-base font-bold text-white">{{ challenge.questionsCount || 5 }} ta savol</span>
          </div>
          <div class="p-4 bg-slate-950/40 rounded border border-white/5 space-y-1">
            <span class="text-slate-500 block uppercase text-[10px]">Umumiy flaglar</span>
            <span class="text-base font-bold text-white">{{ challenge.flagsCount || 1 }} ta flag</span>
          </div>
          <div class="p-4 bg-slate-950/40 rounded border border-white/5 space-y-1">
            <span class="text-slate-500 block uppercase text-[10px]">Sessiya cheklovi</span>
            <span class="text-base font-bold text-white">{{ challenge.timerMinutes }} daqiqa</span>
          </div>
        </div>

        <div class="flex justify-center pt-6">
          <button @click="joinChallenge" class="px-8 py-3 bg-cyber-primary hover:bg-cyber-primary/90 text-[#0B1020] text-sm font-bold font-mono rounded tracking-wider transition shadow-neon-primary uppercase">
            TOPSHIRIQ SESSIYASINI BOSHLASH
          </button>
        </div>
      </div>

      <!-- IF JOINED: ACTIVE SESSION WORKSPACE -->
      <div v-else class="space-y-8 animate-fade-in">
        
        <!-- Challenge-level Attachments -->
        <div v-if="challenge.attachments && challenge.attachments.length > 0" class="p-4 rounded bg-[#131C35]/40 border border-white/5 space-y-2 font-mono text-xs">
          <span class="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">// Biriktirilgan fayllar (Challenge Attachments)</span>
          <div class="flex flex-wrap gap-3">
            <a v-for="(url, idx) in challenge.attachments" :key="idx" :href="url" download class="flex items-center space-x-2 text-[10px] font-mono text-cyber-primary hover:text-white bg-[#0B1020]/80 px-3 py-1.5 rounded border border-cyber-primary/20 transition">
              <svg class="h-3 w-3 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span>Resursni yuklab olish [{{ idx + 1 }}]</span>
            </a>
          </div>
        </div>

        <!-- Challenge-level Global Hint -->
        <div v-if="challenge.hasHint" class="p-4 rounded bg-[#131C35]/40 border border-white/5 space-y-3 font-mono text-xs">
          <span class="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">// Topshiriq Maslahati (Challenge Hint)</span>
          
          <div v-if="challenge.hintUsed" class="p-3 bg-[#0B1020]/80 rounded border border-cyber-secondary/30 text-slate-300">
            <span class="text-cyber-secondary font-bold uppercase block mb-1">MASLAHAT KEYI:</span>
            <p class="italic text-xs font-sans text-slate-200">{{ challenge.challengeHint }}</p>
          </div>
          
          <div v-else class="space-y-2">
            <p class="text-[10px] text-yellow-500 uppercase tracking-wider font-bold animate-pulse font-mono">
              ⚠️ Using this hint will permanently reduce this challenge score by 20% for your team.
            </p>
            <button
              type="button"
              @click="confirmAndUnlockHint"
              :disabled="isUnlockingHint"
              class="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded uppercase tracking-wider transition disabled:opacity-50 text-[10px] font-mono"
            >
              {{ isUnlockingHint ? 'MASLAHAT OCHILMOQDA...' : 'Maslahatni ochish (20% Jarima)' }}
            </button>
          </div>
        </div>

        <!-- SECTION 1: QUESTIONS AREA -->
        <div class="space-y-4">
          <h2 class="text-xs font-mono font-bold uppercase text-slate-400 tracking-widest pl-1">// 1. BILIMNI TEKSHIRISH UCHUN SAVOLLAR ({{ challenge.questions.length }} ta tugun)</h2>
          
          <div class="grid grid-cols-1 gap-6">
            <div
              v-for="(q, index) in challenge.questions"
              :key="q.id"
              class="glass-panel p-6 rounded-lg border border-white/10 flex flex-col md:flex-row justify-between gap-6"
              :class="q.isSolved ? 'border-l-4 border-l-cyber-primary bg-cyber-primary/5' : ''"
            >
              <div class="flex-grow space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-mono text-cyber-accent uppercase tracking-wider font-bold">Tugun #{{ index + 1 }}: {{ q.title }}</span>
                  <span class="px-2 py-0.5 rounded font-mono text-[9px] font-bold bg-[#131C35] text-cyber-secondary border border-white/15">{{ q.points }} ball</span>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed">{{ q.description }}</p>

                <!-- Simple Hint block -->
                <div v-if="q.hasHint" class="pt-1 font-mono text-[9px]">
                  <template v-if="q.hintUnlocked || q.hint">
                    <button type="button" @click="visibleHints[q.id] = !visibleHints[q.id]" class="text-cyber-secondary hover:underline uppercase tracking-wider">
                      {{ visibleHints[q.id] ? '[ Maslahatni yashirish ]' : '[ Maslahatni ko\'rsatish ]' }}
                    </button>
                    <p v-if="visibleHints[q.id]" class="text-[10px] font-mono text-slate-400 mt-1 italic border-l border-cyber-secondary/30 pl-2">
                      Maslahat: {{ q.hint }}
                    </p>
                  </template>
                  <template v-else>
                    <button 
                      type="button" 
                      @click="confirmAndUnlockQuestionHint(q.id)" 
                      :disabled="isUnlockingQuestionHint[q.id]"
                      class="text-yellow-600 hover:text-yellow-500 hover:underline uppercase tracking-wider"
                    >
                      {{ isUnlockingQuestionHint[q.id] ? '[ Maslahat ochilmoqda... ]' : '[ Maslahatni ochish (20% Jarima) ]' }}
                    </button>
                  </template>
                </div>
              </div>

              <!-- Answer Submission form -->
              <div class="w-full md:w-80 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                <div v-if="q.isSolved" class="text-center font-mono p-3 bg-cyber-primary/10 border border-cyber-primary/20 rounded">
                  <span class="text-cyber-primary text-xs font-bold block">✓ TO'G'RI TASDIQLANDI</span>
                  <span class="text-[9px] text-slate-500 uppercase mt-0.5 block">Ballar berildi</span>
                </div>
                <div v-else-if="getQuestionFailedAttempts(q.id) >= 5" class="text-center font-mono p-3 bg-cyber-danger/10 border border-cyber-danger/20 rounded">
                  <span class="text-cyber-danger text-xs font-bold block">🔒 URUNISHLAR TUGADI</span>
                  <span class="text-[9px] text-slate-500 uppercase mt-0.5 block">Savol bloklandi (5 ta xato)</span>
                </div>
                <form v-else @submit.prevent="submitQuestionAnswer(q.id)" class="space-y-2">
                  <label class="text-[9px] font-mono uppercase text-slate-500 block">Javobni yuborish (Urinishlar: {{ getQuestionFailedAttempts(q.id) }} / 5)</label>
                  <div class="flex gap-2">
                    <input
                      v-model="questionSubmissions[q.id]"
                      type="text"
                      placeholder="Javob matni"
                      class="flex-1 bg-[#131C35] border border-white/10 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-primary font-mono"
                      required
                    />
                    <button
                      type="submit"
                      :disabled="isSubmittingQuestion[q.id]"
                      class="px-4 py-1.5 font-mono text-xs font-bold rounded bg-cyber-primary text-[#0B1020] transition hover:bg-cyber-primary/90 shadow-neon-primary disabled:opacity-50"
                    >
                      YUBORISH
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: MAIN CHALLENGE TASKS (FLAGS) -->
        <div class="space-y-4 pt-4">
          <h2 class="text-xs font-mono font-bold uppercase text-slate-400 tracking-widest pl-1">// 2. TOPSHIRIQNING ASOSIY FLAGLARI ({{ challenge.flagsCount }} ta flag talab qilinadi)</h2>
          
          <div class="grid grid-cols-1 gap-6">
            <div
              v-for="index in challenge.flagsCount"
              :key="index"
              class="glass-panel p-6 rounded-lg border border-white/10 flex flex-col md:flex-row justify-between gap-6"
              :class="solvedFlags.includes(index - 1) ? 'border-l-4 border-l-cyber-secondary bg-cyber-secondary/5' : ''"
            >
              <div class="flex-grow space-y-2">
                <span class="text-[10px] font-mono text-cyber-secondary uppercase tracking-wider font-bold block">Flag topshirig'i #{{ index }}</span>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Flag #{{ index }} ni topish uchun to'liq penetratsion test o'tkazing va maqsadli muhit/resurslarni qidiring.
                </p>
              </div>

              <!-- Flag submit form -->
              <div class="w-full md:w-96 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                <div v-if="solvedFlags.includes(index - 1)" class="text-center font-mono p-3 bg-cyber-secondary/10 border border-cyber-secondary/20 rounded">
                  <span class="text-cyber-secondary text-xs font-bold block">✓ FLAG QO'LGA KIRITILDI</span>
                  <span class="text-[9px] text-slate-500 uppercase mt-0.5 block">Jarayon yangilandi</span>
                </div>
                <div v-else-if="getFlagFailedAttempts(index - 1) >= 5" class="text-center font-mono p-3 bg-cyber-danger/10 border border-cyber-danger/20 rounded">
                  <span class="text-cyber-danger text-xs font-bold block">🔒 URUNISHLAR TUGADI</span>
                  <span class="text-[9px] text-slate-500 uppercase mt-0.5 block">Flag bloklandi (5 ta xato)</span>
                </div>
                <form v-else @submit.prevent="submitChallengeFlag(index - 1)" class="space-y-2">
                  <label class="text-[9px] font-mono uppercase text-slate-500 block">Flagni kiritish (Urinishlar: {{ getFlagFailedAttempts(index - 1) }} / 5)</label>
                  <div class="flex gap-2">
                    <button
                      type="button"
                      @click="toast.info('Maslahat: Flag manzillari uchun batafsil tavsif va maqsadli muhit ma\'lumotlariga qarang.')"
                      class="px-2.5 py-1.5 bg-slate-800 border border-white/10 rounded font-mono text-[10px] text-slate-300 hover:bg-slate-700 transition"
                    >
                      MASLAHAT
                    </button>
                    <input
                      v-model="flagSubmissions[index - 1]"
                      type="text"
                      placeholder="FLAG{cyber_sec_flag_key}"
                      class="flex-1 bg-[#131C35] border border-white/10 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-primary font-mono"
                      required
                    />
                    <button
                      type="submit"
                      :disabled="isSubmittingFlag[index - 1]"
                      class="px-4 py-1.5 font-mono text-xs font-bold rounded bg-cyber-secondary text-[#0B1020] transition hover:bg-cyber-secondary/90 shadow-neon-secondary disabled:opacity-50"
                    >
                      TEKSHIRISH
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 3: FINISH CHALLENGE ACTION -->
        <div class="border-t border-white/10 pt-8 flex flex-col items-center space-y-4">
          <div class="text-center max-w-md space-y-1">
            <span class="text-xs font-mono font-bold text-slate-400 block uppercase">Topshiriq jarayonini tekshirish</span>
            <span class="text-[11px] font-mono text-slate-500 block">
              Yechilgan flaglar: {{ solvedFlags.length }} / {{ challenge.flagsCount }}
            </span>
          </div>

          <div v-if="allFlagsSolved" class="w-full max-w-sm">
            <button
              @click="finishChallenge"
              :disabled="isFinishing"
              class="w-full py-3 bg-cyber-secondary hover:bg-cyber-secondary/90 text-[#0B1020] font-bold font-mono text-sm rounded tracking-widest transition shadow-neon-secondary uppercase"
            >
              {{ isFinishing ? 'YAKUNLANMOQDA...' : 'TOPSHIRIQNI YAKUNLASH' }}
            </button>
          </div>
          <div v-else class="text-center px-4 py-2 border border-dashed border-white/10 bg-white/5 rounded text-[10px] font-mono text-slate-500 uppercase cursor-default">
            🔒 Tugatishdan oldin barcha topshiriq flaglari qo'lga kiritilishi kerak.
          </div>
        </div>

      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '../utils/api.js';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const hasActiveSession = ref(false);
const challenge = ref(null);
const timeRemaining = ref(0);

// Submissions state
const questionSubmissions = ref({});
const flagSubmissions = ref([]);
const solvedFlags = ref([]); // array of flagIndex

// Hints visible toggles
const visibleHints = ref({}); // key: questionId, value: boolean

// Submitting states
const isSubmittingQuestion = ref({});
const isSubmittingFlag = ref([]);
const isFinishing = ref(false);

let timerInterval = null;

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const allFlagsSolved = computed(() => {
  if (!challenge.value || !challenge.value.flagsCount) return false;
  return solvedFlags.value.length === challenge.value.flagsCount;
});

const getQuestionFailedAttempts = (questionId) => {
  const attempt = challenge.value?.questionAttempts?.find(qa => qa.questionId === questionId);
  return attempt ? attempt.failedAttempts : 0;
};

const getFlagFailedAttempts = (flagIndex) => {
  const attempt = challenge.value?.flagAttempts?.find(fa => fa.flagIndex === flagIndex);
  return attempt ? attempt.failedAttempts : 0;
};

const loadChallengeDetails = async () => {
  try {
    const res = await api.get(`/ctfs/${route.params.challengeId}`);
    hasActiveSession.value = res.data.data.hasActiveSession;
    
    if (hasActiveSession.value) {
      challenge.value = res.data.data;
      timeRemaining.value = res.data.data.timeRemainingSeconds;
      solvedFlags.value = (res.data.data.solvedFlags || []).map(sf => sf.flagIndex);
      
      // Initialize submission structures
      challenge.value.questions.forEach(q => {
        if (!questionSubmissions.value[q.id]) {
          questionSubmissions.value[q.id] = '';
        }
      });
      
      const flagsCount = challenge.value.flagsCount || 0;
      for (let i = 0; i < flagsCount; i++) {
        if (flagSubmissions.value[i] === undefined) {
          flagSubmissions.value[i] = '';
        }
      }
      
      startTimer();
    } else {
      challenge.value = res.data.data.challenge;
    }
  } catch (error) {
    const msg = error?.error?.message || 'Kirish rad etildi yoki topshiriq topilmadi';
    toast.error(msg);
    router.push('/challenges');
  }
};

const joinChallenge = async () => {
  try {
    await api.post(`/ctfs/${route.params.challengeId}/session`);
    toast.success('Topshiriqqa muvaffaqiyatli qo\'shildingiz! Taymer ishga tushdi.');
    await loadChallengeDetails();
  } catch (error) {
    const msg = error?.error?.message || 'Topshiriqqa qo\'shilish muvaffaqiyatsiz tugadi';
    toast.error(msg);
  }
};

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      clearInterval(timerInterval);
      toast.warning('Topshiriq sessiyasi taymeri muddati tugadi!');
      router.push('/challenges');
    }
  }, 1000);
};

const submitQuestionAnswer = async (questionId) => {
  const ans = questionSubmissions.value[questionId];
  if (!ans) return;

  isSubmittingQuestion.value[questionId] = true;
  try {
    const res = await api.post(`/ctfs/${route.params.challengeId}/questions/${questionId}/submit`, {
      answer: ans
    });
    toast.success(res.data.message || 'To\'g\'ri javob!');
    await loadChallengeDetails();
  } catch (error) {
    const msg = error?.error?.message || 'Noto\'g\'ri javob';
    toast.error(msg);
    await loadChallengeDetails();
  } finally {
    isSubmittingQuestion.value[questionId] = false;
  }
};

const submitChallengeFlag = async (flagIndex) => {
  const flagVal = flagSubmissions.value[flagIndex];
  if (!flagVal) return;

  isSubmittingFlag.value[flagIndex] = true;
  try {
    await api.post(`/ctfs/${route.params.challengeId}/flags/${flagIndex}/submit`, {
      flag: flagVal
    });
    toast.success('To\'g\'ri flag tasdiqlandi!');
    await loadChallengeDetails();
  } catch (error) {
    const msg = error?.error?.message || 'Noto\'g\'ri flag';
    toast.error(msg);
    await loadChallengeDetails();
  } finally {
    isSubmittingFlag.value[flagIndex] = false;
  }
};

const isUnlockingQuestionHint = ref({});

const confirmAndUnlockQuestionHint = async (questionId) => {
  const confirmed = confirm("Ushbu savol maslahatini ochish savol ballining 20% kamayishiga (8 ball qolishiga) olib keladi. Rozimisiz?");
  if (!confirmed) return;

  isUnlockingQuestionHint.value[questionId] = true;
  try {
    const res = await api.post(`/ctfs/${challenge.value.challengeId}/questions/${questionId}/hint/unlock`);
    toast.success("Maslahat muvaffaqiyatli ochildi!");
    
    // Update the question object in-place
    const question = challenge.value.questions.find(q => q.id === questionId);
    if (question) {
      question.hint = res.data.data.hint;
      question.hintUnlocked = true;
      visibleHints.value[questionId] = true;
    }
  } catch (error) {
    const errorMsg = error?.error?.message || 'Maslahatni ochib bo\'lmadi';
    toast.error(errorMsg);
  } finally {
    isUnlockingQuestionHint.value[questionId] = false;
  }
};

const isUnlockingHint = ref(false);

const confirmAndUnlockHint = async () => {
  const confirmUnlock = confirm('Ushbu maslahatdan foydalanish jamoangiz to\'plagan/to\'playdigan ballarini 20% ga kamaytiradi. Ishonchingiz komilmi?');
  if (!confirmUnlock) return;

  isUnlockingHint.value = true;
  try {
    const res = await api.post(`/ctfs/${route.params.challengeId}/hint/unlock`);
    toast.success(res.data.message || 'Maslahat muvaffaqiyatli ochildi!');
    
    // Update local state
    if (challenge.value) {
      challenge.value.hintUsed = true;
      challenge.value.challengeHint = res.data.data.hint;
    }
    // Re-load details to update calculations
    await loadChallengeDetails();
  } catch (error) {
    const msg = error?.error?.message || 'Maslahatni ochish muvaffaqiyatsiz tugadi';
    toast.error(msg);
  } finally {
    isUnlockingHint.value = false;
  }
};

const finishChallenge = async () => {
  isFinishing.value = true;
  try {
    const res = await api.post(`/ctfs/${route.params.challengeId}/finish`);
    toast.success(res.data.message || 'Topshiriq yakunlandi!');
    router.push('/challenges');
  } catch (error) {
    const msg = error?.error?.message || 'Yakunlash muvaffaqiyatsiz tugadi';
    toast.error(msg);
  } finally {
    isFinishing.value = false;
  }
};

onMounted(() => {
  loadChallengeDetails();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>
