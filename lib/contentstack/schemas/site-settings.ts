/**
 * Site Settings Schema
 * 
 * Centralized settings for navigation, footer, branding
 */

export const siteSettingsSchema = {
  content_type: {
    title: "Site Settings",
    uid: "site_settings",
    schema: [
      {
        display_name: "Title",
        uid: "title",
        data_type: "text",
        mandatory: true,
        unique: true,
        field_metadata: {
          description: "Internal identifier (e.g., 'Global Settings')"
        }
      },

      // ===== BRANDING =====
      {
        display_name: "Branding",
        uid: "branding",
        data_type: "group",
        schema: [
          {
            display_name: "Site Name",
            uid: "site_name",
            data_type: "text",
            mandatory: true,
            field_metadata: {
              description: "e.g., 'Voyyara'"
            }
          },
          {
            display_name: "Site Tagline",
            uid: "tagline",
            data_type: "text",
            field_metadata: {
              description: "e.g., 'AI-Powered Travel Planning'"
            }
          },
          {
            display_name: "Logo Icon",
            uid: "logo_icon",
            data_type: "text",
            field_metadata: {
              description: "Emoji or icon (e.g., '✈️')"
            }
          },
          {
            display_name: "Logo Image",
            uid: "logo_image",
            data_type: "file"
          }
        ]
      },

      // ===== NAVIGATION =====
      {
        display_name: "Main Navigation",
        uid: "main_nav",
        data_type: "blocks",
        field_metadata: {
          description: "Header navigation links"
        },
        blocks: [
          {
            title: "Nav Item",
            uid: "nav_item",
            schema: [
              {
                display_name: "Label",
                uid: "label",
                data_type: "text",
                mandatory: true
              },
              {
                display_name: "URL",
                uid: "url",
                data_type: "text",
                mandatory: true
              },
              {
                display_name: "Open in New Tab",
                uid: "new_tab",
                data_type: "boolean"
              }
            ]
          }
        ]
      },

      // ===== HEADER CTAs =====
      {
        display_name: "Header CTAs",
        uid: "header_ctas",
        data_type: "group",
        schema: [
          {
            display_name: "Sign In Text",
            uid: "sign_in_text",
            data_type: "text"
          },
          {
            display_name: "Sign In Link",
            uid: "sign_in_link",
            data_type: "text"
          },
          {
            display_name: "Primary CTA Text",
            uid: "primary_cta_text",
            data_type: "text"
          },
          {
            display_name: "Primary CTA Link",
            uid: "primary_cta_link",
            data_type: "text"
          }
        ]
      },

      // ===== FOOTER =====
      {
        display_name: "Footer",
        uid: "footer",
        data_type: "group",
        schema: [
          {
            display_name: "Description",
            uid: "description",
            data_type: "text",
            field_metadata: { multiline: true }
          },
          {
            display_name: "Footer Sections",
            uid: "sections",
            data_type: "blocks",
            blocks: [
              {
                title: "Footer Section",
                uid: "footer_section",
                schema: [
                  {
                    display_name: "Section Title",
                    uid: "title",
                    data_type: "text",
                    mandatory: true
                  },
                  {
                    display_name: "Links",
                    uid: "links",
                    data_type: "blocks",
                    blocks: [
                      {
                        title: "Link",
                        uid: "link",
                        schema: [
                          {
                            display_name: "Label",
                            uid: "label",
                            data_type: "text",
                            mandatory: true
                          },
                          {
                            display_name: "URL",
                            uid: "url",
                            data_type: "text",
                            mandatory: true
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            display_name: "Copyright Text",
            uid: "copyright",
            data_type: "text",
            field_metadata: {
              description: "e.g., '© 2025 Voyyara. Powered by AI and Contentstack.'"
            }
          }
        ]
      },

      // ===== SOCIAL LINKS =====
      {
        display_name: "Social Links",
        uid: "social_links",
        data_type: "blocks",
        blocks: [
          {
            title: "Social Link",
            uid: "social_link",
            schema: [
              {
                display_name: "Platform",
                uid: "platform",
                data_type: "text",
                enum: {
                  advanced: true,
                  choices: [
                    { value: "twitter", key: "twitter" },
                    { value: "instagram", key: "instagram" },
                    { value: "facebook", key: "facebook" },
                    { value: "linkedin", key: "linkedin" },
                    { value: "youtube", key: "youtube" },
                    { value: "tiktok", key: "tiktok" }
                  ]
                }
              },
              {
                display_name: "URL",
                uid: "url",
                data_type: "text",
                mandatory: true
              }
            ]
          }
        ]
      },

      // ===== CONTACT INFO =====
      {
        display_name: "Contact Information",
        uid: "contact",
        data_type: "group",
        schema: [
          {
            display_name: "Email",
            uid: "email",
            data_type: "text"
          },
          {
            display_name: "Phone",
            uid: "phone",
            data_type: "text"
          },
          {
            display_name: "WhatsApp",
            uid: "whatsapp",
            data_type: "text"
          },
          {
            display_name: "Address",
            uid: "address",
            data_type: "text",
            field_metadata: { multiline: true }
          }
        ]
      },

      // ===== SEO DEFAULTS =====
      {
        display_name: "Default SEO",
        uid: "default_seo",
        data_type: "group",
        schema: [
          {
            display_name: "Default Title Suffix",
            uid: "title_suffix",
            data_type: "text",
            field_metadata: {
              description: "e.g., '| Voyyara - AI Travel Planner'"
            }
          },
          {
            display_name: "Default Description",
            uid: "description",
            data_type: "text",
            field_metadata: { multiline: true }
          },
          {
            display_name: "Default OG Image",
            uid: "og_image",
            data_type: "file"
          }
        ]
      }
    ],
    options: {
      title: "title",
      publishable: true,
      is_page: false,
      singleton: true // Only one site settings entry
    }
  }
};

// TypeScript interface
export interface SiteSettings {
  title: string;
  branding: {
    site_name: string;
    tagline?: string;
    logo_icon?: string;
    logo_image?: { url: string };
  };
  main_nav?: Array<{
    nav_item: {
      label: string;
      url: string;
      new_tab?: boolean;
    };
  }>;
  header_ctas?: {
    sign_in_text?: string;
    sign_in_link?: string;
    primary_cta_text?: string;
    primary_cta_link?: string;
  };
  footer: {
    description?: string;
    sections?: Array<{
      footer_section: {
        title: string;
        links?: Array<{
          link: {
            label: string;
            url: string;
          };
        }>;
      };
    }>;
    copyright?: string;
  };
  social_links?: Array<{
    social_link: {
      platform: string;
      url: string;
    };
  }>;
  contact?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
  };
  default_seo?: {
    title_suffix?: string;
    description?: string;
    og_image?: { url: string };
  };
}

