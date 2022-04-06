const LinkPrevue = () => import( "link-prevue");
const VueDocPreview = () => import("vue-doc-preview");
const pdf = () => import("./components/pdf/vuePdfSss.vue");
const DropDown = () => import("./components/Dropdown.vue");
const LInput = () => import("./components/LInput.vue");
const LInfo = () => import("./components/LInfo.vue");
const VueFeedbackReaction = () => import("@/components/VueFeedbackReaction.vue");
const PdfCard = () => import("@/components/Cards/PdfCard.vue");
const SocialsLinks = () => import("@/components/SocialsLinks.vue");
const Mailer = () => import("@/components/Mailer.vue");
const Paiement = () => import("./components/Paiement.vue");
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
    install(Vue) {
        Vue.component("drop-down", DropDown);
        Vue.component("l-input", LInput);
        Vue.component("l-info", LInfo);
        Vue.component("l-mailer", Mailer);

        Vue.component("link-preview", LinkPrevue);
        Vue.component("feed-back-reaction", VueFeedbackReaction);
        Vue.component("pdf-preview", pdf);
        Vue.component("pdf-card", PdfCard);
        Vue.component("doc-preview", VueDocPreview);
        Vue.component("socials-links", SocialsLinks);
        Vue.component("paiement", Paiement);
    }
};

export default GlobalComponents;
