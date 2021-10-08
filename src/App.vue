<script setup lang="ts">
import Breadcrumbs from "./components/breadcrumbs.vue";
</script>

<template>
  <div class="2xl:w-1/3 lg:w-1/2 mx-auto">
    <Breadcrumbs class="my-2 px-8"></Breadcrumbs>
    <hr />
    <div class="pt-2">
      <router-view></router-view>
    </div>
  </div>
</template>
