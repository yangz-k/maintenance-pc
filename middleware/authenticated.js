import utils from '~/utils/auth'

export default function ({store, route, req, res, redirect}) {
  let isClient = process.client;
  let isServer = process.server;
  let redirectURL = '/login';
  var token, path
  //在服务端
  if (isServer) {
    let cookies = utils.getcookiesInServer(req)
     //path = req&&req.originalUrl ? req.originalUrl : "/";
    //这里获取不到值会直接跳到login
    token = cookies.userToken ? cookies.userToken : ''

  }
  //在客户端判读是否需要登陆
  if (isClient) {
    token = utils.getcookiesInClient('userToken')
    path = route.path;

  }
  /* if (path) {
    redirectURL = '/login?ref=' + encodeURIComponent(path)
  } */
  //需要进行权限判断的页面开头
  if (!token) {
       redirect(redirectURL)
  }else{
    console.log("---authenticated.js---path:"+path)
  }


}
