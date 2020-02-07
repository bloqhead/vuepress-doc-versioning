export default ({ Vue, options, router, siteData, isServer }) => {
  router.beforeEach((to, from, next) => {
    /**
     * find the version in the URI
     * and push it to the route as a param so
     * that we can access it later.
     */
    const query = /(\d+\.)(\d+\.)?(\d+\.)(\d)/gm;
    const match = to.path.match ? to.path.match(query)[0] : null;

    if (!to.params.version && match) {
      to.params.version = match;
      next();
    } else {
      next();
    }
  });
};
