# Data Model Documentation (Frontend)

## User

```
{
  _id: string,
  username: string,
  email: string,
  name?: string,
  avatar?: string, // URL
  isEmailVerified?: boolean,
  onboardingComplete?: boolean,
  contactDetails?: {
    phone?: string,
    address?: {
      region?: string,
      town?: string,
      quarter?: string
    }
  },
  registrationDate?: string,
  accountStatus: 'active' | 'suspended',
  matchingThreshold: number,
  notificationPreferences?: {
    matchAlerts?: boolean,
    generalUpdates?: boolean
  },
  periodicSearchEnabled?: boolean
}
```

## Item (Registered)

```
{
  _id: string,
  owner: User,
  itemDetails: {
    name: string,
    description: string,
    category: string
  },
  attributes?: Record<string, string>,
  image?: {
    url: string,
    keypoints?: any[],
    descriptors?: any[]
  },
  registrationDate?: string
}
```

## Found Report

```
{
  _id: string,
  finder: User,
  itemDetails: {
    name: string,
    description: string,
    category: string
  },
  attributes?: Record<string, string>,
  image: {
    url: string,
    keypoints?: any[],
    descriptors?: any[]
  },
  foundDate: string,
  foundLocation: string,
  status: 'active' | 'pending' | 'claimed' | 'approved' | 'not_match' | 'resolved' | 'inactive',
  createdAt: string,
  updatedAt: string
}
```

## Lost Report

```
{
  _id: string,
  reporter: User,
  item?: Item,
  itemDetails: {
    name: string,
    description: string,
    category: string
  },
  attributes?: Record<string, string>,
  image: {
    url: string,
    keypoints?: any[],
    descriptors?: any[]
  },
  lostDate: string,
  lostLocation: string,
  status: 'active' | 'pending' | 'matched' | 'resolved' | 'inactive',
  createdAt: string,
  updatedAt: string
}
```

---

-   All date fields are ISO strings.
-   All image URLs are from Supabase.
-   All objects include `_id` and timestamps.
