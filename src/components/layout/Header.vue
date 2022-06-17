<template>
<ul class="nav">
  <li class="nav-item">
      <!-- <router-link to="/">Home</router-link>
       <router-link to="/about">About</router-link> -->
    <a class="nav-link active" aria-current="page" href="/">Home</a>
  </li>
  <li class="nav-item">
     <a class="nav-link active" aria-current="page" href="/about">About</a>
  
  </li>
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="/sound">Sound</a>
  
  </li>
  <li class="nav-item">
    <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
  </li>
</ul>
</template>
<script>
export default{
    name: "header",
}
</script>