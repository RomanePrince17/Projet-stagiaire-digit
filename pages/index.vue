<template>
  <div class="relative min-h-screen font-sans bg-gray-100">
    <!-- Hero Section avec image de fond et overlay flou -->
    <section class="relative min-h-screen bg-[url('/assets/images/monfond.jpg')] bg-cover bg-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <!-- Header -->
      <header
        class="fixed top-0 left-0 w-full z-50 transition-all duration-500"
        :class="{'bg-black/70 backdrop-blur-md shadow-sm': showNav}"
      >
        <div class="container mx-auto flex items-center justify-between py-4 px-6">
          <div class="flex items-center gap-3 text-white">
            <h1 class="text-3xl font-bold">
              <span class="bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] bg-clip-text text-transparent font-seri">Digit</span> Stage
            </h1>
          </div>

          <!-- Boutons qui apparaissent seulement quand on scrolle -->
          <nav
            class="space-x-4 hidden md:flex transition-all duration-500"
            :class="showNav ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'"
          >
            <div class="p-[2px]  rounded-lg bg-gradient-to-r from-[#FF5F36] to-[#6E38E0]">
              <NuxtLink
                to="/auth/register"
                class="block px-4 py-2 rounded-lg  text-white bg-black/70 backdrop-blur-sm font-semibold hover:bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] transition"
              >
                S'inscrire
              </NuxtLink>
            </div>
            <div class="p-[2px] rounded-lg bg-gradient-to-r from-[#FF5F36] to-[#6E38E0]">
              <NuxtLink
                to="/auth/login"
                class="block px-4 py-2 rounded-lg text-white bg-black/70 backdrop-blur-sm font-semibold hover:bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] transition"
              >
                Se connecter
              </NuxtLink>
            </div>
          </nav>
        </div>
      </header>

      <!-- Hero Content -->
      <div class="relative flex flex-col items-center justify-center text-center text-white min-h-screen px-6">
        <h2 class="text-4xl md:text-5xl font-extrabold mb-6 text-white">
          {{ currentText }}
          <span class="blinking-cursor">|</span>
        </h2>

        <p class="text-lg md:text-2xl mb-8 animate-fadeInUp delay-100 max-w-2xl">
          Inscrivez-vous, postulez pour le stage de votre choix et recevez une réponse directement de Digit Consults.
        </p>
        <div class="flex gap-4 animate-fadeInUp delay-200">
          <NuxtLink
            to="/auth/register"
            class="bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] text-gray-300 font-bold px-6 py-3 rounded hover:bg-yellow-300 transition transform hover:scale-105"
          >
            Commencer maintenant
          </NuxtLink>
          <NuxtLink
            to="/auth/login"
            class="border border-white px-6 py-3 rounded transition transform hover:scale-105"
          >
            Se connecter
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Autres sections (Pourquoi choisir Digit, Comment ça marche, CTA et footer) -->
    <section class="relative py-20 px-6 bg-white text-gray-800">
      <div class="container mx-auto text-center">
        <h3 class="text-3xl font-bold mb-12">Pourquoi choisir Digit Consults ?</h3>
        <div class="grid md:grid-cols-3 gap-10">

          <!-- Recherche rapide -->
          <div class="p-6 border rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-4 flex flex-col items-center animate-scrollFade">
            <img :src="loupe" alt="Recherche rapide" class="w-32 h-32 mb-4">
            <h4 class="text-xl font-semibold mb-2 animate-fadeInUpText">Recherche rapide</h4>
            <p class="text-center animate-fadeInUpText delay-100">
              Accédez à une liste organisée de stages correspondant à vos compétences et à votre parcours académique.
            </p>
          </div>

          <!-- Suivi simple -->
          <div class="p-6 border rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-4 flex flex-col items-center animate-scrollFade delay-100">
            <img :src="suivi" alt="Suivi simple" class="w-32 h-32 mb-4">
            <h4 class="text-xl font-semibold mb-2 animate-fadeInUpText">Suivi simple</h4>
            <p class="text-center animate-fadeInUpText delay-100">
              Postulez et suivez l’état de votre demande en temps réel grâce à notre tableau de bord intuitif.
            </p>
          </div>

          <!-- Réponse rapide -->
          <div class="p-6 border rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-4 flex flex-col items-center animate-scrollFade delay-200">
            <img :src="reponse" alt="Réponse rapide" class="w-32 h-32 mb-4">
            <h4 class="text-xl font-semibold mb-2 animate-fadeInUpText">Réponse rapide</h4>
            <p class="text-center animate-fadeInUpText delay-100">
              Recevez directement la validation de votre candidature de la part de Digit Consults, sans délais inutiles.
            </p>
          </div>

        </div>
      </div>
    </section>

    <section class="py-20 -mt-20 px-6 bg-gray-50 text-gray-800">
      <div class="container mx-auto text-center">
        <h3 class="text-3xl font-bold mb-12">Comment ça marche ?</h3>
        <div class="grid md:grid-cols-3 gap-10">
          <div class="p-6 border-l-4 border-blue-400 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
            <h4 class="text-xl font-semibold mb-4">1. Inscription</h4>
            <p>Créez votre compte étudiant et complétez votre profil académique.</p>
          </div>
          <div class="p-6 border-l-4 border-blue-400 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
            <h4 class="text-xl font-semibold mb-4">2. Postuler</h4>
            <p>Choisissez le stage qui vous intéresse et soumettez votre demande directement en ligne.</p>
          </div>
          <div class="p-6 border-l-4 border-blue-400 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
            <h4 class="text-xl font-semibold mb-4">3. Réponse</h4>
            <p>Recevez la validation ou le refus de Digit Consults et planifiez votre stage en toute simplicité.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-gray-200 text-gray-900 text-center">
      <h3 class="text-3xl md:text-5xl font-bold mb-6">Prêt à trouver votre stage ?</h3>
      <p class="mb-8 text-lg md:text-2xl max-w-2xl mx-auto">
        Inscrivez-vous maintenant et commencez votre parcours avec Digit Consults.
      </p>
      <NuxtLink
        to="/auth/register"
        class="bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] text-gray-300 font-bold px-6 py-3 rounded hover:bg-yellow-300 transition transform hover:scale-105"
      >
        Commencer maintenant
      </NuxtLink>
    </section>

    <footer class="bg-gray-900 text-white py-6 text-center">
      <p>© 2025 Digit Consults. Tous droits réservés.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import loupe from '@/assets/images/digit/loupe.jpg';
