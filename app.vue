<script setup>
  import { useNuxtApp } from '#app'
  const nuxtApp = await useNuxtApp();
  //const errorHandler = await useError();
  const folder =  nuxtApp.ssrContext ? nuxtApp.ssrContext.url : document.location.pathname;
  const title = nuxtApp.$config.title;
  const classBg = 'bg-'+nuxtApp.$config.color+'-600';
  const classLightBorder = 'border-' + nuxtApp.$config.color + '-600';
  const classDarkBorder = 'border-' + nuxtApp.$config.color + '-800';
  const classHoverBg = 'hover:bg-' + nuxtApp.$config.color + '-700';
  const { data, error } = await useFetch('/api/files', {
    method: 'POST',
    body: {
      path: folder
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (process.server && error) {
    const newerror = new Error();
    newerror.statusCode = 404;
    nuxtApp.ssrContext.nuxt.error = newerror;
  }
</script>

<template lang="pug">
div(class="dark")
  div(v-if="error")
    p(class="text-red-500")
      | pwet erreur
  div(v-else class="flex flex-col min-h-screen font-sans bg-gray-800 test")
    header(class="shadow sticky top-0" :class="classBg")
      div(class="border-b text-white" :class="classDarkBorder")
        div(class="container flex flex-wrap justify-between items-center space-x-6 mx-auto p-4 md:flex-row xl:max-w-screen-xl")
          a(class="flex items-center space-x-2 p-1" href="/" title="Home")
            i(class='fas fa-folder-open text-xl') &nbsp;
            span(class="text-xl font-semibold") 
              | {{title}}
      div(class="border-t text-white" :class="classLightBorder")
        div(class="container flex flex-wrap justify-between items-center space-x-6 mx-auto px-4 py-1 md:flex-row xl:max-w-screen-xl")
          div(class="flex-1 font-mono text-white text-sm tracking-tight overflow-x-auto whitespace-nowrap py-1")
            span 
              a.underline(href="/") Home
              | &nbsp;/&nbsp;
            span(v-for="item, index in decodeURI(data.path).split('/')" :key="index")
              span(v-if="index==decodeURI(data.path).split('/').length-1")
                | {{item}}
              a.underline(v-if="index!=decodeURI(data.path).split('/').length-1" href=item)
                | {{item}}
              span(v-if="index>0 && index<decodeURI(data.path).split('/').length-1") &nbsp;/&nbsp;
              
    div(class="flex flex-col flex-grow container mx-auto px-4 xl:max-w-screen-xl text-white")
      div(class="my-4")
        div(class="flex justify-between font-bold p-4")
          div(class="hidden pr-2") -
          div(class="flex-grow font-mono mr-2 text-left") File name
          div(class="hidden ml-2") -
          div(class="font-mono text-right w-1/6 mx-2 hidden sm:block") Size
          div(class="font-mono text-right w-1/4 ml-2 hidden sm:block") Date
        ul
          li(v-if='data.path!=="/"')
            a(:href="data.parent" class="flex flex-col items-center rounded-lg font-mono group hover:shadow" :class="classHoverBg")
              div(class="flex items-center p-4 w-full")
                div(class="pr-2")
                  i(class="fas fa-level-up-alt fa-fw fa-lg")
                div(class="flex-1 truncate text-left") ..
                div(class="hidden ml-2") -
                div(class="hidden whitespace-nowrap mx-2 w-1/6") -
                div(class="hidden whitespace-nowrap truncate ml-2 w-1/4") -
          li(v-for="file in data.files" :key="file")
            a(:href="file.url" class="flex flex-col items-center rounded-lg font-mono group hover:shadow" :class="classHoverBg")
              div(class="flex justify-between items-center p-4 w-full")
                div(class="pr-2")
                  i(v-if='file.isDirectory' class="fas fa-folder-open fa-fw fa-lg")
                  i(v-else class="fas fa-file fa-fw fa-lg")
                div(class="flex-1 truncate") {{ file.name }}
                div(class="hidden ml-2") todo
                div(class="whitespace-nowrap text-right mx-2 w-1/6 sm:block") {{file.size>0?file.size:''}}
                div(class="whitespace-nowrap text-right truncate ml-2 w-1/4 sm:block") {{file.date}}
</template>

<script>
  export default {
    head: {
      bodyAttrs: {
        class: ''
      }
    },
    html: {
      bodyAttrs: {
        class: ''
      }
    }
  }
</script>
