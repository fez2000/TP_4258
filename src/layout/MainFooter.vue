<template>
    <footer
        v-scroll="onScroll"
        class="footer"
        :class="{ [`footer-${type}`]: type }"
        :data-background-color="backgroundColor"
    >
        <div class="container">
            <nav>
                <ul>
                    <li>
                        <router-link to="/">{{ appName }}</router-link>
                    </li>

                    <li>
                        <a href="#">{{ $t("footer.forum") }}</a>
                    </li>
                    <li>
                        <router-link to="/terms">{{
                            $t("footer.terms")
                        }}</router-link>
                    </li>
                </ul>
            </nav>
            <div class="copyright">
                &copy; {{ new Date().getFullYear() }},
                {{ $t("footer.made_with") }}
                <md-icon>favorite</md-icon>
                {{ $t("footer.by") }}
                <a :href="autorRef" target="_blank">{{ autor }}</a>
                {{ $t("footer.and") }}
                <a :href="autorRef2" target="_blank">{{ autor2 }}</a
                >.
            </div>
        </div>
        <v-fab-transition>
            <v-btn
                bottom
                dark
                fab
                fixed
                right
                v-show="offsetTop > 30"
                @click="goToTop()"
            >
                <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
        </v-fab-transition>
    </footer>
</template>
<script>
export default {
    props: {
        backgroundColor: String,
        type: String
    },
    data() {
        return {
            autor: process.env.AUTOR,
            autorRef: process.env.AUTORREF,
            autor2: process.env.AUTOR2,
            autorRef2: process.env.AUTORREF2,
            appName: process.env.APP_NAME,
            offsetTop: 0
        };
    },
    methods: {
        goToTop() {
            document.documentElement.scrollTo({ top: 0 });
        },
        onScroll(e) {
            this.offsetTop = document.documentElement.scrollTop;
        }
    }
};
</script>
<style></style>
