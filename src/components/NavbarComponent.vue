<template>
    <nav id="navbar" class="bg-white fixed top-0 z-40 flex w-full flex-row justify-end px-4 sm:justify-between">
        <button id="btnSidebarToggler" @click="toggleSidebar()" type="button" class="my-4 py-4 px-2 text-2xl rounded-md hover-primary">
            <svg id="navClosed" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-8 w-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg id="navOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="hidden h-8 w-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </nav>
  <div id="containerSidebar" class="z-40">
      <div class="navbar-menu relative z-40">
          <nav id="sidebar"
              class="fixed left-0 bottom-0 flex w-3/4 -translate-x-full flex-col overflow-y-auto shadow-xl bg-white pt-6 pb-8 sm:max-w-xs lg:w-80">
              <ul class="mb-8">
                  <li v-for="nav of navigation">
                  <RouterLink class="flex items-center rounded py-3 pl-3 pr-4 hover-primary"
                              :to="nav.href">
                    <span class="select-none">{{nav.name}}</span>
                  </RouterLink>
                </li>
              </ul>
          </nav>
      </div>
  </div>
</template>
  
  
<script setup>
    import { onMounted } from 'vue';
    import { RouterLink } from 'vue-router';

    const navigation = [
      { name: 'Accueil', href: '/la-bonne-franquette-website', current: false },
      { name: 'F.A.Q', href: '/la-bonne-franquette-website/faq', current: false },
      { name: 'Mentions legales', href: '/la-bonne-franquette-website/mentions-legales', current: false },
    ]

    onMounted(() => {
      const navbar = document.getElementById("navbar");
      const sidebar = document.getElementById("sidebar");
      const btnSidebarToggler = document.getElementById("btnSidebarToggler");
      const navClosed = document.getElementById("navClosed");
      const navOpen = document.getElementById("navOpen");   
    });

      function toggleSidebar() {
        sidebar.classList.toggle("show");
        navClosed.classList.toggle("hidden");
        navOpen.classList.toggle("hidden");
        sidebar.style.top = parseInt(navbar.clientHeight) - 1 + "px";
      }

</script>

<style scoped>
    #sidebar {
        -webkit-transition: all 300ms cubic-bezier(0, 0.77, 0.58, 1);
        transition: all 300ms cubic-bezier(0, 0.77, 0.58, 1);
    }

    #sidebar.show {
        transform: translateX(0);
    }
</style>
