<script setup>
  import { useNuxtApp } from '#app'
  const nuxtApp = await useNuxtApp();
  const folder =  nuxtApp.ssrContext ? nuxtApp.ssrContext.url : document.location.pathname;
  const { data } = await useAsyncData('files', () => $fetch('/api/files', {
    method: 'POST',
    body: {
      path: folder
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }));
</script>

<template lang="pug">
div(class="dark")
  div(class="flex flex-col min-h-screen font-sans dark:bg-gray-800 test")
    header(class="shadow sticky top-0 bg-cyan-700")
      div(class="border-b border-cyan-700 dark:border-cyan-800 text-white") 
        div(class="container flex flex-wrap justify-between items-center space-x-6 mx-auto p-4 md:flex-row xl:max-w-screen-xl")
          a(class="flex items-center space-x-2 p-1" href="/" title="Home")
            i(class='fas fa-folder-open text-xl') &nbsp;
            span(class="text-xl font-semibold") 
              | DRZ Web File Index
      div(class="border-t border-cyan-500 dark:border-cyan-600 text-white")
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
              
    div(class="flex flex-col flex-grow container mx-auto px-4 xl:max-w-screen-xl dark:text-white")
      div(class="my-4")
        div(class="flex justify-between font-bold p-4")
          div(class="hidden pr-2") -
          div(class="flex-grow font-mono mr-2 text-left") File name
          div(class="hidden ml-2") -
          div(class="font-mono text-right w-1/6 mx-2 hidden sm:block") Size
          div(class="font-mono text-right w-1/4 ml-2 hidden sm:block") Date
        ul
          li(v-if='data.path!=="/"')
            a(:href="data.parent" class="flex flex-col items-center rounded-lg font-mono group hover:bg-gray-100 hover:shadow dark:hover:bg-cyan-700")
              div(class="flex items-center p-4 w-full")
                div(class="pr-2")
                  i(class="fas fa-level-up-alt fa-fw fa-lg")
                div(class="flex-1 truncate text-left") ..
                div(class="hidden ml-2") -
                div(class="hidden whitespace-nowrap mx-2 w-1/6") -
                div(class="hidden whitespace-nowrap truncate ml-2 w-1/4") -
          li(v-for="file in data.files" :key="file")
            a(:href="file.url" class="flex flex-col items-center rounded-lg font-mono group hover:bg-gray-100 hover:shadow dark:hover:bg-cyan-700")
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
