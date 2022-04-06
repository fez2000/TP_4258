<template>
    
        <md-empty-state
            md-icon="find_replace" 
            md-label="404 Page Not Found"
            :md-description="`${page} this page does not exist or has been moved permanently.`">
        <md-button href='/' class="md-primary md-raised">Home</md-button>
        </md-empty-state>
    
</template>

<script>
export default {
    computed: {
        page(){
            return location.pathname
        }
    }
}
</script>

<style>

</style>