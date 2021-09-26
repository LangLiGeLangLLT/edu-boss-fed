<template>
    <el-container>
      <el-aside width="200px">
        <app-aside />
      </el-aside>
      <el-container>
        <el-header>
          <app-header />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import AppAside from './components/app-aside.vue'
import AppHeader from './components/app-header.vue'

export default Vue.extend({
  name: 'LayoutIndex',
  components: {
    AppAside,
    AppHeader
  }
})
</script>

<style lang="scss" scoped>
  .el-container {
    min-height: 100vh;
  }

  .el-aside {
    position: sticky;
    top: 0;
    max-height: 100vh;
    background-color: #D3DCE6;
  }

  .el-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: #fff;
  }

  .el-main {
    background-color: #E9EEF3;
  }
</style>
