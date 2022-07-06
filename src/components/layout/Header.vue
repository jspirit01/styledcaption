<template>
	<header>
    <div id="logo">Caption Styling System</div>
	  <div id="nav">
      <router-link class="menu" to="/">Home</router-link>
      <router-link class="menu" to="/about">About</router-link>
      <router-link class="menu" to="/sound">Sound</router-link>
		</div>
	</header>
</template>
<script>
export default{
    name: "myHeader",
}
</script>
<style>
#logo {
  font-size: 2.5em;
  color: white;
  padding: 10px;
}
h1 img {
  height: 100%;
}
#nav {
  background: #F6BD60;
  padding: 15px;
  border-radius: 5px;
}

#nav .menu{
  color: white;
  padding: 0px;
  margin: 10px;
  text-decoration: none;
}
</style>