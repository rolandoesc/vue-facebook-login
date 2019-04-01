import FacebookLogin from './Facebook.vue'
export const facebookLoginPlugin = {
    install: function (Vue, options) {
        Vue.component(FacebookLogin.name, FacebookLogin)
    }
}
export default FacebookLogin