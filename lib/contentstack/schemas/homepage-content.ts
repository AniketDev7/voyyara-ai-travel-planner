/**
 * Homepage Content Schema
 * 
 * TEXT ONLY - Design stays in code
 * This content type manages all textual content for the homepage
 */

export const homepageContentSchema = {
  content_type: {
    title: "Homepage Content",
    uid: "homepage_content",
    schema: [
      {
        display_name: "Title",
        uid: "title",
        data_type: "text",
        mandatory: true,
        unique: true,
        field_metadata: {
          description: "Internal identifier (e.g., 'Main Homepage')"
        }
      },

      // ===== HERO SECTION =====
      {
        display_name: "Hero Section",
        uid: "hero",
        data_type: "group",
        schema: [
          {
            display_name: "Tagline",
            uid: "tagline",
            data_type: "text",
            field_metadata: {
              description: "Small text above title (e.g., 'AI-POWERED TRAVEL')"
            }
          },
          {
            display_name: "Title Line 1",
            uid: "title_line1",
            data_type: "text",
            mandatory: true,
            field_metadata: {
              description: "Main headline (e.g., 'Travel differently.')"
            }
          },
          {
            display_name: "Title Line 2 (Highlight)",
            uid: "title_highlight",
            data_type: "text",
            field_metadata: {
              description: "Gradient highlighted text (e.g., 'with AI')"
            }
          },
          {
            display_name: "Description",
            uid: "description",
            data_type: "text",
            mandatory: true,
            field_metadata: {
              multiline: true,
              description: "Supporting paragraph below the headline"
            }
          },
          {
            display_name: "Primary CTA Text",
            uid: "cta_primary_text",
            data_type: "text",
            field_metadata: {
              description: "e.g., '🌏 Start Planning'"
            }
          },
          {
            display_name: "Primary CTA Link",
            uid: "cta_primary_link",
            data_type: "text"
          },
          {
            display_name: "Secondary CTA Text",
            uid: "cta_secondary_text",
            data_type: "text"
          },
          {
            display_name: "Secondary CTA Link",
            uid: "cta_secondary_link",
            data_type: "text"
          }
        ]
      },

      // ===== HOW IT WORKS =====
      {
        display_name: "How It Works Section",
        uid: "how_it_works",
        data_type: "group",
        schema: [
          {
            display_name: "Section Title",
            uid: "title",
            data_type: "text"
          },
          {
            display_name: "Section Subtitle",
            uid: "subtitle",
            data_type: "text"
          },
          {
            display_name: "Steps",
            uid: "steps",
            data_type: "blocks",
            blocks: [
              {
                title: "Step",
                uid: "step",
                schema: [
                  {
                    display_name: "Step Number",
                    uid: "number",
                    data_type: "text",
                    field_metadata: {
                      description: "e.g., '01', '02'"
                    }
                  },
                  {
                    display_name: "Title",
                    uid: "title",
                    data_type: "text",
                    mandatory: true
                  },
                  {
                    display_name: "Description",
                    uid: "description",
                    data_type: "text",
                    mandatory: true,
                    field_metadata: { multiline: true }
                  }
                ]
              }
            ]
          }
        ]
      },

      // ===== WHY VOYYARA =====
      {
        display_name: "Why Voyyara Section",
        uid: "why_voyyara",
        data_type: "group",
        schema: [
          {
            display_name: "Section Title",
            uid: "title",
            data_type: "text"
          },
          {
            display_name: "Section Subtitle",
            uid: "subtitle",
            data_type: "text"
          },
          {
            display_name: "Features",
            uid: "features",
            data_type: "blocks",
            blocks: [
              {
                title: "Feature",
                uid: "feature",
                schema: [
                  {
                    display_name: "Icon",
                    uid: "icon",
                    data_type: "text",
                    field_metadata: {
                      description: "Emoji icon (e.g., ✨, 💰, 🗺️)"
                    }
                  },
                  {
                    display_name: "Title",
                    uid: "title",
                    data_type: "text",
                    mandatory: true
                  },
                  {
                    display_name: "Description",
                    uid: "description",
                    data_type: "text",
                    mandatory: true,
                    field_metadata: { multiline: true }
                  }
                ]
              }
            ]
          },
          {
            display_name: "CTA Text",
            uid: "cta_text",
            data_type: "text"
          },
          {
            display_name: "CTA Link",
            uid: "cta_link",
            data_type: "text"
          }
        ]
      },

      // ===== FEATURED DESTINATIONS =====
      {
        display_name: "Featured Destinations Section",
        uid: "featured_destinations",
        data_type: "group",
        schema: [
          {
            display_name: "Section Title",
            uid: "title",
            data_type: "text"
          },
          {
            display_name: "Section Subtitle",
            uid: "subtitle",
            data_type: "text"
          },
          {
            display_name: "Featured Destinations",
            uid: "destinations",
            data_type: "reference",
            reference_to: ["destination"],
            field_metadata: {
              ref_multiple: true,
              description: "Select destinations to feature on homepage"
            }
          },
          {
            display_name: "View All Text",
            uid: "view_all_text",
            data_type: "text"
          },
          {
            display_name: "View All Link",
            uid: "view_all_link",
            data_type: "text"
          }
        ]
      },

      // ===== WHY CHOOSE US =====
      {
        display_name: "Why Choose Us Section",
        uid: "why_choose_us",
        data_type: "group",
        schema: [
          {
            display_name: "Section Title",
            uid: "title",
            data_type: "text"
          },
          {
            display_name: "Section Subtitle",
            uid: "subtitle",
            data_type: "text"
          },
          {
            display_name: "Features",
            uid: "features",
            data_type: "blocks",
            blocks: [
              {
                title: "Feature",
                uid: "feature",
                schema: [
                  {
                    display_name: "Icon",
                    uid: "icon",
                    data_type: "text"
                  },
                  {
                    display_name: "Title",
                    uid: "title",
                    data_type: "text",
                    mandatory: true
                  },
                  {
                    display_name: "Description",
                    uid: "description",
                    data_type: "text",
                    mandatory: true,
                    field_metadata: { multiline: true }
                  }
                ]
              }
            ]
          }
        ]
      },

      // ===== TESTIMONIALS =====
      {
        display_name: "Testimonials Section",
        uid: "testimonials",
        data_type: "group",
        schema: [
          {
            display_name: "Section Title",
            uid: "title",
            data_type: "text"
          },
          {
            display_name: "Section Subtitle",
            uid: "subtitle",
            data_type: "text"
          },
          {
            display_name: "Reviews",
            uid: "reviews",
            data_type: "blocks",
            blocks: [
              {
                title: "Review",
                uid: "review",
                schema: [
                  {
                    display_name: "Name",
                    uid: "name",
                    data_type: "text",
                    mandatory: true
                  },
                  {
                    display_name: "Location",
                    uid: "location",
                    data_type: "text"
                  },
                  {
                    display_name: "Avatar Emoji",
                    uid: "avatar",
                    data_type: "text",
                    field_metadata: {
                      description: "Emoji avatar (e.g., 👩‍💼, 👨‍💻)"
                    }
                  },
                  {
                    display_name: "Rating",
                    uid: "rating",
                    data_type: "number",
                    field_metadata: {
                      description: "1-5 stars"
                    }
                  },
                  {
                    display_name: "Review Text",
                    uid: "text",
                    data_type: "text",
                    mandatory: true,
                    field_metadata: { multiline: true }
                  }
                ]
              }
            ]
          },
          {
            display_name: "Stats",
            uid: "stats",
            data_type: "blocks",
            blocks: [
              {
                title: "Stat",
                uid: "stat",
                schema: [
                  {
                    display_name: "Number",
                    uid: "number",
                    data_type: "text",
                    mandatory: true,
                    field_metadata: {
                      description: "e.g., '10K+', '4.9/5'"
                    }
                  },
                  {
                    display_name: "Label",
                    uid: "label",
                    data_type: "text",
                    mandatory: true,
                    field_metadata: {
                      description: "e.g., 'Happy Travelers'"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },

      // ===== FINAL CTA =====
      {
        display_name: "Final CTA Section",
        uid: "final_cta",
        data_type: "group",
        schema: [
          {
            display_name: "Icon",
            uid: "icon",
            data_type: "text",
            field_metadata: {
              description: "Large emoji (e.g., 🌏)"
            }
          },
          {
            display_name: "Title",
            uid: "title",
            data_type: "text"
          },
          {
            display_name: "Subtitle",
            uid: "subtitle",
            data_type: "text"
          },
          {
            display_name: "Primary CTA Text",
            uid: "cta_primary_text",
            data_type: "text"
          },
          {
            display_name: "Primary CTA Link",
            uid: "cta_primary_link",
            data_type: "text"
          },
          {
            display_name: "Secondary CTA Text",
            uid: "cta_secondary_text",
            data_type: "text"
          },
          {
            display_name: "Secondary CTA Link",
            uid: "cta_secondary_link",
            data_type: "text"
          },
          {
            display_name: "Trust Badges",
            uid: "trust_badges",
            data_type: "text",
            multiple: true,
            field_metadata: {
              description: "e.g., 'Free to use', 'No credit card', 'Instant results'"
            }
          }
        ]
      }
    ],
    options: {
      title: "title",
      publishable: true,
      is_page: false,
      singleton: true // Only one homepage content entry
    }
  }
};

// TypeScript interface
export interface HomepageContent {
  title: string;
  hero: {
    tagline?: string;
    title_line1: string;
    title_highlight?: string;
    description: string;
    cta_primary_text?: string;
    cta_primary_link?: string;
    cta_secondary_text?: string;
    cta_secondary_link?: string;
  };
  how_it_works: {
    title?: string;
    subtitle?: string;
    steps?: Array<{
      step: {
        number?: string;
        title: string;
        description: string;
      };
    }>;
  };
  why_voyyara: {
    title?: string;
    subtitle?: string;
    features?: Array<{
      feature: {
        icon?: string;
        title: string;
        description: string;
      };
    }>;
    cta_text?: string;
    cta_link?: string;
  };
  featured_destinations: {
    title?: string;
    subtitle?: string;
    destinations?: any[]; // Reference to destination entries
    view_all_text?: string;
    view_all_link?: string;
  };
  why_choose_us: {
    title?: string;
    subtitle?: string;
    features?: Array<{
      feature: {
        icon?: string;
        title: string;
        description: string;
      };
    }>;
  };
  testimonials: {
    title?: string;
    subtitle?: string;
    reviews?: Array<{
      review: {
        name: string;
        location?: string;
        avatar?: string;
        rating?: number;
        text: string;
      };
    }>;
    stats?: Array<{
      stat: {
        number: string;
        label: string;
      };
    }>;
  };
  final_cta: {
    icon?: string;
    title?: string;
    subtitle?: string;
    cta_primary_text?: string;
    cta_primary_link?: string;
    cta_secondary_text?: string;
    cta_secondary_link?: string;
    trust_badges?: string[];
  };
}

