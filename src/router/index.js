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
    path: "/product/view/:product_barcode",
    name: "查看产品信息",
    component: () =>
      import(
        /* webpackChunkName: "viewproduct" */ "../views/product/ViewProduct.vue"
      ),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "页面不存在",
    component: () =>
      import(/* webpackChunkName: "notfound" */ "../views/error/NotFound.vue"),
    props: {
      messages: {
        first: "这可能是二维码损坏了",
        second: "如果多次重试仍是这样，请联系客服",
      },
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
