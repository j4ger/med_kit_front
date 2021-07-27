import nprogress from "nprogress";

export default {
  install: (app, options) => {
    const api = async function (path, method = "GET", data = undefined) {
      nprogress.start();
      const result = await fetch(options.base_url + path, {
        method,
        //TODO: CORS
        credentials: "include",
        ...(data && { body: JSON.stringify(data) }),
      });
      nprogress.done();
      const inner = await result.json();
      if (!inner.success) {
        console.log(inner.message);
        app._context.provides.$toast.error(inner.message);
      }
      return Promise.resolve(inner);
    };
    app.provide("api", api);
    app.provide("toast", app._context.provides.$toast);
  },
};
