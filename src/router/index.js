import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/profile/submit/:product_barcode",
    name: "提交档案",
    component: () =>
      import(
        /* webpackChunkName: "submitprofile" */ "../views/profile/SubmitProfile.vue"
      ),
  },
  {
    path: "/profile/submit",
    name: "预提交档案",
    component: () =>
      import(
        /* webpackChunkName: "submitprofile" */ "../views/profile/SubmitProfile.vue"
      ),
  },
  {
    path: "/product/view/:product_barcode",
    name: "查看产品信息",
    component: () =>
      import(
        /* webpackChunkName: "viewproduct" */ "../views/product/ViewProduct.vue"
      ),
  },
  {
    path: "/manage",
    name: "管理",
    component: () =>
      import(/* webpackChunkName: "manage" */ "../views/manage/Manage.vue"),
    children: [
      {
        path: "products",
        name: "管理产品",
        component: () =>
          import(
            /* webpackChunkName: "manageproducts" */ "../views/manage/Products.vue"
          ),
      },
      {
        path: "profiles",
        name: "管理档案",
        component: () =>
          import(
            /* webpackChunkName: "manageprofiles" */ "../views/manage/Profiles.vue"
          ),
      },
      {
        path: "users",
        name: "管理用户",
        component: () =>
          import(
            /* webpackChunkName: "manageusers" */ "../views/manage/Users.vue"
          ),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404错误",
    component: () =>
      import(
        /* webpackChunkName: "errorresult" */ "../views/error/ErrorResult.vue"
      ),
    props: {
      status: "404",
      messages: {
        title: "资源不存在",
        first: "这可能是二维码损坏了",
        second: "如果多次重试仍是这样，请联系客服",
      },
    },
  },
  {
    path: "/error/401",
    name: "401错误",
    component: () =>
      import(
        /* webpackChunkName: "errorresult" */ "../views/error/ErrorResult.vue"
      ),
    props: {
      status: "403",
      messages: {
        title: "权限错误",
        first: "请检查你的账户",
        second: "或许应该重新登录一次",
      },
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "ring-4 ring-current",
});

export default router;
