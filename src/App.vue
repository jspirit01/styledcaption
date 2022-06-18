<template>
  <div id="app">
    <MyHeader id="header"/>
    <router-view/>
    <MyFooter/>
  </div>
</template>

<script>
import MyHeader from './components/layout/Header.vue'
import MyFooter from './components/layout/Footer.vue'
export default {
  name: 'App',
  components: {
    MyHeader,
    MyFooter,
  },
  methods: {
    openNew: function() {
      console.log("click")
    }
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100%;
  position: relative;
  padding-bottom: 60px;
}

#header {
  margin-bottom: 20px;
}
</style>
