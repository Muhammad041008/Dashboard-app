// src/data/seed.js
export const seedData = {
  categories: [
    {
      id: 'c_cnapp',
      name: 'CNAPP Dashboard',
      widgets: [
        { id: 'w_cnapp_1', name: 'Cloud Account Risk Assessment', content: 'Random text' },
        { id: 'w_cnapp_2', name: 'Top 5 Namespace Specific Alerts', content: 'Random text' },
      ],
    },
    {
      id: 'c_cspm',
      name: 'CSPM Executive Dashboard',
      widgets: [
        { id: 'w_cspm_1', name: 'Workload Alerts', content: 'Random text' },
        { id: 'w_cspm_2', name: 'Registry Scan', content: 'Random text' },
      ],
    },
    {
      id: 'c_cloud',
      name: 'Cloud Accounts',
      widgets: [
        { id: 'w_cloud_1', name: 'Connected', content: 'Random text' },
        { id: 'w_cloud_2', name: 'Not Connected', content: 'Random text' },
      ],
    },
    {
      id: 'c_cwpp',
      name: 'CWPP Dashboard',
      widgets: [
        { id: 'w_cwpp_1', name: 'Image Risk Assessment', content: 'Random text' },
        { id: 'w_cwpp_2', name: 'Image Security Issues', content: 'Random text' },
      ],
    },
  ],
};
