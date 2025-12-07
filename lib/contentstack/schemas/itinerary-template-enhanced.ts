/**
 * Enhanced Itinerary Template Schema
 * 
 * Inspired by best practices from travel platforms like Layla.ai
 * Designed for rich, detailed travel itineraries with:
 * - JSON RTE for rich text content
 * - Modular Blocks for flexible day-by-day structure
 * - Groups for organized data
 * - Asset references for images
 * - Hidden gems, dining, neighborhoods sections
 */

export const itineraryTemplateEnhancedSchema = {
  content_type: {
    title: "Itinerary Template",
    uid: "itinerary_template_v2",
    schema: [
      // ===== BASIC INFO =====
      {
        display_name: "Title",
        uid: "title",
        data_type: "text",
        mandatory: true,
        unique: true,
        field_metadata: {
          description: "Itinerary name (e.g., 'Cultural Discovery Japan')"
        }
      },
      {
        display_name: "Slug",
        uid: "slug",
        data_type: "text",
        mandatory: true,
        unique: true,
        field_metadata: {
          description: "URL-friendly identifier (e.g., 'japan-cultural')"
        }
      },
      {
        display_name: "Destination",
        uid: "destination",
        data_type: "reference",
        reference_to: ["destination"],
        mandatory: true,
        field_metadata: {
          ref_multiple: false
        }
      },
      {
        display_name: "Trip Type",
        uid: "trip_type",
        data_type: "text",
        mandatory: true,
        enum: {
          advanced: true,
          choices: [
            { value: "cultural", key: "cultural" },
            { value: "adventure", key: "adventure" },
            { value: "relaxation", key: "relaxation" },
            { value: "food_culinary", key: "food_culinary" },
            { value: "romantic", key: "romantic" },
            { value: "family", key: "family" },
            { value: "road_trip", key: "road_trip" },
            { value: "city_break", key: "city_break" },
            { value: "beach", key: "beach" },
            { value: "wildlife", key: "wildlife" }
          ]
        }
      },
      {
        display_name: "Duration",
        uid: "duration",
        data_type: "group",
        schema: [
          {
            display_name: "Nights",
            uid: "nights",
            data_type: "number",
            mandatory: true
          },
          {
            display_name: "Days",
            uid: "days",
            data_type: "number",
            mandatory: true
          },
          {
            display_name: "Display Text",
            uid: "display_text",
            data_type: "text",
            field_metadata: {
              description: "e.g., '7 Nights / 8 Days' or 'Long Weekend'"
            }
          }
        ]
      },

      // ===== IMAGES =====
      {
        display_name: "Hero Image",
        uid: "hero_image",
        data_type: "file",
        field_metadata: {
          description: "Main banner image (1920x1080 recommended)"
        }
      },
      {
        display_name: "Thumbnail",
        uid: "thumbnail",
        data_type: "file",
        field_metadata: {
          description: "Card thumbnail (600x400 recommended)"
        }
      },
      {
        display_name: "Gallery",
        uid: "gallery",
        data_type: "file",
        multiple: true
      },
      {
        display_name: "Video URL",
        uid: "video_url",
        data_type: "text",
        field_metadata: {
          description: "YouTube/Vimeo embed URL for trip preview"
        }
      },

      // ===== DESCRIPTIONS =====
      {
        display_name: "Tagline",
        uid: "tagline",
        data_type: "text",
        mandatory: true,
        field_metadata: {
          description: "Short catchy phrase (e.g., 'Where ancient traditions meet futuristic innovation')"
        }
      },
      {
        display_name: "Short Description",
        uid: "short_description",
        data_type: "text",
        mandatory: true,
        field_metadata: {
          multiline: true,
          description: "2-3 sentences for cards (max 200 chars)"
        }
      },
      {
        display_name: "Overview",
        uid: "overview",
        data_type: "json",
        field_metadata: {
          allow_json_rte: true,
          rich_text_type: "advanced",
          description: "Detailed trip overview - what makes this journey special, key experiences, why travelers love it"
        }
      },

      // ===== PRICING =====
      {
        display_name: "Pricing",
        uid: "pricing",
        data_type: "group",
        schema: [
          {
            display_name: "Starting Price",
            uid: "starting_price",
            data_type: "number",
            field_metadata: {
              description: "Base price in USD"
            }
          },
          {
            display_name: "Display Price",
            uid: "display_price",
            data_type: "text",
            mandatory: true,
            field_metadata: {
              description: "e.g., 'From $2,500' or '₹1,85,000 onwards'"
            }
          },
          {
            display_name: "Price Per",
            uid: "price_per",
            data_type: "text",
            field_metadata: {
              description: "e.g., 'per person, twin sharing'"
            }
          },
          {
            display_name: "Budget Breakdown",
            uid: "budget_breakdown",
            data_type: "blocks",
            blocks: [
              {
                title: "Cost Item",
                uid: "cost_item",
                schema: [
                  {
                    display_name: "Category",
                    uid: "category",
                    data_type: "text",
                    enum: {
                      advanced: true,
                      choices: [
                        { value: "accommodation", key: "accommodation" },
                        { value: "flights", key: "flights" },
                        { value: "transport", key: "transport" },
                        { value: "activities", key: "activities" },
                        { value: "meals", key: "meals" },
                        { value: "misc", key: "misc" }
                      ]
                    }
                  },
                  {
                    display_name: "Description",
                    uid: "description",
                    data_type: "text"
                  },
                  {
                    display_name: "Estimated Cost",
                    uid: "estimated_cost",
                    data_type: "text",
                    field_metadata: {
                      description: "e.g., '$800-1200' or '~$500'"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },

      // ===== HIGHLIGHTS =====
      {
        display_name: "Trip Highlights",
        uid: "highlights",
        data_type: "blocks",
        field_metadata: {
          description: "Key selling points of this trip"
        },
        blocks: [
          {
            title: "Highlight",
            uid: "highlight",
            schema: [
              {
                display_name: "Icon",
                uid: "icon",
                data_type: "text",
                field_metadata: {
                  description: "Emoji (e.g., 🏛️, 🍜, 🎎, 🗻)"
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
                field_metadata: { multiline: true }
              }
            ]
          }
        ]
      },

      // ===== HIDDEN GEMS (Inspired by Layla) =====
      {
        display_name: "Hidden Gems",
        uid: "hidden_gems",
        data_type: "blocks",
        field_metadata: {
          description: "Off-the-beaten-path discoveries tourists usually miss"
        },
        blocks: [
          {
            title: "Hidden Gem",
            uid: "hidden_gem",
            schema: [
              {
                display_name: "Name",
                uid: "name",
                data_type: "text",
                mandatory: true
              },
              {
                display_name: "Type",
                uid: "type",
                data_type: "text",
                enum: {
                  advanced: true,
                  choices: [
                    { value: "restaurant", key: "restaurant" },
                    { value: "cafe", key: "cafe" },
                    { value: "viewpoint", key: "viewpoint" },
                    { value: "neighborhood", key: "neighborhood" },
                    { value: "shop", key: "shop" },
                    { value: "experience", key: "experience" },
                    { value: "nature", key: "nature" }
                  ]
                }
              },
              {
                display_name: "Why It's Special",
                uid: "why_special",
                data_type: "json",
                field_metadata: {
                  allow_json_rte: true,
                  rich_text_type: "advanced"
                }
              },
              {
                display_name: "Best Time to Visit",
                uid: "best_time",
                data_type: "text"
              },
              {
                display_name: "Image",
                uid: "image",
                data_type: "file"
              },
              {
                display_name: "Map Link",
                uid: "map_link",
                data_type: "text"
              }
            ]
          }
        ]
      },

      // ===== WHAT'S INCLUDED =====
      {
        display_name: "What's Included",
        uid: "whats_included",
        data_type: "blocks",
        blocks: [
          {
            title: "Inclusion",
            uid: "inclusion",
            schema: [
              {
                display_name: "Icon",
                uid: "icon",
                data_type: "text"
              },
              {
                display_name: "Category",
                uid: "category",
                data_type: "text",
                enum: {
                  advanced: true,
                  choices: [
                    { value: "accommodation", key: "accommodation" },
                    { value: "meals", key: "meals" },
                    { value: "transport", key: "transport" },
                    { value: "flights", key: "flights" },
                    { value: "activities", key: "activities" },
                    { value: "guide", key: "guide" },
                    { value: "insurance", key: "insurance" },
                    { value: "other", key: "other" }
                  ]
                }
              },
              {
                display_name: "Item",
                uid: "item",
                data_type: "text",
                mandatory: true
              },
              {
                display_name: "Details",
                uid: "details",
                data_type: "text",
                field_metadata: { multiline: true }
              }
            ]
          }
        ]
      },

      // ===== WHAT'S NOT INCLUDED =====
      {
        display_name: "What's Not Included",
        uid: "whats_not_included",
        data_type: "text",
        multiple: true,
        field_metadata: {
          description: "Items travelers need to arrange themselves"
        }
      },

      // ===== DAY BY DAY ITINERARY =====
      {
        display_name: "Day by Day Itinerary",
        uid: "day_by_day",
        data_type: "blocks",
        field_metadata: {
          description: "Detailed day-by-day breakdown"
        },
        blocks: [
          {
            title: "Day",
            uid: "day",
            schema: [
              // Day Basic Info
              {
                display_name: "Day Number",
                uid: "day_number",
                data_type: "number",
                mandatory: true
              },
              {
                display_name: "Day Title",
                uid: "day_title",
                data_type: "text",
                mandatory: true,
                field_metadata: {
                  description: "e.g., 'Arrival & First Glimpse of Tokyo'"
                }
              },
              {
                display_name: "Day Subtitle",
                uid: "day_subtitle",
                data_type: "text",
                field_metadata: {
                  description: "e.g., 'From airport chaos to zen gardens'"
                }
              },
              {
                display_name: "Day Image",
                uid: "day_image",
                data_type: "file"
              },
              
              // Day Overview
              {
                display_name: "Day Overview",
                uid: "day_overview",
                data_type: "json",
                field_metadata: {
                  allow_json_rte: true,
                  rich_text_type: "advanced",
                  description: "What to expect today, mood setting"
                }
              },

              // Location for this day
              {
                display_name: "Location",
                uid: "location",
                data_type: "text",
                field_metadata: {
                  description: "City/area for this day (e.g., 'Tokyo - Shibuya & Shinjuku')"
                }
              },

              // Accommodation
              {
                display_name: "Accommodation",
                uid: "accommodation",
                data_type: "group",
                schema: [
                  {
                    display_name: "Property Name",
                    uid: "property_name",
                    data_type: "text"
                  },
                  {
                    display_name: "Property Type",
                    uid: "property_type",
                    data_type: "text",
                    field_metadata: {
                      description: "e.g., 'Traditional Ryokan', 'Boutique Hotel', '4-Star'"
                    }
                  },
                  {
                    display_name: "Neighborhood",
                    uid: "neighborhood",
                    data_type: "text"
                  },
                  {
                    display_name: "Why We Chose This",
                    uid: "why_chosen",
                    data_type: "text",
                    field_metadata: { multiline: true }
                  },
                  {
                    display_name: "Image",
                    uid: "image",
                    data_type: "file"
                  },
                  {
                    display_name: "Booking Link",
                    uid: "booking_link",
                    data_type: "text"
                  }
                ]
              },

              // Meals for the day
              {
                display_name: "Meals",
                uid: "meals",
                data_type: "group",
                schema: [
                  {
                    display_name: "Breakfast",
                    uid: "breakfast",
                    data_type: "group",
                    schema: [
                      { display_name: "Included", uid: "included", data_type: "boolean" },
                      { display_name: "Venue", uid: "venue", data_type: "text" },
                      { display_name: "What to Try", uid: "what_to_try", data_type: "text" }
                    ]
                  },
                  {
                    display_name: "Lunch",
                    uid: "lunch",
                    data_type: "group",
                    schema: [
                      { display_name: "Included", uid: "included", data_type: "boolean" },
                      { display_name: "Recommendation",  uid: "recommendation", data_type: "text" },
                      { display_name: "Cuisine Type", uid: "cuisine_type", data_type: "text" },
                      { display_name: "Must Try Dish", uid: "must_try", data_type: "text" },
                      { display_name: "Price Range", uid: "price_range", data_type: "text" }
                    ]
                  },
                  {
                    display_name: "Dinner",
                    uid: "dinner",
                    data_type: "group",
                    schema: [
                      { display_name: "Included", uid: "included", data_type: "boolean" },
                      { display_name: "Recommendation", uid: "recommendation", data_type: "text" },
                      { display_name: "Cuisine Type", uid: "cuisine_type", data_type: "text" },
                      { display_name: "Must Try Dish", uid: "must_try", data_type: "text" },
                      { display_name: "Price Range", uid: "price_range", data_type: "text" },
                      { display_name: "Reservation Needed", uid: "reservation_needed", data_type: "boolean" }
                    ]
                  }
                ]
              },

              // Activities Timeline
              {
                display_name: "Activities",
                uid: "activities",
                data_type: "blocks",
                blocks: [
                  {
                    title: "Activity",
                    uid: "activity",
                    schema: [
                      {
                        display_name: "Time Slot",
                        uid: "time_slot",
                        data_type: "text",
                        mandatory: true,
                        field_metadata: {
                          description: "e.g., '9:00 AM', 'Morning', 'After breakfast'"
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
                        data_type: "json",
                        field_metadata: {
                          allow_json_rte: true,
                          rich_text_type: "advanced",
                          description: "Rich description with formatting, links, tips"
                        }
                      },
                      {
                        display_name: "Duration",
                        uid: "duration",
                        data_type: "text",
                        field_metadata: {
                          description: "e.g., '2-3 hours', '30 mins'"
                        }
                      },
                      {
                        display_name: "Location",
                        uid: "location",
                        data_type: "text"
                      },
                      {
                        display_name: "Address",
                        uid: "address",
                        data_type: "text"
                      },
                      {
                        display_name: "Entry Fee",
                        uid: "entry_fee",
                        data_type: "text",
                        field_metadata: {
                          description: "e.g., 'Free', '¥1000 (~$7)', 'Included'"
                        }
                      },
                      {
                        display_name: "Booking Required",
                        uid: "booking_required",
                        data_type: "boolean"
                      },
                      {
                        display_name: "Booking Link",
                        uid: "booking_link",
                        data_type: "text"
                      },
                      {
                        display_name: "Pro Tips",
                        uid: "pro_tips",
                        data_type: "text",
                        multiple: true,
                        field_metadata: {
                          description: "Insider tips for this activity"
                        }
                      },
                      {
                        display_name: "What to Bring",
                        uid: "what_to_bring",
                        data_type: "text",
                        multiple: true
                      },
                      {
                        display_name: "Image",
                        uid: "image",
                        data_type: "file"
                      },
                      {
                        display_name: "Activity Type",
                        uid: "activity_type",
                        data_type: "text",
                        enum: {
                          advanced: true,
                          choices: [
                            { value: "sightseeing", key: "sightseeing" },
                            { value: "cultural", key: "cultural" },
                            { value: "food", key: "food" },
                            { value: "shopping", key: "shopping" },
                            { value: "nature", key: "nature" },
                            { value: "adventure", key: "adventure" },
                            { value: "relaxation", key: "relaxation" },
                            { value: "transport", key: "transport" },
                            { value: "free_time", key: "free_time" }
                          ]
                        }
                      }
                    ]
                  }
                ]
              },

              // Daily Tips
              {
                display_name: "Day Tips",
                uid: "day_tips",
                data_type: "json",
                field_metadata: {
                  allow_json_rte: true,
                  rich_text_type: "advanced",
                  description: "Cultural notes, what to wear, local customs, photography tips"
                }
              },

              // Transport for the day
              {
                display_name: "Getting Around",
                uid: "getting_around",
                data_type: "text",
                field_metadata: {
                  multiline: true,
                  description: "How to navigate this day - metro tips, walking routes, etc."
                }
              }
            ]
          }
        ]
      },

      // ===== NEIGHBORHOODS TO EXPLORE =====
      {
        display_name: "Neighborhoods to Explore",
        uid: "neighborhoods",
        data_type: "blocks",
        field_metadata: {
          description: "Local areas worth exploring"
        },
        blocks: [
          {
            title: "Neighborhood",
            uid: "neighborhood",
            schema: [
              {
                display_name: "Name",
                uid: "name",
                data_type: "text",
                mandatory: true
              },
              {
                display_name: "Vibe",
                uid: "vibe",
                data_type: "text",
                field_metadata: {
                  description: "e.g., 'Hip & trendy', 'Traditional & peaceful', 'Bustling nightlife'"
                }
              },
              {
                display_name: "Best For",
                uid: "best_for",
                data_type: "text",
                multiple: true,
                field_metadata: {
                  description: "e.g., 'Street food', 'Shopping', 'Photography'"
                }
              },
              {
                display_name: "Description",
                uid: "description",
                data_type: "json",
                field_metadata: {
                  allow_json_rte: true,
                  rich_text_type: "advanced"
                }
              },
              {
                display_name: "Image",
                uid: "image",
                data_type: "file"
              }
            ]
          }
        ]
      },

      // ===== DINING GUIDE =====
      {
        display_name: "Dining Guide",
        uid: "dining_guide",
        data_type: "blocks",
        field_metadata: {
          description: "Restaurant and food recommendations"
        },
        blocks: [
          {
            title: "Restaurant",
            uid: "restaurant",
            schema: [
              {
                display_name: "Name",
                uid: "name",
                data_type: "text",
                mandatory: true
              },
              {
                display_name: "Cuisine",
                uid: "cuisine",
                data_type: "text"
              },
              {
                display_name: "Price Range",
                uid: "price_range",
                data_type: "text",
                enum: {
                  advanced: true,
                  choices: [
                    { value: "$", key: "budget" },
                    { value: "$$", key: "moderate" },
                    { value: "$$$", key: "upscale" },
                    { value: "$$$$", key: "fine_dining" }
                  ]
                }
              },
              {
                display_name: "Must Try",
                uid: "must_try",
                data_type: "text",
                multiple: true
              },
              {
                display_name: "Why We Love It",
                uid: "why_we_love",
                data_type: "text",
                field_metadata: { multiline: true }
              },
              {
                display_name: "Reservation Required",
                uid: "reservation_required",
                data_type: "boolean"
              },
              {
                display_name: "Best For",
                uid: "best_for",
                data_type: "text",
                field_metadata: {
                  description: "e.g., 'Romantic dinner', 'Quick lunch', 'Group dining'"
                }
              },
              {
                display_name: "Location",
                uid: "location",
                data_type: "text"
              },
              {
                display_name: "Image",
                uid: "image",
                data_type: "file"
              }
            ]
          }
        ]
      },

      // ===== SEASONAL EVENTS =====
      {
        display_name: "Seasonal Events",
        uid: "seasonal_events",
        data_type: "blocks",
        field_metadata: {
          description: "Festivals, events happening during this trip period"
        },
        blocks: [
          {
            title: "Event",
            uid: "event",
            schema: [
              {
                display_name: "Name",
                uid: "name",
                data_type: "text",
                mandatory: true
              },
              {
                display_name: "Date/Period",
                uid: "date_period",
                data_type: "text"
              },
              {
                display_name: "Description",
                uid: "description",
                data_type: "text",
                field_metadata: { multiline: true }
              },
              {
                display_name: "Don't Miss",
                uid: "dont_miss",
                data_type: "text"
              },
              {
                display_name: "Image",
                uid: "image",
                data_type: "file"
              }
            ]
          }
        ]
      },

      // ===== PRACTICAL INFO =====
      {
        display_name: "Practical Information",
        uid: "practical_info",
        data_type: "group",
        schema: [
          {
            display_name: "Best Time to Take This Trip",
            uid: "best_time",
            data_type: "text"
          },
          {
            display_name: "Ideal Trip Duration",
            uid: "ideal_duration",
            data_type: "text"
          },
          {
            display_name: "Difficulty Level",
            uid: "difficulty",
            data_type: "text",
            enum: {
              advanced: true,
              choices: [
                { value: "Easy - Suitable for all", key: "easy" },
                { value: "Moderate - Some walking", key: "moderate" },
                { value: "Challenging - Good fitness required", key: "challenging" }
              ]
            }
          },
          {
            display_name: "Best For",
            uid: "best_for",
            data_type: "text",
            multiple: true,
            enum: {
              advanced: true,
              choices: [
                { value: "Solo travelers", key: "solo" },
                { value: "Couples", key: "couples" },
                { value: "Families with kids", key: "families" },
                { value: "Groups of friends", key: "groups" },
                { value: "Seniors", key: "seniors" },
                { value: "First-time visitors", key: "first_timers" },
                { value: "Repeat visitors", key: "repeat" }
              ]
            }
          },
          {
            display_name: "Languages Spoken",
            uid: "languages",
            data_type: "text"
          },
          {
            display_name: "Currency Tips",
            uid: "currency_tips",
            data_type: "text",
            field_metadata: { multiline: true }
          },
          {
            display_name: "Connectivity",
            uid: "connectivity",
            data_type: "text",
            field_metadata: {
              description: "WiFi, SIM card, data recommendations"
            }
          }
        ]
      },

      // ===== PACKING LIST =====
      {
        display_name: "Packing Essentials",
        uid: "packing_list",
        data_type: "blocks",
        blocks: [
          {
            title: "Packing Category",
            uid: "packing_category",
            schema: [
              {
                display_name: "Category",
                uid: "category",
                data_type: "text",
                enum: {
                  advanced: true,
                  choices: [
                    { value: "Clothing", key: "clothing" },
                    { value: "Footwear", key: "footwear" },
                    { value: "Electronics", key: "electronics" },
                    { value: "Documents", key: "documents" },
                    { value: "Health & Safety", key: "health" },
                    { value: "Miscellaneous", key: "misc" }
                  ]
                }
              },
              {
                display_name: "Items",
                uid: "items",
                data_type: "text",
                multiple: true
              }
            ]
          }
        ]
      },

      // ===== VISA & TRAVEL DOCS =====
      {
        display_name: "Visa & Documents",
        uid: "visa_documents",
        data_type: "json",
        field_metadata: {
          allow_json_rte: true,
          rich_text_type: "advanced",
          description: "Visa requirements, document checklist"
        }
      },

      // ===== HEALTH & SAFETY =====
      {
        display_name: "Health & Safety",
        uid: "health_safety",
        data_type: "json",
        field_metadata: {
          allow_json_rte: true,
          rich_text_type: "advanced",
          description: "Vaccinations, health tips, emergency contacts"
        }
      },

      // ===== BOOKING INFO =====
      {
        display_name: "Booking Information",
        uid: "booking_info",
        data_type: "group",
        schema: [
          {
            display_name: "How Far in Advance",
            uid: "advance_booking",
            data_type: "text"
          },
          {
            display_name: "Cancellation Policy",
            uid: "cancellation",
            data_type: "json",
            field_metadata: {
              allow_json_rte: true,
              rich_text_type: "advanced"
            }
          },
          {
            display_name: "Contact Email",
            uid: "contact_email",
            data_type: "text"
          },
          {
            display_name: "WhatsApp",
            uid: "whatsapp",
            data_type: "text"
          }
        ]
      },

      // ===== PERSONALIZATION (for Personalize feature) =====
      {
        display_name: "Travel Style",
        uid: "travel_style",
        data_type: "text",
        enum: {
          advanced: true,
          choices: [
            { value: "budget", key: "budget" },
            { value: "mid-range", key: "mid_range" },
            { value: "luxury", key: "luxury" },
            { value: "backpacker", key: "backpacker" }
          ]
        },
        field_metadata: {
          description: "For Personalize variant matching"
        }
      },
      {
        display_name: "Traveler Type",
        uid: "traveler_type",
        data_type: "text",
        enum: {
          advanced: true,
          choices: [
            { value: "solo", key: "solo" },
            { value: "couple", key: "couple" },
            { value: "family", key: "family" },
            { value: "group", key: "group" }
          ]
        }
      },

      // ===== SEO =====
      {
        display_name: "SEO",
        uid: "seo",
        data_type: "group",
        schema: [
          {
            display_name: "Meta Title",
            uid: "meta_title",
            data_type: "text"
          },
          {
            display_name: "Meta Description",
            uid: "meta_description",
            data_type: "text",
            field_metadata: { multiline: true }
          },
          {
            display_name: "Keywords",
            uid: "keywords",
            data_type: "text",
            multiple: true
          }
        ]
      }
    ],
    options: {
      title: "title",
      publishable: true,
      is_page: true,
      singleton: false,
      url_pattern: "/itinerary/:slug",
      url_prefix: "/itinerary/"
    }
  }
};
