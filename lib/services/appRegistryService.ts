export const appRegistryService = {
  apps: [
    {
      id: "safeconnect",
      name: "SafeConnect",
      repo: "bigapc/homework",
    },
    {
      id: "communitysafeconnect",
      name: "CommunitySafeConnect",
    },
    {
      id: "csc_2_0",
      name: "CommunitySafeConnect CSC 2.0",
    },
  ],

  getAll() {
    return this.apps;
  },
};
