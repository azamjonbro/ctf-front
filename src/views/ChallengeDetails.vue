<template>
  <div class="min-h-screen bg-cyber-bg text-slate-200">
    <main v-if="challenge" class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      <!-- IF NOT JOINED YET: DISPLAY PRE-SESSION DETAILS CARD & RULES -->
      <div v-if="!hasActiveSession" class="flex flex-col items-center justify-center min-h-[70vh] max-w-3xl mx-auto space-y-8 py-12">
        <div class="w-full glass-panel rounded-lg p-8 border border-white/10 space-y-6 shadow-neon-primary text-center">
          <div class="space-y-3">
            <h1 class="text-4xl font-extrabold text-white font-mono uppercase tracking-widest">{{ challenge.title }}</h1>
            <div class="h-1 w-24 bg-cyber-primary mx-auto my-4 rounded"></div>
            <p class="text-slate-300 text-sm leading-relaxed max-w-2xl mx-auto font-mono">
              {{ challenge.shortDescription }}
            </p>
          </div>

          <!-- CTF Metadata Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-left max-w-xl mx-auto pt-4">
            <div class="p-4 bg-slate-950/40 rounded border border-white/5 space-y-1">
              <span class="text-slate-500 block uppercase text-[10px] tracking-wider">Davomiyligi (Duration)</span>
              <span class="text-base font-bold text-white">{{ challenge.timerMinutes }} daqiqa</span>
            </div>
            <div class="p-4 bg-slate-950/40 rounded border border-white/5 space-y-1">
              <span class="text-slate-500 block uppercase text-[10px] tracking-wider">Ishtirokchilar (Participant Count)</span>
              <span class="text-base font-bold text-white">{{ challenge.participantCount || 0 }} ta jamoa/foydalanuvchi</span>
            </div>
            <div class="p-4 bg-slate-950/40 rounded border border-white/5 space-y-1">
              <span class="text-slate-500 block uppercase text-[10px] tracking-wider">Boshlanish Vaqti (Start Time)</span>
              <span class="text-sm font-bold text-white">{{ formatDate(challenge.startTime) }}</span>
            </div>
            <div class="p-4 bg-slate-950/40 rounded border border-white/5 space-y-1">
              <span class="text-slate-500 block uppercase text-[10px] tracking-wider">Tugash Vaqti (End Time)</span>
              <span class="text-sm font-bold text-white">{{ challenge.endTime ? formatDate(challenge.endTime) : 'Cheksiz' }}</span>
            </div>
          </div>

          <!-- Rules and Instructions -->
          <div class="border-t border-white/5 pt-6 text-left space-y-4 max-w-xl mx-auto">
            <h3 class="text-sm font-bold font-mono text-white uppercase tracking-wider">// Qoidalar va Ko'rsatmalar</h3>
            <div v-if="challenge.longDescription" class="text-slate-300 text-xs leading-relaxed font-sans" v-html="challenge.longDescription"></div>
            <div v-else class="text-slate-400 text-xs italic font-sans leading-relaxed">
              Ushbu topshiriqni boshlashdan oldin, barcha qoidalar bilan tanishib chiqing. Sessiya boshlangandan so'ng taymer orqaga hisoblashni boshlaydi va uni to'xtatib bo'lmaydi. Sahifani yangilash taymerni noldan boshlamaydi.
            </div>
          </div>

          <!-- Centered Start CTF Button -->
          <div class="pt-6">
            <button @click="joinChallenge" class="px-10 py-4 bg-cyber-primary hover:bg-cyber-primary/90 text-[#0B1020] text-sm font-extrabold font-mono rounded tracking-widest transition shadow-neon-primary uppercase transform hover:scale-105">
              TOPSHIRIQ SESSIYASINI BOSHLASH (START CTF)
            </button>
          </div>
        </div>
      </div>

      <!-- IF JOINED: ACTIVE SESSION WORKSPACE -->
      <div v-else class="space-y-8 animate-fade-in">

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
                <span v-if="challenge.status === 'finished'" class="text-xs font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600 font-bold uppercase">YAKUNLANGAN</span>
              </div>
              <h1 class="text-3xl font-extrabold text-white font-mono mt-2 uppercase tracking-wide">{{ challenge.title }}</h1>
              <p v-if="challenge.shortDescription" class="text-slate-400 text-sm mt-1 max-w-2xl">{{ challenge.shortDescription }}</p>
              
              <button
                v-if="isAdmin && isChallengeActive"
                @click="confirmAndFinishChallengeAdmin"
                :disabled="isAdminFinishing"
                class="mt-3 px-4 py-1.5 bg-cyber-danger hover:bg-cyber-danger/90 text-white text-[10px] font-bold font-mono rounded tracking-wider transition shadow-neon-danger uppercase"
              >
                {{ isAdminFinishing ? 'YAKUNLANMOQDA...' : 'Topshiriqni majburiy yakunlash' }}
              </button>
            </div>
          </div>

          <!-- Timer/Join State -->
          <div class="p-4 rounded bg-cyber-card border border-white/5 font-mono text-center min-w-[160px] self-stretch md:self-auto flex flex-col justify-center">
            <span class="text-[10px] text-slate-500 block uppercase tracking-wider">Sessiyadan qolgan vaqt</span>
            <span class="text-2xl font-bold block mt-1" :class="timeRemaining <= 300 ? 'text-cyber-danger animate-pulse' : 'text-cyber-secondary'">
              {{ formatTime(timeRemaining) }}
            </span>
            <span class="text-[10px] text-slate-500 block uppercase tracking-wider mt-2">Xato urinishlar</span>
            <span class="text-sm font-bold block" :class="(challenge?.failedAttempts || 0) >= 4 ? 'text-cyber-danger' : 'text-white'">
              {{ challenge?.failedAttempts || 0 }} / 5
            </span>
          </div>
        </div>

        <!-- INFO PANEL: Title, Description, Dates -->
        <div class="glass-panel rounded-lg p-6 border border-white/10 space-y-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-3">
            <div>
              <span class="text-[10px] font-mono text-cyber-primary uppercase tracking-wider font-bold">// TOPSHIRIQ MA'LUMOTLARI</span>
              <h2 class="text-xl font-bold font-mono text-white mt-1">{{ challenge.title }}</h2>
            </div>
            <div class="text-xs font-mono text-slate-400 space-y-1">
              <div>Boshlanish vaqti: <span class="text-slate-200">{{ formatDate(challenge.openedAt) }}</span></div>
              <div v-if="challenge.expiresAt">Tugash vaqti: <span class="text-slate-200">{{ formatDate(challenge.expiresAt) }}</span></div>
            </div>
          </div>
          <div v-if="challenge.shortDescription" class="text-slate-400 text-xs italic">{{ challenge.shortDescription }}</div>
          <div v-if="challenge.longDescription" class="text-slate-300 text-xs leading-relaxed max-w-none font-sans" v-html="challenge.longDescription"></div>
        </div>
        
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
        <div v-if="challenge.questions && challenge.questions.length > 0" class="space-y-4">
          <h2 class="text-xs font-mono font-bold uppercase text-slate-400 tracking-widest pl-1">// 1. BILIMNI TEKSHIRISH UCHUN SAVOLLAR ({{ challenge.questions.length }} ta tugun)</h2>
          
          <div class="grid grid-cols-1 gap-6">
            <div
              v-for="(q, index) in challenge.questions"
              :key="q.id"
              class="glass-panel p-6 rounded-lg border border-white/10 flex flex-col md:flex-row justify-between gap-6"
              :class="q.isSolved ? 'border-l-4 border-l-cyber-primary bg-cyber-primary/5' : ''"
            >
              <div class="flex-grow min-w-0 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-mono text-cyber-accent uppercase tracking-wider font-bold">Tugun #{{ index + 1 }}: {{ q.title }}</span>
                  <span class="px-2 py-0.5 rounded font-mono text-[9px] font-bold bg-[#131C35] text-cyber-secondary border border-white/15">{{ q.points }} ball</span>
                </div>
                <p v-if="q.description" class="text-xs text-slate-300 leading-relaxed">{{ q.description }}</p>

                <!-- Simple Hint block -->
                <div v-if="q.hasHint" class="pt-1 font-mono text-[9px]">
                  <template v-if="hintStore.isHintUnlocked(getQuestionId(q)) || q.hintUnlocked || q.hint">
                    <button type="button" disabled class="text-slate-500 uppercase tracking-wider cursor-not-allowed">
                      [ MASLAHAT OCHILGAN ]
                    </button>
                    <p class="text-[10px] font-mono text-slate-400 mt-1 italic border-l border-cyber-secondary/30 pl-2">
                      Maslahat: {{ hintStore.getHint(getQuestionId(q)) || q.hint }}
                    </p>
                  </template>
                  <template v-else>
                    <button 
                      type="button" 
                      @click="unlockHint(q)" 
                      :disabled="hintStore.isHintLoading(getQuestionId(q))"
                      class="text-yellow-600 hover:text-yellow-500 hover:underline uppercase tracking-wider"
                    >
                      {{ hintStore.isHintLoading(getQuestionId(q)) ? '[ OCHILMOQDA... ]' : '[ MASLAHAT ]' }}
                    </button>
                  </template>
                </div>
              </div>

              <!-- Answer Submission form -->
              <div class="w-full md:w-80 flex-shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
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
                    <select
                      v-if="q.type === 'multiple-choice'"
                      v-model="questionSubmissions[q.id]"
                      class="flex-1 bg-[#131C35] border border-white/10 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-primary font-mono"
                      required
                    >
                      <option value="" disabled selected>Variantni tanlang</option>
                      <option v-for="opt in q.options" :key="opt" :value="opt">{{ opt }}</option>
                    </select>
                    <input
                      v-else
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
              <div class="flex-grow min-w-0 space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-mono text-cyber-secondary uppercase tracking-wider font-bold block">
                    {{ (challenge.flags && challenge.flags[index - 1]?.title) || ('Flag topshirig\'i #' + index) }}
                  </span>
                  <span
                    v-if="challenge.flags && challenge.flags[index - 1]"
                    class="px-2 py-0.5 rounded font-mono text-[9px] font-bold bg-[#131C35] text-cyber-secondary border border-white/15"
                  >
                    {{ challenge.flags[index - 1].points }} ball
                  </span>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed">
                  {{ (challenge.flags && challenge.flags[index - 1]?.description) || ('Flag #' + index + ' ni topish uchun to\'liq penetratsion test o\'tkazing va maqsadli muhit/resurslarni qidiring.') }}
                </p>

                <!-- Flag specific hint system -->
                <div v-if="challenge.flags && challenge.flags[index - 1]?.hasHint" class="pt-2 font-mono text-[9px]">
                  <template v-if="challenge.flags[index - 1].hint">
                    <span class="text-cyber-secondary font-bold uppercase block mb-1">FLAG MASLAHAT KEYI:</span>
                    <p class="italic text-xs font-sans text-slate-200">{{ challenge.flags[index - 1].hint }}</p>
                  </template>
                  <template v-else>
                    <button 
                      type="button" 
                      @click="confirmAndUnlockFlagHint(index - 1)" 
                      :disabled="isUnlockingFlagHint[index - 1]"
                      class="text-yellow-600 hover:text-yellow-500 hover:underline uppercase tracking-wider font-bold"
                    >
                      {{ isUnlockingFlagHint[index - 1] ? '[ Maslahat ochilmoqda... ]' : '[ Flag Maslahatini ochish (20% Jarima) ]' }}
                    </button>
                  </template>
                </div>

                <!-- Flag specific attachment -->
                <div v-if="challenge.flags && challenge.flags[index - 1]?.attachment" class="mt-2">
                  <a :href="challenge.flags[index - 1].attachment" download class="inline-flex items-center space-x-1 text-[10px] font-mono text-cyber-primary hover:text-white bg-[#0B1020]/80 px-2 py-1.5 rounded border border-cyber-primary/20 transition">
                    <svg class="h-3 w-3 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    <span>Flag resursini yuklab olish</span>
                  </a>
                </div>
              </div>

              <!-- Flag submit form -->
              <div class="w-full md:w-96 flex-shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
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

          <div class="w-full max-w-md flex flex-col gap-3">
            <button
              v-if="allFlagsSolved"
              @click="finishChallenge"
              :disabled="isFinishing"
              class="w-full py-3 bg-cyber-secondary hover:bg-cyber-secondary/90 text-[#0B1020] font-bold font-mono text-sm rounded tracking-widest transition shadow-neon-secondary uppercase"
            >
              {{ isFinishing ? 'YAKUNLANMOQDA...' : 'TOPSHIRIQNI YAKUNLASH' }}
            </button>
            <button
              v-else
              @click="finishChallengeEarly"
              :disabled="isFinishing"
              class="w-full py-3 bg-cyber-danger/25 hover:bg-cyber-danger/35 text-cyber-danger border border-cyber-danger/30 font-bold font-mono text-xs rounded tracking-widest transition uppercase"
            >
              {{ isFinishing ? 'YAKUNLANMOQDA...' : 'Muddatidan oldin yakunlash (Ballarni muzlatish)' }}
            </button>
          </div>
        </div>

      </div>

    </main>

    <!-- PREMIUM CONFIRMATION MODAL -->
    <div v-if="modalActive" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="glass-panel border border-cyber-secondary rounded-lg p-6 max-w-md w-full space-y-6 shadow-neon-secondary">
        <h3 class="text-lg font-bold font-mono text-cyber-secondary flex items-center space-x-2">
          <span>⚠️ DIQQAT: JARIMA OGOHLANTIRISHI</span>
        </h3>
        <p class="text-sm text-slate-300 leading-relaxed font-sans">
          {{ modalMessage }}
        </p>
        <div class="flex justify-end space-x-3 font-mono text-xs">
          <button @click="closeModal(false)" class="px-4 py-2 border border-white/10 text-slate-400 hover:text-white rounded transition">
            BEKOR QILISH
          </button>
          <button @click="closeModal(true)" class="px-4 py-2 bg-cyber-secondary text-[#0B1020] font-bold rounded transition hover:bg-cyber-secondary/90 shadow-neon-secondary">
            OCHISH
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/auth.store.js';
import { useChallengeStore } from '../stores/challenge.store.js';
import { useHintStore } from '../stores/hint.store.js';
import { useLeaderboardStore } from '../stores/leaderboard.store.js';
import { useChallengeSession } from '../composables/useChallengeSession.js';
import getChallengeId from '../utils/getChallengeId.js';
import getQuestionId from '../utils/getQuestionId.js';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const challengeStore = useChallengeStore();
const hintStore = useHintStore();
const leaderboardStore = useLeaderboardStore();

