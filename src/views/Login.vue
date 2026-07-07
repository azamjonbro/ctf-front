<template>
  <div
    class="min-h-screen bg-[#0B1020] flex items-center justify-center px-4 relative overflow-hidden"
  >
    <!-- Matrix rain canvas -->
    <canvas
      ref="matrixCanvas"
      class="absolute inset-0 transition-opacity duration-1000 pointer-events-none z-0"
      :class="isLoggingIn ? 'opacity-[0.25]' : 'opacity-[0.08]'"
    ></canvas>

    <!-- Cyber Background Accent Glows -->
    <div
      class="absolute top-1/4 left-1/4 h-[350px] w-[350px] bg-cyber-primary/10 rounded-full blur-[120px] pointer-events-none z-0"
    ></div>
    <div
      class="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] bg-cyber-accent/15 rounded-full blur-[120px] pointer-events-none z-0"
    ></div>

    <!-- Hacker Loading State -->
    <div
      v-if="isLoggingIn"
      class="w-full max-w-md p-6 rounded-lg border border-cyber-primary/20 bg-[#0B1020]/90 glass-panel font-mono text-xs space-y-6 shadow-[0_0_50px_rgba(0,255,136,0.15)] relative z-10 overflow-hidden"
    >
      <!-- Background decorative code logs -->
      <div
        class="absolute right-2 top-2 opacity-5 text-[8px] select-none pointer-events-none"
      >
        0101010101010101010101010101 1010101010101010101010101010
      </div>

      <!-- Terminal Header -->
      <div
        class="flex items-center justify-between border-b border-cyber-primary/20 pb-3 text-cyber-primary"
      >
        <div class="flex items-center space-x-2">
          <span
            class="w-2.5 h-2.5 rounded-full bg-cyber-primary animate-ping"
          ></span>
          <span class="font-bold tracking-widest text-shadow-neon"
            >// ALGORITM.CTF SECURE LOGIN</span
          >
        </div>
        <span class="text-[9px] animate-pulse">ESTABLISHING LINK...</span>
      </div>

      <!-- Terminal Console Text -->
      <div
        class="space-y-2 text-slate-300 min-h-[100px] flex flex-col justify-end"
      >
        <div class="flex items-center space-x-2">
          <span class="text-cyber-primary">></span>
          <span>ESTABLISHING SECURE CONNECTION HASH...</span>
        </div>
        <div v-if="loadingProgress > 25" class="flex items-center space-x-2">
          <span class="text-cyber-primary">></span>
          <span
            >NEGOTIATING HANDSHAKE PROTOCOLS...
            <span class="text-cyber-primary font-bold">OK</span></span
          >
        </div>
        <div v-if="loadingProgress > 50" class="flex items-center space-x-2">
          <span class="text-cyber-primary">></span>
          <span
            >AUTHENTICATING OPERATOR CREDENTIALS...
            <span class="text-cyber-primary font-bold">VERIFIED</span></span
          >
        </div>
        <div v-if="loadingProgress > 75" class="flex items-center space-x-2">
          <span class="text-cyber-primary">></span>
          <span
            >DOWNLOADING USER SESSION STATES...
            <span class="text-cyber-secondary font-bold">DONE</span></span
          >
        </div>
      </div>

      <!-- System Diagnostics Grid -->
      <div
        class="grid grid-cols-2 gap-3 text-[10px] border-t border-b border-white/10 py-3 font-mono text-slate-400"
      >
        <div class="flex justify-between pr-2 border-r border-white/5">
          <span>HOST TARGET:</span>
          <span class="text-white font-bold">ALGORITM</span>
        </div>
        <div class="flex justify-between pl-2">
          <span>PORT:</span>
          <span class="text-cyber-primary font-bold">5001/TCP</span>
        </div>
        <div class="flex justify-between pr-2 border-r border-white/5">
          <span>ENCRYPT:</span>
          <span class="text-cyber-secondary font-bold">ECDSA-256</span>
        </div>
        <div class="flex justify-between pl-2">
          <span>ACCESS:</span>
          <span class="text-cyber-primary font-bold">GRANTED</span>
        </div>
      </div>

      <!-- Loader Animation -->
      <div class="space-y-1">
        <div
          class="flex justify-between text-[10px] text-cyber-primary font-mono font-bold"
        >
          <span>[ SESSION DECRYPT ]</span>
          <span>{{ loadingProgress }}%</span>
        </div>
        <div
          class="w-full bg-slate-900 border border-cyber-primary/20 h-3 p-0.5 rounded overflow-hidden relative"
        >
          <div
            class="bg-gradient-to-r from-cyber-primary to-cyber-secondary h-full rounded-sm transition-all duration-150"
            :style="{ width: loadingProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Login Form Container -->
    <div
      v-else
      class="w-full max-w-md p-8 rounded-lg glass-panel border border-white/10 relative z-10 space-y-6"
    >
      <div class="text-center space-y-2">
        <h1
          class="text-3xl font-extrabold font-mono tracking-wider text-cyber-primary"
        >
          // ALGORITM.<span class="text-cyber-secondary">CTF</span>
        </h1>
        <p class="text-xs text-slate-400">
          XAVFSIZLIK KLIENT TUGUNINI O'RNATISH UCHUN SHAXSNI TASDIQLANG
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-1">
          <label
            class="text-xs uppercase font-mono tracking-wider text-slate-400 block"
            for="usernameOrEmail"
            >Foydalanuvchi nomi yoki elektron pochta</label
          >
          <input
            id="usernameOrEmail"
            v-model="state.usernameOrEmail"
            type="text"
            placeholder="operator@ctf.io"
            class="w-full bg-cyber-card border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyber-primary"
            :class="{ 'border-cyber-danger': v$.usernameOrEmail.$error }"
          />
          <span
            v-if="v$.usernameOrEmail.$error"
            class="text-[10px] text-cyber-danger font-mono block"
            >Maydonni to'ldirish shart</span
          >
        </div>

        <div class="space-y-1">
          <label
            class="text-xs uppercase font-mono tracking-wider text-slate-400 block"
            for="password"
            >Xavfsizlik paroli</label
          >
          <input
            id="password"
            v-model="state.password"
            type="password"
            placeholder="••••••••••••"
            class="w-full bg-cyber-card border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyber-primary"
            :class="{ 'border-cyber-danger': v$.password.$error }"
          />
          <span
            v-if="v$.password.$error"
            class="text-[10px] text-cyber-danger font-mono block"
            >Minimal uzunlik - 6 ta belgi</span
          >
        </div>

        <!-- Mathematical Captcha -->
        <div class="space-y-1">
          <label
            class="text-xs uppercase font-mono tracking-wider text-slate-400 block"
            >Matematik captcha:
            <span class="text-cyber-primary font-bold">{{
              captchaQuestion
            }}</span></label
          >
          <div class="flex gap-2">
            <input
              v-model="state.captchaAnswer"
              type="text"
              placeholder="Javobingiz"
              class="flex-1 bg-cyber-card border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyber-primary font-mono"
              required
            />
            <button
              type="button"
              @click="loadCaptcha"
              class="px-3 bg-slate-800 border border-white/10 rounded text-slate-300 hover:bg-slate-700 transition text-xs font-mono"
              title="Yangilash"
            >
              🔄
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 rounded font-mono text-sm font-bold bg-cyber-primary text-[#0B1020] transition hover:bg-cyber-primary/90 focus:outline-none shadow-neon-primary disabled:opacity-50"
        >
          {{ isLoading ? "ALOQA O'RNATILMOQDA..." : "TIZIMGA KIRISH" }}
        </button>
      </form>

      <div class="text-center text-xs text-slate-500 font-mono">
        Birinchi marta foydalanyapsizmi?
        <router-link to="/register" class="text-cyber-secondary hover:underline"
          >// RO'YXATDAN O'TISH</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "../stores/auth.js";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import api from "../utils/api.js";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();
const isLoading = ref(false);

const isLoggingIn = ref(false);
const loadingProgress = ref(0);
const matrixCanvas = ref(null);

const state = reactive({
  usernameOrEmail: "",
  password: "",
  captchaAnswer: "",
});

const captchaId = ref("");
const captchaQuestion = ref("");

const loadCaptcha = async () => {
  try {
    const res = await api.get("/auth/captcha");
    captchaId.value = res.data.data.captchaId;
    captchaQuestion.value = res.data.data.question;
  } catch (error) {
    toast.error("Kaptchani yuklashda xatolik yuz berdi");
  }
};

const rules = {
  usernameOrEmail: { required },
  password: { required, minLength: minLength(6) },
};

const v$ = useVuelidate(rules, state);

const handleLogin = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  isLoading.value = true;
  isLoggingIn.value = true;
  loadingProgress.value = 0;

  const progressInterval = setInterval(() => {
    if (loadingProgress.value < 90) {
      loadingProgress.value += Math.floor(Math.random() * 12) + 5;
    }
  }, 100);

  try {
    await authStore.userLogin({
      usernameOrEmail: state.usernameOrEmail,
      password: state.password,
      captchaId: captchaId.value,
      captchaAnswer: state.captchaAnswer,
      deviceName: navigator.userAgent,
    });

    setTimeout(() => {
      clearInterval(progressInterval);
      loadingProgress.value = 100;
      toast.success("Xavfsiz aloqa o'rnatildi. Kirishga ruxsat berildi!");
      router.push("/");
    }, 1200);
  } catch (error) {
    clearInterval(progressInterval);
    isLoggingIn.value = false;
    isLoading.value = false;
    state.captchaAnswer = "";
    loadCaptcha();
    const errorMsg =
      error?.error?.message || "Avtorizatsiya ma'lumotlari noto'g'ri";
    toast.error(errorMsg);
  }
};

// Binary Rain Background logic
let cleanupMatrix = null;

const initMatrix = () => {
  const canvas = matrixCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const binary = "01";
  const alphabet = binary.split("");
  const fontSize = 14;
  const columns = Math.ceil(canvas.width / fontSize);
  const rainDrops = Array(columns).fill(-20);

  const draw = () => {
    ctx.fillStyle = "rgba(11, 16, 32, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00FF88"; // cyber-primary
    ctx.font = fontSize + "px monospace";

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
    window.removeEventListener("resize", resizeCanvas);
  };
};

onMounted(() => {
  loadCaptcha();
  setTimeout(() => {
    cleanupMatrix = initMatrix();
  }, 100);
});

onUnmounted(() => {
  if (cleanupMatrix) cleanupMatrix();
});
</script>
