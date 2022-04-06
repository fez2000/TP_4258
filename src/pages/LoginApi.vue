<template>
  

</template>

<script>
export default {
created(){
    let url = new URL(window.location)
    let code = url.searchParams.get('code')
    if(code){
        this.$axios.post('/api/auth/linkedin',{code},{
            headers: {
                'CSRF-Token': this.$Cookies.get('XSRF-TOKEN')
            }
        }).then(({ data })=>{
            window.opener.postMessage(data)
        }).catch((err)=>{
            window.opener.postMessage({ status: false, errors: err })
        })
    }else{
        window.opener.postMessage({ status: false, errors: url.searchParams.get('error') })
    }
}
}
</script>

<style>

</style>