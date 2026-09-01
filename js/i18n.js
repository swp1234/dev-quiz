class I18n{
 constructor(){this.supportedLanguages=['ko','en','ja','es','pt','zh','id','tr','de','fr','hi','ru'];this.currentLang=this.detect();this.translations={}}
 detect(){const q=new URLSearchParams(location.search).get('lang');if(this.supportedLanguages.includes(q))return q;try{const s=localStorage.getItem('dev_quiz_language');if(this.supportedLanguages.includes(s))return s}catch{}const b=(navigator.language||'en').split('-')[0];return this.supportedLanguages.includes(b)?b:'en'}
 async load(lang){if(this.translations[lang])return;const r=await fetch(`/dev-quiz/js/locales/${lang}.json`);if(!r.ok)throw Error(`locale ${lang}: ${r.status}`);this.translations[lang]=await r.json()}
 t(key){let value=this.translations[this.currentLang]||this.translations.en||{};for(const part of key.split('.'))value=value?.[part];return typeof value==='string'?value:key}
 format(key,values={}){return Object.entries(values).reduce((text,[name,value])=>text.replaceAll(`{${name}}`,value),this.t(key))}
 async setLanguage(lang){if(!this.supportedLanguages.includes(lang))return;try{await this.load(lang);this.currentLang=lang;localStorage.setItem('dev_quiz_language',lang)}catch{if(lang!=='en'){await this.load('en');this.currentLang='en'}}this.render()}
 render(){document.documentElement.lang=this.currentLang;document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=this.t(el.dataset.i18n));const select=document.getElementById('language');if(select)select.value=this.currentLang;document.querySelectorAll('[data-target-slug]').forEach(a=>a.href=`/${a.dataset.targetSlug}/?lang=${this.currentLang}`);document.dispatchEvent(new CustomEvent('devquiz:language'))}
 async init(){await this.load(this.currentLang).catch(async()=>{this.currentLang='en';await this.load('en')});const select=document.getElementById('language');for(const lang of this.supportedLanguages){const option=document.createElement('option');option.value=lang;option.textContent=lang.toUpperCase();select.append(option)}select.addEventListener('change',()=>this.setLanguage(select.value));this.render()}
 getCurrentLanguage(){return this.currentLang}
}
window.i18n=new I18n();
