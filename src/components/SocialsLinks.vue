<template>
  <social-sharing
    :url="url"
    :title="title"
    :description="description"
    :quote="quote"
    :hashtags="hashtags"
    :twitter-user="twitter_name"
    inline-template
  >
    <v-list>
      <network
        v-for="l in [{
                      network: 'facebook',
                      name: 'Facebook',
                      icon: 'facebook'
                    },{
                      network: 'linkedin',
                      name: 'Linkedin',
                      icon: 'linkedin'
                    },{
                      network: 'pinterest',
                      name: 'Pinterest',
                      icon: 'pinterest'
                    },{
                      network: 'skype',
                      name: 'Skype',
                      icon: 'skype'
                    },{
                      network: 'telegram',
                      name: 'telegram',
                      icon: 'telegram' 
                    },{
                      network: 'twitter',
                      name: 'Twitter',
                      icon: 'twitter'
                    },{
                      network: 'whatsapp',
                      icon: 'whatsapp',
                      name: 'Whatsapp',
      }]"
        :key="l.network"
        :network="l.network"
      >
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-{{l.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{l.name}}</v-list-item-content>
        </v-list-item>
      </network>
    </v-list>
  </social-sharing>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    hashtags: {
      type: String,
      default: ""
    },
    quote: {
      type: String,
      default: ""
    },
    twitter_name: {
      type: String,
      default: ""
    }
  }
};
</script>

<style>
</style>