import suivi from '@/assets/images/digit/suivi.jpg';
import reponse from '@/assets/images/digit/reponse.jpg';
definePageMeta({
  layout: false,
});

const showNav = ref(false);
const handleScroll = () => { showNav.value = window.scrollY > 100 };
onMounted(() => { window.addEventListener("scroll", handleScroll) });
onBeforeUnmount(() => { window.removeEventListener("scroll", handleScroll) });

// Texte dynamique "typewriter"
const texts = [
  "Trouvez votre stage facilement avec Digit Consults",
  "Un clic suffit pour décrocher votre futur stage",
  "Votre avenir professionnel commence ici"
];

const currentText = ref("");
let textIndex = 0;
let charIndex = 0;

function typeWriter() {
  if (charIndex < texts[textIndex].length) {
    currentText.value += texts[textIndex][charIndex];
    charIndex++;
    setTimeout(typeWriter, 50); // vitesse d'écriture
  } else {
    setTimeout(() => {
      currentText.value = "";
      charIndex = 0;
      textIndex = (textIndex + 1) % texts.length;
      typeWriter();
    }, 2000); // pause 2 secondes
  }
}

onMounted(() => {
  typeWriter();
});
</script>

<style>
/* Animations simples */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp { animation: fadeInUp 1s ease forwards; }
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }

/* Fade dynamique pour le texte */
.fade-enter-active, .fade-leave-active { transition: opacity 0.8s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Scroll smooth */
html { scroll-behavior: smooth; }
/* Bordures plus douces */
.rounded-2xl { border-radius: 1rem; }

/* Animation type vitrine/scroll */
@keyframes scrollFade {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-scrollFade {
  animation: scrollFade 1s ease forwards;
}

/* Animation des textes en dessous des icônes */
@keyframes fadeInUpText {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUpText {
  animation: fadeInUpText 0.8s ease forwards;
}

/* Curseur clignotant pour typewriter */
.blinking-cursor {
  display: inline-block;
  width: 2px;
  background-color: white;
  margin-left: 2px;
  animation: blink 1s infinite;
}
@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}
</style>
