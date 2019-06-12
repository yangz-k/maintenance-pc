const webpack = require('webpack');
const pkg = require('./package')
const pkName = process.env.SITE_ENV === 'prod' ? '/maintenance-pc2.0' : (process.env.SITE_ENV === 'test' ? '/maintenance-test' : '/maintenance-dev');
const pageName = process.env.SITE_ENV === 'prod' ? 'maintenance-pc2.0' : (process.env.SITE_ENV === 'test' ? 'maintenance-test' : 'maintenance-dev');

module.exports = {
  mode: 'universal',
  // router: {
  //   base: pkName //此为根目录，如果有具体目录需求按实际情况写
  // },
  // // //打包配置
  // generate: {
  //   dir: pageName
  // },
  /*
   ** Headers of the page
   */
  head: {
    title: '安云维保助手',
    meta: [{
      charset: 'utf-8'
    },
    {
      'http-equiv': 'pragma',
      content: 'no-cache'
    },
    {
      'http-equiv': 'cache-control',
      content: 'no-cache'
    },
    {
      'http-equiv': 'expires',
      content: '0'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'
      //content: 'width=device-width, initial-scale=0.25, maximum-scale=1.5, minimum-scale=0.1, user-scalable=yes'
    },
    {
      hid: 'description',
      name: 'description',
      content: 'Nuxt.js project'
    }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: pkName + '/favicon-maintenance.ico'
      // href: '/favicon-maintenance.ico'
    }],
    script: []
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#3B8070' },

  /*
   ** Global CSS
   */
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{
    src: '~/plugins/element-ui',
    ssr: true
  },
  {
    src: "~/plugins/tsgis",
    ssr: false
  },
  {
    src: "~/plugins/webSocket",
    ssr: false
  },
  {
    src: '~/plugins/echarts',
    ssr: false
  },
  {
    src: '~/plugins/jquery',
    ssr: false
  },
  {
    src: '~/plugins/i18n.js',
    ssr: false
  }, {
    src: '~/plugins/rili_script',
    ssr: false
  }, {
    src: '~/plugins/directives',
    ssr: false
  }, {
    src: '~/plugins/growingIO',
    ssr: false
  }
  ],
  css: [
    'node_modules/element-ui/lib/theme-chalk/index.css',
    'node_modules/ztree/css/zTreeStyle/zTreeStyle.css',
    'node_modules/swiper/dist/idangerous.swiper.css',
    '~/assets/css/layout.scss',
    '~/assets/maintenance-font/style.css'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [

  ],

  /*
   ** Build configuration
   */
  build: {
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery"
      })

    ],
    transpile: [/^element-ui/],
    //start loaders
    loaders: [{
      test: /\.(scss|sass)$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader"
      }, {
        loader: "sass-loader"
      }]
    },
    {
      test: /\.(png|jpe?g|gif|ico|svg)$/,
      loader: 'url-loader',
      query: {
        limit: 1000,
        name: 'img/[name].[hash:7].[ext]',
        publicPath: '../../assets/image/',
        outputPath: '../../assets/image/'
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        limit: 1000,
        name: 'fonts/[name].[hash:7].[ext]'
      }
    },
    {
      test: /\.(jpg|jpeg|png|gif|ico|svg)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '../../assets/img/',
          outputPath: '../../assets/img/'
        }
      }]
    }

    ], //loaders end
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {

    }
  }
}
