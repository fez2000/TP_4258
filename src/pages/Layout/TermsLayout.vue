<template>
    <div v-scroll="onScroll" style="{display: flex;}">
        <terms-nav-bar></terms-nav-bar>
        <terms-content></terms-content>
        <v-fab-transition>
            <v-btn
                bottom
                
                dark
                fab
                fixed
                right
                v-show="offsetTop>30"
                @click="goToTop()"
                
            >
                <v-icon>mdi-chevron-up</v-icon>
            </v-btn> 
        </v-fab-transition>
    </div>

</template>

<script>
import TermsNavBar from '@/layout/TermsNavBar.vue';
import TermsContent from './Content';
export default {
    components: {
        TermsNavBar,
        TermsContent
    },
    methods: {
        goToTop(){
            document.documentElement.scrollTo({top:0});
        },
        onScroll (e) {
            this.offsetTop = document.documentElement.scrollTop; 
        }
    },
    data () {
        return {
            offsetTop: 0
        }
    }
}
</script>

<style>

</style>