const isAdmin = computed(() => authStore.user?.roles?.includes('admin'));
const isChallengeActive = computed(() => challenge.value?.status === 'active');
const isAdminFinishing = ref(false);

// Premium Modal state
const modalActive = ref(false);
const modalMessage = ref('');
let modalResolve = null;

const showCustomConfirm = (message) => {
  modalMessage.value = message;
  modalActive.value = true;
  return new Promise((resolve) => {
    modalResolve = resolve;
  });
};

const closeModal = (result) => {
  modalActive.value = false;
  if (modalResolve) {
    modalResolve(result);
    modalResolve = null;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'Noma\'lum';
  return new Date(dateStr).toLocaleString();
};

const hasActiveSession = ref(false);
const challenge = ref(null);
const timeRemaining = computed(() => challengeStore.timeRemaining);

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
    const data = await challengeStore.fetchChallengeDetails(route.params.challengeId);
    hasActiveSession.value = challengeStore.hasActiveSession;
    
    if (hasActiveSession.value) {
      challenge.value = challengeStore.currentChallenge;
      solvedFlags.value = challengeStore.solvedFlags;
      
      // Initialize submission structures
      challenge.value.questions.forEach(q => {
        if (!questionSubmissions.value[q.id]) {
          questionSubmissions.value[q.id] = '';
        }
        const qId = getQuestionId(q);
        if (qId) {
          hintStore.fetchQuestion(qId);
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
      challenge.value = challengeStore.currentChallenge;
    }
  } catch (error) {
    const msg = error?.error?.message || 'Kirish rad etildi yoki topshiriq topilmadi';
    toast.error(msg);
    router.push('/challenges');
  }
};

const joinChallenge = async () => {
  try {
    await challengeStore.startSession(route.params.challengeId);
    toast.success('Topshiriqqa muvaffaqiyatli qo\'shildingiz! Taymer ishga tushdi.');
    await loadChallengeDetails();
  } catch (error) {
    const msg = error?.error?.message || 'Topshiriqqa qo\'shilish muvaffaqiyatsiz tugadi';
    toast.error(msg);
  }
};

const { startTimer: runTimer, stopTimer } = useChallengeSession();

const startTimer = () => {
  runTimer(() => {
    toast.warning('Topshiriq sessiyasi taymeri muddati tugadi!');
    router.push('/challenges');
  });
};

const submitQuestionAnswer = async (questionId) => {
  const ans = questionSubmissions.value[questionId];
  if (!ans) return;

  isSubmittingQuestion.value[questionId] = true;
  try {
    const res = await challengeStore.submitQuestion(challenge.value, questionId, ans);
    toast.success(res?.message || 'To\'g\'ri javob!');
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
    await challengeStore.submitFlag(challenge.value, flagIndex, flagVal);
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

const unlockHint = async (question) => {
  const questionId = getQuestionId(question);
  const ctfId = getChallengeId(challenge.value);

  if (!questionId) {
    toast.error("Question not found");
    return;
  }
  if (!ctfId) {
    toast.error("Challenge session not found");
    return;
  }

  const costPoints = Math.round((question?.points ?? 10) * 0.2);
  const confirmed = await showCustomConfirm(`Bu maslahatni ochish uchun ${costPoints} ball yechiladi. Davom etasizmi?`);
  if (!confirmed) return;

  try {
    await hintStore.unlockHint(ctfId, questionId);
    toast.success("Maslahat muvaffaqiyatli ochildi!");
    
    await loadChallengeDetails();
    await leaderboardStore.fetchUserLeaderboard();
    await leaderboardStore.fetchTeamLeaderboard();
  } catch (error) {
    const errorMsg = error?.error?.message || error?.message || 'Maslahatni ochib bo\'lmadi';
    toast.error(errorMsg);
  }
};

const isUnlockingFlagHint = ref({});

const confirmAndUnlockFlagHint = async (flagIndex) => {
  const confirmed = await showCustomConfirm("Ushbu flag maslahatini ochish ushbu flag ballining 20% kamayishiga olib keladi. Rozimisiz?");
  if (!confirmed) return;

  isUnlockingFlagHint.value[flagIndex] = true;
  try {
    const firstQuestionId = challenge.value.questions && challenge.value.questions[0] ? challenge.value.questions[0].id : 'default';
    await challengeStore.unlockFlagHint(challenge.value, firstQuestionId, flagIndex);
    toast.success("Maslahat muvaffaqiyatli ochildi!");
    await loadChallengeDetails();
  } catch (error) {
    const errorMsg = error?.error?.message || 'Maslahatni ochib bo\'lmadi';
    toast.error(errorMsg);
  } finally {
    isUnlockingFlagHint.value[flagIndex] = false;
  }
};

const isUnlockingHint = ref(false);

const confirmAndUnlockHint = async () => {
  const confirmUnlock = await showCustomConfirm('Ushbu maslahatdan foydalanish jamoangiz to\'plagan/to\'playdigan ballarini 20% ga kamaytiradi. Ishonchingiz komilmi?');
  if (!confirmUnlock) return;

  isUnlockingHint.value = true;
  try {
    await challengeStore.openChallengeHint(challenge.value);
    toast.success('Maslahat muvaffaqiyatli ochildi!');
    await loadChallengeDetails();
  } catch (error) {
    const msg = error?.error?.message || 'Maslahatni ochish muvaffaqiyatsiz tugadi';
    toast.error(msg);
  } finally {
    isUnlockingHint.value = false;
  }
};

const finishChallenge = async () => {
  const ctfId = getChallengeId(challenge.value);
  if (!ctfId) return;
  isFinishing.value = true;
  try {
    await challengeStore.finishChallenge(ctfId);
    toast.success('Topshiriq yakunlandi!');
    router.push('/challenges');
  } catch (error) {
    const msg = error?.error?.message || 'Yakunlash muvaffaqiyatsiz tugadi';
    toast.error(msg);
  } finally {
    isFinishing.value = false;
  }
};

const finishChallengeEarly = async () => {
  const ctfId = getChallengeId(challenge.value);
  if (!ctfId) return;
  const confirmed = await showCustomConfirm(
    "Haqiqatan ham topshiriqni muddatidan oldin yakunlamoqchisiz? Qolgan flaglarni yechish imkoniyati yopiladi va joriy ballaringiz qulflanadi."
  );
  if (!confirmed) return;

  isFinishing.value = true;
  try {
    await challengeStore.finishChallengeEarly(ctfId);
    toast.success("Topshiriq muddatidan oldin muvaffaqiyatli yakunlandi!");
    router.push('/challenges');
  } catch (error) {
    const msg = error?.error?.message || "Xatolik yuz berdi";
    toast.error(msg);
  } finally {
    isFinishing.value = false;
  }
};

const confirmAndFinishChallengeAdmin = async () => {
  const ctfId = getChallengeId(challenge.value);
  if (!ctfId) return;
  const confirmed = await showCustomConfirm('Ushbu topshiriqni majburiy tugatishni xohlaysizmi? Barcha faol sessiyalar darhol tugatiladi.');
  if (!confirmed) return;

  isAdminFinishing.value = true;
  try {
    await challengeStore.forceFinishChallenge(ctfId);
    toast.success('Topshiriq muvaffaqiyatli yakunlandi!');
    await loadChallengeDetails();
  } catch (error) {
    const msg = error?.error?.message || 'Topshiriqni yakunlab bo\'lmadi';
    toast.error(msg);
  } finally {
    isAdminFinishing.value = false;
  }
};

onMounted(() => {
  loadChallengeDetails();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>
