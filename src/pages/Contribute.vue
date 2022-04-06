<template>
  <md-empty-state
    md-rounded
    md-icon="access_time"
    md-label="No projects"
    md-description="No projects yet to post for vote or contribution."
  ></md-empty-state>
</template>

<script>
export default {
  head: {
    title: {
      inner: "Contribute",
      separator: " | ",
      complement: process.env.APP_NAME
    },
    meta: [
      { name: "description", content: "pages des projects" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: process.env.twitter_name },
      {
        name: "twitter:title",
        content: `Contribute | ${process.env.APP_NAME}`
      },
      { name: "twitter:description", content: "pages des projects" },
      { name: "twitter:image", content: "/assets/img/apple-icon.png" },
      { property: "fb:app_id", content: "123456789" },
      { property: "og:title", content: `Contribute | ${process.env.APP_NAME}` },
      { property: "og:site_name", content: `${process.env.APP_NAME}` },
      {
        property: "og:url",
        content: `${process.env.BASE_URL || ""}/dashboard/contribute`
      },
      { property: "og:description", content: "description" },
      { property: "og:image", content: "/assets/img/apple-icon.png" },
      { property: "og:image:type", content: "image/png" },
      { name: "author", content: `${process.env.AUTOR},${process.env.AUTOR2}` }
    ],
    link: [
      {
        rel: "canonical",
        href: `${process.env.BASE_URL || ""}/dashboard/contribute`,
        id: "canonical"
      },
      {
        rel: "author",
        href: `${process.env.AUTORREF},${process.env.AUTORREF2}`
      }
    ]
  }
};
</script>

<style>
</style>