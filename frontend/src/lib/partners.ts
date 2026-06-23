/**
 * Partners tecnológicos con su logo (SVG en /public/partners).
 * Para añadir uno nuevo: coloca el SVG/PNG en public/partners/ y agrégalo aquí.
 * Si falta el archivo, el componente PartnerLogo muestra el nombre como fallback.
 */

export type Partner = { name: string; logo?: string };

export const partnersByCategory: { category: string; items: Partner[] }[] = [
  {
    category: "Cloud & Hosting",
    items: [
      { name: "AWS", logo: "/partners/aws.svg" },
      { name: "Microsoft Azure", logo: "/partners/azure.svg" },
      { name: "Google Cloud", logo: "/partners/googlecloud.svg" },
      { name: "Oracle", logo: "/partners/oracle.svg" },
      { name: "IBM Cloud", logo: "/partners/ibmcloud.svg" },
      { name: "DigitalOcean", logo: "/partners/digitalocean.svg" },
    ],
  },
  {
    category: "Redes & Cómputo",
    items: [
      { name: "Cisco", logo: "/partners/cisco.svg" },
      { name: "Dell Technologies", logo: "/partners/dell.svg" },
      { name: "Lenovo", logo: "/partners/lenovo.svg" },
      { name: "VMware", logo: "/partners/vmware.svg" },
      { name: "Microsoft 365", logo: "/partners/microsoft365.svg" },
    ],
  },
  {
    category: "Ciberseguridad & Backup",
    items: [
      { name: "Fortinet", logo: "/partners/fortinet.svg" },
      { name: "SonicWall", logo: "/partners/sonicwall.svg" },
      { name: "Veeam", logo: "/partners/veeam.svg" },
    ],
  },
];

/** Lista plana para el marquee de la home. */
export const featuredPartners: Partner[] = [
  { name: "AWS", logo: "/partners/aws.svg" },
  { name: "Microsoft Azure", logo: "/partners/azure.svg" },
  { name: "Google Cloud", logo: "/partners/googlecloud.svg" },
  { name: "Cisco", logo: "/partners/cisco.svg" },
  { name: "VMware", logo: "/partners/vmware.svg" },
  { name: "Oracle", logo: "/partners/oracle.svg" },
  { name: "Dell Technologies", logo: "/partners/dell.svg" },
  { name: "Veeam", logo: "/partners/veeam.svg" },
  { name: "Fortinet", logo: "/partners/fortinet.svg" },
  { name: "Microsoft 365", logo: "/partners/microsoft365.svg" },
  { name: "IBM Cloud", logo: "/partners/ibmcloud.svg" },
  { name: "Lenovo", logo: "/partners/lenovo.svg" },
  { name: "DigitalOcean", logo: "/partners/digitalocean.svg" },
  { name: "SonicWall", logo: "/partners/sonicwall.svg" },
];
