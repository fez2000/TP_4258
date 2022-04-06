<template>
<v-img class='card-skeleton__media' :style="{height:height,width:width}"></v-img>
</template>

<script>

export default {
    name: "CardSkeletonMedia",
    props:['height','width']
}
</script>

<style scoped>

.card-skeleton__media{
    background-color: grey;
    height: 200px;
    width: auto;
}

</style>