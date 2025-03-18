<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue';
</script>

<template>
  <header>
    <NavbarComponent />
  </header>
  <div class="grid place-content-center">
    <div
      class="px-4 mt-16 sm:mt-8 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <h2 class="max-w-lg mb-6 text-3xl sm:text-4xl sm:leading-none font-bold">
        Mentions légales
      </h2>
      <h3 class="mb-6 text-2xl sm:text-2xl sm:leading-none font-bold">
        Ce site fait l'objet d'un exercice scolaire et n'a aucun but commercial.
      </h3>
      <div class="flex flex-col md:flex-row">
        <div class="basis-1/2 pr-16">
          <h2 class="color-primary lato-regular">
            Informations sur la société
          </h2>
          <ul class="text-base md:text-lg">
            <li>Éditeurs du site : François K et Thomas D</li>
            <li>E-mail: contact@labonnefranquette.com</li>
            <li>Directeur de la publication : Thomas D</li>
            <li>Société fictive</li>
          </ul>
        </div>
        <div class="basis-1/2">
          <h2 class="color-primary lato-regular">
            Informations sur l'hébergeur
          </h2>
          <ul class="text-base md:text-lg">
            <li>Hébergeur du site : OVHcloud</li>
            <li>Adresse : 2 rue Kellermann, 59100 Roubaix, France</li>
            <li>Téléphone : 09 72 10 10 07</li>
          </ul>
        </div>
      </div>
      <h2 class="color-primary lato-regular font-bold">
        Information concernant la collecte de données
      </h2>
      <p class="text-base md:text-lg">
        Les informations collectées à travers ce site sont nécessaires au
        traitement de votre commande. <br />
        Elles peuvent être transmises aux partenaires contractuels de
        l'entreprise chargés de l'exécution et du paiement des commandes.
        Conformément à la loi "Informatique et Libertés" du 6 janvier 1978
        modifiée, vous disposez d'un droit d'accès, de rectification, et de
        suppression des données vous concernant. <br />
        Vous pouvez exercer ce droit en nous contactant à l'adresse
        <span class="font-bold"> contact@labonnefranquette.com</span>.
      </p>
      <h2 class="color-primary lato-regular font-bold">
        Propriété intellectuelle
      </h2>
      <p class="text-base md:text-lg">
        L'ensemble des éléments constituant ce site (textes, images, vidéos,
        logos, etc.) sont protégés par les lois françaises et internationales
        relatives à la propriété intellectuelle.
        <br />Toute reproduction, représentation, modification, publication,
        adaptation de tout ou partie des éléments du site, quel que soit le
        moyen ou le procédé utilisé, est interdite, sauf autorisation écrite
        préalable de La Bonne Franquette.
      </p>
      <h2 class="color-primary lato-regular font-bold">Responsabilité</h2>
      <p class="text-base md:text-lg">
        La Bonne Franquette ne saurait être tenue pour responsable des dommages
        directs ou indirects, matériels ou immatériels, causés par l'utilisation
        du site ou de l'application vendue.
      </p>
      <h2 class="color-primary lato-regular font-bold">Sources</h2>
      <ul class="text-base md:text-lg">
        <li>
          <a href="https://www.flaticon.com/free-icons/free" title="free icons" class="color-secondary hover-primary">
            Free icons created by Pixel perfect - Flaticon</a>
        </li>
        <li>
          <a href="https://www.flaticon.com/free-icons/problem" title="problem icons"
            class="color-secondary hover-primary">Problem icons created by Eucalyp - Flaticon</a>
        </li>
        <li>
          <a href="https://www.flaticon.com/free-icons/billing" title="billing icons"
            class="color-secondary hover-primary">Billing icons created by smashingstocks - Flaticon</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
