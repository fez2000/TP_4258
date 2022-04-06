<template>
  
</template>

<script>
import axios from 'axios';
export default {
    beforeRouteEnter (to, from, next) {
      axios.get('/api/voter/testurl/'+to.params.url)
      .then(({data})=>{
          if(data.status){
              next(vm => vm.setData(data.voter));
          }else{
              next(vm => vm.setError(data.errors))
          }
      })
      .catch(()=>next(to))
      
      
    }
  ,
    beforeRouteUpdate (to, from, next) {
    this.profil = null;
    this.errors = null;
        this.$axios.then(({data})=>{
          if(data.status){
              this.setData(data.voter);
          }else{
              this.setError(data.errors);
          }
          next();
      })
      .catch(()=>next(to))
    },
    data(){
        return {
            profil: null,
            errors: null,
        }
    },
    methods: {
        setData(data){
            this.profil = data;
            
        },
        setError(errors){
            this.errors = errors;
        }
    }
}
</script>

<style>

</style>