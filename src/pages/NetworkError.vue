<template>
  <v-container >
      <v-row class="text-center">
          <v-col  :cols="12">
                <h1 class="title" >Network Error</h1>
                <p>Please try again lather</p>
          </v-col>
          <v-col  :cols="12">
              <img :src="img"  :aspect-ratio="1.777" class="img" alt="networkerror" />
          </v-col>
          <v-col :cols="12">
              <md-button href='../' class="md-primary md-raised">Home</md-button>
          </v-col>
      </v-row>
      
      
  </v-container>
 

            
  
</template>

<script>
export default {
    data(){
        return{
            img: require('@/assets/img/networkerror.svg')
        }
    }
}
</script>

<style  scoped>
    .img{
        height: 200px;
        width: 280px;
    }
</style>

</style>