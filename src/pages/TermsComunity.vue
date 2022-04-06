<template>
<div >
 <article>
   <h1>{{$t("termscommunity.title")}}</h1>
   <div class="last-revised">Août 30, 2019</div>
   <section class="UH-card UH-layout-main">
     <section>
       <h2>1. Jésus King est une plate forme  de développement d'éthique chrétienne.</h2>
     </section>
     <section>
       <h2>2. JJésus King n'admet aucune doctrine sur les convictions religieuses.</h2>
     </section>
     <section>
       <h2>3. <strong>Jésus King</strong> accepte toute contribution qui s'inscrit dans le developpement du cameroun selon les axes suivants:</h2>
       <section>
         <h3>a) réhabilitation des voix enclavées.</h3>
       </section>
       <section>
         <h3>b) réhabilitations et construction des écoles.</h3>
       </section>
       <section>
         <h3>c) réhabilitations et construction des centres de santé.</h3>
       </section>
       <section>
         <h3>d) construction et aménagements des points d'eau potabe.( forages, puits améliorés et canalisation dans les habitations ou les blocs).</h3>
       </section>
       <section>
         <h3>e) construction des barrages, mini barrages, centrale solaires avec pour objectifs l'électrification totale des zones non électrifiées.</h3>
       </section>
       <section>
         <h3>f) construction des écoles  et universités de formation professionnelle.</h3>
       </section>
       <section>
         <h3>g) contribution à l'autonomie alimentaire par la promotion de l'agriculture biologique.</h3>
       </section>
       <section>
         <h3>h) Encouragement à la transformation  locale des produits agricoles.</h3>
       </section>
       <section>
         <h3>i) Évangélisation de masse en plein air avec un message unique :</h3>
         <h4>Jean 3:16. <strong>" Dieu a tant aimé le monde qu'Il a donné son Fils Unique afin que quiconque croit en Lui ne périsse point mais qu'il ait la vie éternelle."</strong></h4>
         <p style="text-align:justify">Constructionq des auditoriums pour tout besoin de rassemblement physique pour d'eventuelle partage, communication etformation.
         La reussite d'un projet est fonction de la vision. Nous avons reçus la vision, nous la partageons et nous sollicitons  votre adhésion pour un Cameroun ou du nord au sud,de l'est à l'ouest, il fait bon vivre, et ou les populations vulnérables  profite du geste de solidarité des enfants Dieu.
         NB: cette plate forme chrétienne est apolitique. Elle s'appuie simplement sur les recommandations du Christ:
         aimez vous les uns les autres...
         a ceci tous reconnaîtront que vous êtes mes disciples si vous avez de l'amour entre vous.
         Donnez leur vous même à manger.</p>
       </section>
     </section>
   </section>
 </article>
</div>
</template>

<script>

export default {
    head: {



        title: {
            inner: `Terms and Conditions`,
        },

        link: [
            { rel: 'canonical', href: `${process.env.BASE_URL||''}terms/comunity/`, id: 'canonical' },
            { rel: 'author', href: 'https://fezeueugene.web.app' },
            { rel: 'stylesheet', href: '/assets/css/terms.css' },
        ],
    },
    data(){
     return {
        appName: process.env.APP_NAME
     }
 }

}
</script>

<style>

</style>
