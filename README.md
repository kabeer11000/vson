# VSON Component Documentation

A powerful, dependency-free React component for editing complex JSON data structures with schema-driven validation and intuitive UI controls.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Schema Design](#schema-design)
5. [API Reference](#api-reference)
6. [Basic Examples](#basic-examples)
7. [Advanced Examples](#advanced-examples)
8. [Best Practices](#best-practices)
9. [Performance Considerations](#performance-considerations)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The VSON component provides a dynamic, form-based interface for editing JSON data structures. It uses a schema-driven approach where you define the structure, types, and constraints of your data, and the component automatically generates the appropriate UI controls.

### Key Features

- **Zero Dependencies**: No external UI libraries required
- **Schema-Driven**: Define your data structure once, get a complete UI
- **Type Safety**: TypeScript support with full type checking
- **Performance Optimized**: Memoization and efficient re-rendering
- **Nested Structures**: Support for complex object and array nesting
- **Validation Ready**: Extensible for custom validation rules
- **Accessibility**: Semantic HTML with proper ARIA attributes

---

## Installation

Simply copy the VSON component into your project. No additional dependencies required.

```typescript
import VSON from './components/VSON';
```

**Requirements:**
- React 16.8+ (for hooks support)
- TypeScript 4.0+ (recommended)

---

## Quick Start

Here's a simple example to get you started:

```typescript
import React, { useState } from 'react';
import VSON from './components/VSON';

const MyForm = () => {
  const [data, setData] = useState({
    name: 'John Doe',
    age: 30,
    email: 'john@example.com'
  });

  const schema = {
    value: {
      name: {
        type: "string" as const,
        mutateable: true,
        value: "",
        InputProps: { placeholder: "Enter full name" }
      },
      age: {
        type: "number" as const,
        mutateable: true,
        value: 0,
        InputProps: { min: 0, max: 120 }
      },
      email: {
        type: "string" as const,
        mutateable: true,
        value: "",
        InputProps: { placeholder: "Enter email address" }
      }
    }
  };

  return (
    <VSON
      data={data}
      schema={schema}
      onDataChange={setData}
    />
  );
};
```

---

## Schema Design

The schema defines the structure and behavior of your form. Each field in your data structure needs a corresponding schema definition.

### Schema Structure

```typescript
interface IVSONSchema {
    [fieldName: string]: IVSONSchemaItem;
}

interface IVSONSchemaItem {
    type: "object" | "string" | "number" | "array" | "big-string";
    mutateable: boolean;           // Can the user edit this field?
    InputProps?: object;           // Props passed to the input element
    name?: string;                 // Display name (optional)
    value: any;                    // Default value or nested schema
}
```

### Field Types

#### 1. String Fields
For single-line text input:

```typescript
{
  type: "string",
  mutateable: true,
  value: "default text",
  InputProps: {
    placeholder: "Enter text here",
    maxLength: 100
  }
}
```

#### 2. Big String Fields
For multi-line text input:

```typescript
{
  type: "big-string",
  mutateable: true,
  value: "default text",
  InputProps: {
    placeholder: "Enter description...",
    rows: 6
  }
}
```

#### 3. Number Fields
For numeric input:

```typescript
{
  type: "number",
  mutateable: true,
  value: 0,
  InputProps: {
    min: 0,
    max: 100,
    step: 0.1
  }
}
```

#### 4. Select Fields (NEW!)
For dropdown selection with predefined options:

```typescript
{
  type: "select",
  mutateable: true,
  value: "apple",  // Default selected value
  options: [
    { value: "apple", label: "🍎 Apple" },
    { value: "orange", label: "🍊 Orange" },
    { value: "mango", label: "🥭 Mango" }
  ],
  InputProps: {
    placeholder: "Choose a fruit..."
  }
}
```

#### 5. Boolean Fields (NEW!)
For true/false checkbox input:

```typescript
{
  type: "boolean",
  mutateable: true,
  value: false,  // Default checked state
  name: "Enable notifications",  // Label text
  InputProps: {
    // Standard checkbox HTML attributes
  }
}
```

#### 6. Object Fields
For nested object structures:

```typescript
{
  type: "object",
  mutateable: true,
  value: {
    // Nested schema here
    subField1: { type: "string", mutateable: true, value: "" },
    subField2: { type: "number", mutateable: true, value: 0 }
  }
}
```

#### 7. Array Fields
For repeatable items:

```typescript
{
  type: "array",
  mutateable: true,
  name: "Items",  // Display name for the array
  value: {
    // Schema for each array item
    type: "string",
    mutateable: true,
    value: ""
  }
}
```

---

## API Reference

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `object \| Array<object>` | Yes | The data to edit |
| `schema` | `IVSONSchema` | Yes | Schema defining the structure |
| `onDataChange` | `(data: object) => void` | Yes | Callback when data changes |

### Schema Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Field type (string, number, big-string, object, array, select, boolean) |
| `mutateable` | `boolean` | Yes | Whether the field can be edited |
| `value` | `any` | Yes | Default value or nested schema |
| `InputProps` | `object` | No | HTML attributes passed to input |
| `name` | `string` | No | Display name for the field |
| `options` | `array` | No | For select fields: array of `{value, label}` objects |

### Select Field Options

For `select` type fields, the `options` property defines the available choices:

```typescript
options: [
  { value: "actual_value", label: "Display Text" },
  { value: "another_value", label: "Another Option" }
]
```

**Option Properties:**
- `value`: The actual value stored in your data (string, number, or boolean)
- `label`: The text displayed to the user (string)

**Examples:**

```typescript
// String values
options: [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" }
]

// Number values  
options: [
  { value: 1, label: "Low Priority" },
  { value: 2, label: "Medium Priority" },
  { value: 3, label: "High Priority" }
]

// Boolean values
options: [
  { value: true, label: "Yes" },
  { value: false, label: "No" }
]

// With emojis for better UX
options: [
  { value: "pending", label: "⏳ Pending" },
  { value: "approved", label: "✅ Approved" },
  { value: "rejected", label: "❌ Rejected" }
]
```

---

## Basic Examples

### Example 1: User Profile with Select & Boolean Fields

```typescript
const userProfileSchema = {
  value: {
    personalInfo: {
      type: "object",
      mutateable: true,
      value: {
        firstName: {
          type: "string",
          mutateable: true,
          value: "",
          InputProps: { placeholder: "First name", required: true }
        },
        lastName: {
          type: "string",
          mutateable: true,
          value: "",
          InputProps: { placeholder: "Last name", required: true }
        },
        age: {
          type: "number",
          mutateable: true,
          value: 18,
          InputProps: { min: 0, max: 120 }
        },
        gender: {
          type: "select",
          mutateable: true,
          value: "",
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "non-binary", label: "Non-binary" },
            { value: "prefer-not-to-say", label: "Prefer not to say" }
          ]
        },
        country: {
          type: "select",
          mutateable: true,
          value: "US",
          options: [
            { value: "US", label: "🇺🇸 United States" },
            { value: "CA", label: "🇨🇦 Canada" },
            { value: "UK", label: "🇬🇧 United Kingdom" },
            { value: "AU", label: "🇦🇺 Australia" },
            { value: "DE", label: "🇩🇪 Germany" },
            { value: "FR", label: "🇫🇷 France" }
          ]
        }
      }
    },
    preferences: {
      type: "object",
      mutateable: true,
      value: {
        emailNotifications: {
          type: "boolean",
          mutateable: true,
          value: true,
          name: "Receive email notifications"
        },
        smsNotifications: {
          type: "boolean",
          mutateable: true,
          value: false,
          name: "Receive SMS notifications"
        },
        marketingEmails: {
          type: "boolean",
          mutateable: true,
          value: false,
          name: "Receive marketing emails"
        },
        theme: {
          type: "select",
          mutateable: true,
          value: "light",
          options: [
            { value: "light", label: "☀️ Light Theme" },
            { value: "dark", label: "🌙 Dark Theme" },
            { value: "auto", label: "🔄 Auto (System)" }
          ]
        }
      }
    },
    bio: {
      type: "big-string",
      mutateable: true,
      value: "",
      InputProps: { placeholder: "Tell us about yourself..." }
    },
    skills: {
      type: "array",
      mutateable: true,
      name: "skills",
      value: {
        type: "string",
        mutateable: true,
        value: "",
        InputProps: { placeholder: "Enter a skill" }
      }
    }
  }
};

const userData = {
  personalInfo: {
    firstName: "Jane",
    lastName: "Doe",
    age: 28,
    gender: "female",
    country: "US"
  },
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    theme: "dark"
  },
  bio: "Full-stack developer with 5 years of experience",
  skills: ["React", "TypeScript", "Node.js"]
};
```

### Example 2: Product Catalog with Priority & Status

```typescript
const productSchema = {
  value: {
    basic: {
      type: "object",
      mutateable: true,
      value: {
        name: {
          type: "string",
          mutateable: true,
          value: "",
          InputProps: { placeholder: "Product name" }
        },
        category: {
          type: "select",
          mutateable: true,
          value: "electronics",
          options: [
            { value: "electronics", label: "📱 Electronics" },
            { value: "clothing", label: "👕 Clothing" },
            { value: "books", label: "📚 Books" },
            { value: "home", label: "🏠 Home & Garden" },
            { value: "sports", label: "⚽ Sports" },
            { value: "toys", label: "🧸 Toys" }
          ]
        },
        priority: {
          type: "select",
          mutateable: true,
          value: 3,
          options: [
            { value: 1, label: "🔴 High Priority" },
            { value: 2, label: "🟡 Medium Priority" },
            { value: 3, label: "🟢 Low Priority" }
          ]
        },
        price: {
          type: "number",
          mutateable: true,
          value: 0,
          InputProps: { min: 0, step: 0.01 }
        },
        inStock: {
          type: "number",
          mutateable: true,
          value: 0,
          InputProps: { min: 0 }
        },
        isActive: {
          type: "boolean",
          mutateable: true,
          value: true,
          name: "Product is active"
        },
        isFeatured: {
          type: "boolean",
          mutateable: true,
          value: false,
          name: "Featured product"
        }
      }
    },
    description: {
      type: "big-string",
      mutateable: true,
      value: "",
      InputProps: { placeholder: "Product description..." }
    },
    tags: {
      type: "array",
      mutateable: true,
      name: "tags",
      value: {
        type: "string",
        mutateable: true,
        value: "",
        InputProps: { placeholder: "Tag name" }
      }
    }
  }
};
```

### Example 3: Fruit Selection (Your Original Request!)

```typescript
const fruitSchema = {
  value: {
    favoriteFruit: {
      type: "select",
      mutateable: true,
      value: "apple",
      options: [
        { value: "apple", label: "🍎 Apple" },
        { value: "orange", label: "🍊 Orange" },
        { value: "mango", label: "🥭 Mango" }
      ],
      InputProps: { placeholder: "Choose your favorite fruit..." }
    },
    quantity: {
      type: "number",
      mutateable: true,
      value: 1,
      InputProps: { min: 1, max: 10 }
    },
    organic: {
      type: "boolean",
      mutateable: true,
      value: false,
      name: "Organic fruit only"
    },
    notes: {
      type: "big-string",
      mutateable: true,
      value: "",
      InputProps: { placeholder: "Any special preferences..." }
    }
  }
};

const fruitData = {
  favoriteFruit: "mango",
  quantity: 3,
  organic: true,
  notes: "Please ensure the fruit is ripe"
};

// Usage
<VSON
  data={fruitData}
  schema={fruitSchema}
  onDataChange={(newData) => console.log(newData)}
/>
```

---

## Advanced Examples

### Example 3: Complex Nested Structure - Library Management System

```typescript
const librarySchema = {
  value: {
    book: {
      type: "object",
      mutateable: true,
      value: {
        title: {
          type: "object",
          mutateable: true,
          value: {
            main: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { placeholder: "Main title" }
            },
            subtitle: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { placeholder: "Subtitle (optional)" }
            }
          }
        },
        isbn: {
          type: "object",
          mutateable: true,
          value: {
            isbn10: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { 
                placeholder: "ISBN-10",
                pattern: "\\d{9}[\\d|X]",
                maxLength: 10
              }
            },
            isbn13: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { 
                placeholder: "ISBN-13",
                pattern: "\\d{13}",
                maxLength: 13
              }
            }
          }
        },
        authors: {
          type: "array",
          mutateable: true,
          name: "authors",
          value: {
            type: "object",
            mutateable: true,
            value: {
              name: {
                type: "string",
                mutateable: true,
                value: "",
                InputProps: { placeholder: "Author name" }
              },
              role: {
                type: "string",
                mutateable: true,
                value: "author",
                InputProps: { placeholder: "Role (author, editor, etc.)" }
              },
              biography: {
                type: "big-string",
                mutateable: true,
                value: "",
                InputProps: { placeholder: "Author biography..." }
              }
            }
          }
        },
        publisher: {
          type: "object",
          mutateable: true,
          value: {
            name: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { placeholder: "Publisher name" }
            },
            location: {
              type: "object",
              mutateable: true,
              value: {
                city: {
                  type: "string",
                  mutateable: true,
                  value: "",
                  InputProps: { placeholder: "City" }
                },
                country: {
                  type: "string",
                  mutateable: true,
                  value: "",
                  InputProps: { placeholder: "Country" }
                }
              }
            }
          }
        },
        metadata: {
          type: "object",
          mutateable: true,
          value: {
            pageCount: {
              type: "number",
              mutateable: true,
              value: 0,
              InputProps: { min: 1 }
            },
            language: {
              type: "string",
              mutateable: true,
              value: "en",
              InputProps: { placeholder: "Language code (e.g., en, es, fr)" }
            },
            genres: {
              type: "array",
              mutateable: true,
              name: "genres",
              value: {
                type: "string",
                mutateable: true,
                value: "",
                InputProps: { placeholder: "Genre" }
              }
            },
            publicationDate: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { 
                type: "date",
                placeholder: "Publication date" 
              }
            }
          }
        },
        condition: {
          type: "object",
          mutateable: true,
          value: {
            overall: {
              type: "select",
              mutateable: true,
              value: "good",
              options: [
                { value: "new", label: "📗 New" },
                { value: "like-new", label: "📘 Like New" },
                { value: "very-good", label: "📙 Very Good" },
                { value: "good", label: "📕 Good" },
                { value: "acceptable", label: "📔 Acceptable" },
                { value: "poor", label: "📜 Poor" }
              ]
            },
            notes: {
              type: "big-string",
              mutateable: true,
              value: "",
              InputProps: { placeholder: "Condition notes..." }
            },
            needsRepair: {
              type: "boolean",
              mutateable: true,
              value: false,
              name: "Needs repair"
            },
            photos: {
              type: "array",
              mutateable: true,
              name: "condition photos",
              value: {
                type: "string",
                mutateable: true,
                value: "",
                InputProps: { 
                  placeholder: "Photo URL",
                  type: "url"
                }
              }
            }
          }
        }
      }
    },
    location: {
      type: "object",
      mutateable: true,
      value: {
        bay: {
          type: "object",
          mutateable: true,
          value: {
            id: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { placeholder: "Bay ID" }
            },
            topic: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { placeholder: "Bay topic/category" }
            }
          }
        },
        shelf: {
          type: "number",
          mutateable: true,
          value: 1,
          InputProps: { min: 1 }
        },
        position: {
          type: "number",
          mutateable: true,
          value: 1,
          InputProps: { min: 1 }
        }
      }
    },
    circulation: {
      type: "object",
      mutateable: true,
      value: {
        status: {
          type: "select",
          mutateable: true,
          value: "available",
          options: [
            { value: "available", label: "✅ Available" },
            { value: "checked-out", label: "📤 Checked Out" },
            { value: "on-hold", label: "🔒 On Hold" },
            { value: "processing", label: "⚙️ Processing" },
            { value: "damaged", label: "⚠️ Damaged" },
            { value: "lost", label: "❌ Lost" }
          ]
        },
        isReservable: {
          type: "boolean",
          mutateable: true,
          value: true,
          name: "Can be reserved"
        },
        checkoutHistory: {
          type: "array",
          mutateable: true,
          name: "checkout history",
          value: {
            type: "object",
            mutateable: true,
            value: {
              borrower: {
                type: "string",
                mutateable: true,
                value: "",
                InputProps: { placeholder: "Borrower name/ID" }
              },
              checkedOut: {
                type: "string",
                mutateable: true,
                value: "",
                InputProps: { 
                  type: "datetime-local",
                  placeholder: "Check-out date/time" 
                }
              },
              returned: {
                type: "string",
                mutateable: true,
                value: "",
                InputProps: { 
                  type: "datetime-local",
                  placeholder: "Return date/time" 
                }
              },
              wasOverdue: {
                type: "boolean",
                mutateable: true,
                value: false,
                name: "Was returned overdue"
              }
            }
          }
        }
      }
    }
  }
};

// Sample data for the library book
const libraryData = {
  book: {
    title: {
      main: "The Design of Everyday Things",
      subtitle: "Revised and Expanded Edition"
    },
    isbn: {
      isbn10: "0465050654",
      isbn13: "9780465050659"
    },
    authors: [
      {
        name: "Don Norman",
        role: "author",
        biography: "Donald A. Norman is a cognitive scientist and design advocate."
      }
    ],
    publisher: {
      name: "Basic Books",
      location: {
        city: "New York",
        country: "USA"
      }
    },
    metadata: {
      pageCount: 368,
      language: "en",
      genres: ["Design", "Psychology", "Technology"],
      publicationDate: "2013-11-05"
    },
    condition: {
      overall: "very-good",
      notes: "Minor shelf wear on cover",
      photos: []
    }
  },
  location: {
    bay: {
      id: "DESIGN-001",
      topic: "Design and User Experience"
    },
    shelf: 3,
    position: 12
  },
  circulation: {
    status: "available",
    checkoutHistory: [
      {
        borrower: "student_123",
        checkedOut: "2024-01-15T10:00:00",
        returned: "2024-02-15T14:30:00"
      }
    ]
  }
};
```

### Example 4: E-commerce Product with Variants

```typescript
const ecommerceSchema = {
  value: {
    product: {
      type: "object",
      mutateable: true,
      value: {
        basicInfo: {
          type: "object",
          mutateable: true,
          value: {
            name: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { placeholder: "Product name" }
            },
            sku: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { placeholder: "SKU" }
            },
            brand: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { placeholder: "Brand name" }
            }
          }
        },
        description: {
          type: "object",
          mutateable: true,
          value: {
            short: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { placeholder: "Short description" }
            },
            long: {
              type: "big-string",
              mutateable: true,
              value: "",
              InputProps: { placeholder: "Detailed description..." }
            },
            features: {
              type: "array",
              mutateable: true,
              name: "features",
              value: {
                type: "string",
                mutateable: true,
                value: "",
                InputProps: { placeholder: "Feature description" }
              }
            }
          }
        },
        variants: {
          type: "array",
          mutateable: true,
          name: "variants",
          value: {
            type: "object",
            mutateable: true,
            value: {
              name: {
                type: "string",
                mutateable: true,
                value: "",
                InputProps: { placeholder: "Variant name (e.g., Red Large)" }
              },
              sku: {
                type: "string",
                mutateable: true,
                value: "",
                InputProps: { placeholder: "Variant SKU" }
              },
              attributes: {
                type: "object",
                mutateable: true,
                value: {
                  color: {
                    type: "string",
                    mutateable: true,
                    value: "",
                    InputProps: { placeholder: "Color" }
                  },
                  size: {
                    type: "string",
                    mutateable: true,
                    value: "",
                    InputProps: { placeholder: "Size" }
                  }
                }
              },
              pricing: {
                type: "object",
                mutateable: true,
                value: {
                  regular: {
                    type: "number",
                    mutateable: true,
                    value: 0,
                    InputProps: { min: 0, step: 0.01 }
                  },
                  sale: {
                    type: "number",
                    mutateable: true,
                    value: 0,
                    InputProps: { min: 0, step: 0.01 }
                  }
                }
              },
              inventory: {
                type: "object",
                mutateable: true,
                value: {
                  quantity: {
                    type: "number",
                    mutateable: true,
                    value: 0,
                    InputProps: { min: 0 }
                  },
                  reserved: {
                    type: "number",
                    mutateable: true,
                    value: 0,
                    InputProps: { min: 0 }
                  }
                }
              },
              images: {
                type: "array",
                mutateable: true,
                name: "images",
                value: {
                  type: "object",
                  mutateable: true,
                  value: {
                    url: {
                      type: "string",
                      mutateable: true,
                      value: "",
                      InputProps: { 
                        placeholder: "Image URL",
                        type: "url"
                      }
                    },
                    alt: {
                      type: "string",
                      mutateable: true,
                      value: "",
                      InputProps: { placeholder: "Alt text" }
                    },
                    isPrimary: {
                      type: "string",
                      mutateable: true,
                      value: "false",
                      InputProps: { placeholder: "Is primary image? (true/false)" }
                    }
                  }
                }
              }
            }
          }
        },
        categories: {
          type: "array",
          mutateable: true,
          name: "categories",
          value: {
            type: "object",
            mutateable: true,
            value: {
              id: {
                type: "string",
                mutateable: true,
                value: "",
                InputProps: { placeholder: "Category ID" }
              },
              name: {
                type: "string",
                mutateable: true,
                value: "",
                InputProps: { placeholder: "Category name" }
              },
              level: {
                type: "number",
                mutateable: true,
                value: 1,
                InputProps: { min: 1 }
              }
            }
          }
        },
        seo: {
          type: "object",
          mutateable: true,
          value: {
            title: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { placeholder: "SEO title" }
            },
            description: {
              type: "string",
              mutateable: true,
              value: "",
              InputProps: { placeholder: "Meta description" }
            },
            keywords: {
              type: "array",
              mutateable: true,
              name: "keywords",
              value: {
                type: "string",
                mutateable: true,
                value: "",
                InputProps: { placeholder: "SEO keyword" }
              }
            }
          }
        }
      }
    }
  }
};
```

---

## Best Practices

### 1. Schema Design

**Use Descriptive Names:**
```typescript
// ❌ Poor naming
{ type: "string", mutateable: true, value: "" }

// ✅ Good naming
{
  type: "string",
  mutateable: true,
  value: "",
  InputProps: { placeholder: "Enter customer email address" }
}
```

**Provide Default Values:**
```typescript
// ✅ Always provide sensible defaults
{
  status: {
    type: "string",
    mutateable: true,
    value: "active",  // Default status
    InputProps: { placeholder: "Status" }
  },
  priority: {
    type: "number",
    mutateable: true,
    value: 1,  // Default priority
    InputProps: { min: 1, max: 5 }
  }
}
```

### 2. Performance Optimization

**Use Read-Only Fields for Display:**
```typescript
{
  id: {
    type: "string",
    mutateable: false,  // Read-only system ID
    value: "auto-generated"
  },
  createdAt: {
    type: "string",
    mutateable: false,  // Read-only timestamp
    value: new Date().toISOString()
  }
}
```

**Minimize Deep Nesting:**
```typescript
// ❌ Too deep (harder to manage)
user.profile.settings.notifications.email.marketing.frequency

// ✅ Better structure
user.emailSettings.marketingFrequency
```

### 3. User Experience

**Add Helpful Placeholders:**
```typescript
{
  phone: {
    type: "string",
    mutateable: true,
    value: "",
    InputProps: { 
      placeholder: "+1 (555) 123-4567",
      pattern: "\\+?[1-9]\\d{1,14}"
    }
  }
}
```

**Use Appropriate Input Types:**
```typescript
{
  email: {
    type: "string",
    mutateable: true,
    value: "",
    InputProps: { 
      type: "email",
      placeholder: "Enter email address"
    }
  },
  website: {
    type: "string",
    mutateable: true,
    value: "",
    InputProps: { 
      type: "url",
      placeholder: "https://example.com"
    }
  }
}
```

---

## Performance Considerations

### Memory Usage
- The component uses `structuredClone()` for deep copying, which is efficient but uses memory
- For very large data structures (>10MB), consider using immutable data libraries
- Arrays with 100+ items may impact performance; consider virtualization for very large lists

### Re-rendering Optimization
- All input components are memoized to prevent unnecessary re-renders
- Use React DevTools Profiler to identify performance bottlenecks
- Consider splitting very large schemas into multiple VSON instances

### Best Practices for Large Datasets
```typescript
// ✅ For large arrays, consider pagination
const [currentPage, setCurrentPage] = useState(0);
const pageSize = 10;
const paginatedData = {
  ...data,
  items: data.items.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
};

// ✅ Use debounced updates for real-time changes
const debouncedOnChange = useMemo(
  () => debounce(onDataChange, 300),
  [onDataChange]
);
```

---

## Troubleshooting

### Common Issues

#### 1. Component Not Re-rendering
**Problem:** Changes in data don't reflect in the UI
**Solution:** Ensure you're passing a new object reference:

```typescript
// ❌ Mutating existing object
const handleChange = (newData) => {
  data.field = newData.field;  // This won't trigger re-render
};

// ✅ Creating new object
const handleChange = (newData) => {
  setData({ ...data, ...newData });  // This will trigger re-render
};
```

#### 2. Array Items Not Updating
**Problem:** Array modifications don't work correctly
**Solution:** Check your schema structure:

```typescript
// ❌ Incorrect array schema
{
  type: "array",
  mutateable: true,
  value: "string"  // Wrong: should be an object
}

// ✅ Correct array schema
{
  type: "array",
  mutateable: true,
  value: {
    type: "string",
    mutateable: true,
    value: ""
  }
}
```

#### 3. Input Props Not Working
**Problem:** HTML attributes in InputProps are ignored
**Solution:** Check the input type:

```typescript
// ❌ Using number props on string input
{
  type: "string",
  InputProps: { min: 0 }  // 'min' doesn't work for text inputs
}

// ✅ Use appropriate props for input type
{
  type: "string",
  InputProps: { maxLength: 100 }  // 'maxLength' works for text inputs
}
```

#### 4. Performance Issues
**Problem:** UI becomes slow with large datasets
**Solutions:**
- Break large schemas into smaller components
- Use pagination for large arrays
- Implement debounced updates
- Consider using `React.useMemo` for expensive computations

### Debugging Tips

1. **Enable React DevTools** to monitor component re-renders
2. **Log data changes** to understand the data flow:

```typescript
const handleDataChange = (newData) => {
  console.log('Data changed:', newData);
  setData(newData);
};
```

3. **Validate your schema** structure:

```typescript
const validateSchema = (schema) => {
  // Add custom validation logic
  if (!schema.value) {
    console.error('Schema missing value property');
  }
};
```

4. **Use TypeScript** for better error catching during development

---

## Migration Guide

### From Version 1.x to 2.x
If you're upgrading from an earlier version:

1. **Schema Changes**: The `value` property is now required for all schema items
2. **Type Safety**: Import types explicitly for better TypeScript support
3. **Performance**: Update to use the new memoized components

### Integration with Form Libraries

#### With React Hook Form:
```typescript
import { useForm, Controller } from 'react-hook-form';

const MyForm = () => {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="jsonData"
        control={control}
        render={({ field }) => (
          <VSON
            data={field.value}
            schema={schema}
            onDataChange={field.onChange}
          />
        )}
      />
    </form>
  );
};
```

#### With Formik:
```typescript
import { Formik, Field } from 'formik';

const MyForm = () => (
  <Formik initialValues={{ jsonData: {} }} onSubmit={onSubmit}>
    {({ setFieldValue, values }) => (
      <Field name="jsonData">
        {() => (
          <VSON
            data={values.jsonData}
            schema={schema}
            onDataChange={(data) => setFieldValue('jsonData', data)}
          />
        )}
      </Field>
    )}
  </Formik>
);
```

---

## Contributing

To contribute to this component:

1. **Report Issues**: Use GitHub issues for bug reports
2. **Feature Requests**: Describe your use case and proposed API
3. **Pull Requests**: Include tests and documentation updates

## License

This component is provided as-is for educational and commercial use. Feel free to modify and distribute according to your project's license terms.
