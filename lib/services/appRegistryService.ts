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
    {
      id: "csc_nextgen",
      name: "CommunitySafeConnect CSC NextGen",
    },
  ],

  getAll() {
    return this.apps;
  },
};
