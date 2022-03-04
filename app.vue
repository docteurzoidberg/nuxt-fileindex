<script setup>
  import { useNuxtApp } from '#app'
  const nuxtApp = await useNuxtApp();
  const folder =  nuxtApp.ssrContext ? nuxtApp.ssrContext.url : document.location.pathname;
  const parent = folder.split('/').length > 2 ? folder.split('/').slice(0, -1).join('/') : '/';
  const title = nuxtApp.$config.title;
  const classBg = 'bg-'+nuxtApp.$config.color+'-600';
  const classLightBorder = 'border-' + nuxtApp.$config.color + '-600';
  const classDarkBorder = 'border-' + nuxtApp.$config.color + '-800';
  const classHoverBg = 'hover:bg-' + nuxtApp.$config.color + '-700';

  const humanReadableSize = (size) => {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  };

  const getItemIcon = (file) => {
    const fileExt = file.split('.').pop();
    if (fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'png' || fileExt === 'gif') {
      return 'image';
    } else if (fileExt === 'mkv' || fileExt === 'avi' || fileExt === 'mp4' || fileExt === 'flv' || fileExt === 'webm' || fileExt === 'mov' || fileExt === 'wmv' || fileExt === 'mpg' || fileExt === 'mpeg' || fileExt === 'm4v' || fileExt === '3gp' || fileExt === 'ts') {
      return 'video';
    } else if (fileExt === 'pdf') {
      return 'file-pdf';
    } else if (fileExt === 'doc' || fileExt === 'docx') {
      return 'file-word';
    } else if (fileExt === 'xls' || fileExt === 'xlsx') {
      return 'file-excel';
    } else if (fileExt === 'ppt' || fileExt === 'pptx') {
      return 'file-powerpoint';
    } else if (fileExt === 'zip' || fileExt === 'rar') {
      return 'file-archive';
    } else if (fileExt === 'txt') {
      return 'file-alt';
    } else {
      return 'file';
    }
  };

  const getFolderIcon = (folder) => {
    if(folder.size===2) {
      return 'folder-open';
    } else {
      return 'folder';
    }
  }

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  const filterList = (list, filter) => {
    return list.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));
  };

  const classSearchHidden = (show) => {
    return !show ? 'hidden' : '';
  };

  const classToggleSearch = (show, search) => {
    return show ? (search != '' ? 'text-pink-600' : 'text-gray-300') : 'text-white';
  };

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
  div(v-if="error" class="flex flex-col min-h-screen font-sans items-center justify-center bg-gray-800")
    h1(class="text-white error")
      | 404
    h1(class="text-red-300 text-2xl")
      | Fichier ou dossier introuvable
    a(:href="parent" class="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-4 px-4 rounded outline-none focus:shadow-outline")
      | Retour
  div(v-else class="flex flex-col min-h-screen font-sans bg-gray-800 test")
    header(class="shadow sticky top-0" :class="classBg")
      div(class="border-b" :class="classDarkBorder")
        div(class="container flex flex-wrap justify-between items-center space-x-6 mx-auto p-4 md:flex-row xl:max-w-screen-xl")
          div(class="flex items-center")
            a(class="space-x-2 p-1" href="/" title="Home")
              i(class='fas fa-folder-open text-2xl text-white') &nbsp;
              span(class="text-xl font-semibold text-white") 
                | {{title}}
          div(class="flex items-center")
            div(class="w-full" id="search-content" :class="classSearchHidden(showSearch)")
              input(v-model="search" ref="searchfield" id="searchfield" type="search" placeholder="Filtrer..." class="rounded px-2 py-2 w-full text-gray-700 transition focus:outline-none focus:border-pink-700 border-4 p-2 appearance-none leading-normal text-xl lg:text-2xl")
            
          div(class="flex items-center")
            div(v-on:click="toggleSearch" id="search-toggle" class="search-icon cursor-pointer pl-6 space-x-2 p-1")
              i(class="fas fa-filter text-lg" :class="classToggleSearch(showSearch,search)")

      div(class="border-t text-white" :class="classLightBorder")
        div(class="container flex flex-wrap justify-between items-center space-x-6 mx-auto px-4 py-1 md:flex-row xl:max-w-screen-xl")
          div(class="flex-1 font-mono text-white text-sm tracking-tight overflow-x-auto whitespace-nowrap py-1")
            span 
              a.underline(href="/") Home
              | &nbsp;/&nbsp;
            span(v-for="item, index in decodeURI(data.path).split('/')" :key="index")
              span(v-if="index==decodeURI(data.path).split('/').length-1")
                | {{item}}
              a.underline(v-if="index!=decodeURI(data.path).split('/').length-1" :href="decodeURI(data.path).split('/').slice(0,-index).join('/')+'/'")
                | {{item}}
              span(v-if="index>0 && index<decodeURI(data.path).split('/').length-1") &nbsp;/&nbsp;
              
    div(class="flex flex-col flex-grow container mx-auto px-4 xl:max-w-screen-xl text-white")
      div(class="my-4")
        div(class="flex justify-between font-bold p-4")
          div(class="hidden pr-2") -
          div(class="flex-grow font-mono mr-2 text-left") Nom
          div(class="hidden ml-2") -
          div(class="font-mono text-right w-1/6 mx-2 hidden sm:block") Taille
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
          li(v-for="file in (search!=''? filterList(data.files,search) : data.files)" :key="file")
            a(:href="file.url" class="flex flex-col items-center rounded-lg font-mono group hover:shadow" :class="classHoverBg")
              div(class="flex justify-between items-center p-4 w-full")
                div(class="pr-2")
                  i(v-if='file.isDirectory' class="fas fa-fw fa-lg text-yellow-300" :class="'fa-'+ getFolderIcon(file)")
                  i(v-else class="fas fa-fw fa-lg text-blue-400" :class="'fa-'+getItemIcon(file.name)")
                div(class="flex-1 truncate") {{ file.name }}
                div(class="hidden ml-2") todo: popup info fichiers / metas
                div(class="whitespace-nowrap text-right mx-2 w-1/6 sm:block") {{(file.size>0 && !file.isDirectory )?humanReadableSize(file.size):''}}
                div(class="whitespace-nowrap text-right truncate ml-2 w-1/4 sm:block") {{formatDate(file.date)}}
      
          li(v-if="filterList(data.files,search).length==0" class="p-4 text-center text-white text-2xl")
            | Aucun résultat
          li(v-if="search!=''") 
           div(class="my-4 p-4 font-mono")
            i(class="fas fa-filter text-md text-pink-300") &nbsp;
            | + {{data.files.length - filterList(data.files,search).length }} element(s) filtré(s) &nbsp;
            
</template>

<script>
  export default {
    data() {
      return {
        search: '',
        showSearch: false,
      }
    },
    methods: { 
      scrollToTop() {
        window.scrollTo(0,0);
      },
      toggleSearch() {
        this.showSearch = !this.showSearch;
        if(!this.showSearch) {
          this.search = '';
        } else {
          this.$nextTick(() => {
            this.$refs.searchfield.focus();
          });
         
        }
      },
    },
   
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
<style>
.error {
  font-size: 12rem;
}
</style>
