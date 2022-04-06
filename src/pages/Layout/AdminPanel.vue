<template>
  <router-view></router-view>
</template>

<script>
import Cookies from 'js-cookie';
export default {
   beforeRouteEnter (to, from, next) {
      
      
        let voter = {};
    if(Cookies.get('voter')&&Cookies.get(Cookies.get('voter'))){
      voter = JSON.parse(Cookies.get(Cookies.get('voter')));
      if(voter.type == 'SUPERUSER'){
        return next()
      }
    }
    next('/dashboard');
          
          

          
     
        
      


  }
}
</script>

<style>

</style>