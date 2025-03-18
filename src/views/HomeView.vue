<script setup>
import AboutSection from './_partials/AboutSection.vue';
import ContactSection from './_partials/ContactSection.vue';
import HomeSection from './_partials/HomeSection.vue';
import ProductSection from './_partials/ProductSection.vue';
import NavbarComponent from '@/components/NavbarComponent.vue';
</script>

<template>
    <header>
        <NavbarComponent />
    </header>
    <section id="home" class="grid">
        <HomeSection />
    </section>

    <hr class="divider hidden">

    <section id="product" class="pt-20 pb-24">
        <ProductSection />
    </section>

    <hr class="divider hidden">

    <section id="about" class="w-full pb-24">
        <AboutSection />
    </section>

    <hr class="divider hidden">

    <section id="contact" class="w-full pb-16">
        <ContactSection />
    </section>

</template>

<style scoped>
#home {
    min-height: 90vh !important;
}

#contact {
    min-height: 75vh !important;
}
</style>