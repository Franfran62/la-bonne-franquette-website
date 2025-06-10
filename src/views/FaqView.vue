<script setup>
import { ref } from "vue";
import ContactFormComponent from "/src/components/ContactFormComponent.vue";
import NavbarComponent from "@/components/NavbarComponent.vue";
const listeQuestions = ref([]);
const listereponses = ref([]);

listeQuestions.value = [
  "Combien ça coûte ?",
  "Ai-je besoin de matériel spécialisés ?",
  "Ai-je besoin d'utiliser un modèle spécifique de Terminal de Paiment Électronique ?",
  "Ai-je beosin d'utiliser un modèle spécifique de tablette ?",
  "Comment puis-je customiser l'application ?",
  "Mes données sont-elles en sécuritées ?",
  "J'ai rencontré un bug dans l'application, où le reporter ?",
];
listereponses.value = [
  "La Bonne Franquette est totalement gratuite d'utilisation. L'application n'est payante que si vous voulez modifier votre carte, ajouter des fonctionnalitées personnalisées ou que nous l'hebergeons.",
  "Non, une simple tablette suffit à faire fonctionner l'application. Vous aurez aussi besoin d'un ordinateur si vous ne choisissez pas l'option d'hébergement.",
  "Non. Notre application ne gére pas les paiment bancaire, vous être d'utiliser le Terminal de Paiment Électronique de votre choix.",
  "Pour Android, une tablette avec Android Jelly Bean, v16, 4.1 ou supérieur. Et tous les produits Apple plus récent que l'iPhone 4S.",
  "Afin d'adapter notre application à vos besoin spécifique, contactez nous pour d'établir un devis.",
  "Oui. Vos données sont enregistrées localement dans votre établissement. Si vous choisissez de faire héberger l'application chez nous, vos données sont stockées sur une machine virtuelle propre à vous. Personne d'autre n'y a accès.",
  "Vous pouvez nous envoyer un message à contact@labonnefranquette.com, en précisant dans votre message qu'il s'agit d'un bug ainsi que le message d'erreur s'il y en a un.",
];
</script>

<template>
  <header>
    <NavbarComponent />
  </header>
  <div class="grid place-content-center">
    <div
      class="px-4 mt-16 sm:mt-8 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <h2 class="max-w-lg mb-6 text-3xl sm:text-4xl sm:leading-none font-bold">
        Foire aux questions
      </h2>
      <div v-for="(question, index) in listeQuestions">
        <h2 class="text-xl sm:text-2xl sm:leading-none color-primary lato-regular font-bold">
          {{ question }}
        </h2>
        <div class="text-lg sm:text-xl sm:leading-none pt-1 pb-4">
          {{ listereponses[index] }}
        </div>
      </div>
      <div class="mt-16 flex flex-col gap-10 md:flex-row">
        <div>
          <h3 class="max-w-lg text-xl sm:text-2xl sm:leading-none font-bold">
            Si vous avez plus de questions,<span class="max-w-lg pt-4 text-xl sm:text-2xl sm:leading-none">
              Contactez-nous !</span>
          </h3>
          <div class="mt-2 pt-1 max-w-lg">
            Que soit pour obtenir plus de renseignements, pour demander une démonstration ou bien partager un problème
            rencontré dans l'application.
            <br>Nous restons disponible afin de mieux vous accompagner.
          </div>
        </div>
        <contact-form-component />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
