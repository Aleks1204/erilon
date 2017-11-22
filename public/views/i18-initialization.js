// var language = 'en';
// console.log(window.location.hostname);
if (window.location.hostname.match('en') !== null) {
    language = 'en';
}
window.i18next
    .use(window.i18nextXHRBackend);

window.i18next.init({
    fallbackLng: 'ru',
    lng: language,
    debug: true,
    backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    useCookie: false,
    useLocalStorage: false
}, function (err, t) {
    console.log('resources loaded');
});