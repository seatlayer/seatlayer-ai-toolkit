# SeatLayer Venue Spec examples

Six worked Venue Specs. Each one is built and checked in SeatLayer's tests. The same files are published by name, for example `https://docs.seatlayer.io/schemas/venue-spec-examples/theatre.json`.

## Theatre, 400 seats

A 400-seat theatre: stalls in two blocks with a centre aisle, curved rear stalls, Premium at 80 and Standard at 55, exits on both sides and the main entrance at the back.

Key: `theatre`

```json
{
  "$schema": "https://docs.seatlayer.io/schemas/venue-spec-v1.json",
  "seatlayerVenueSpec": 1,
  "name": "Riverside Theatre",
  "categories": [
    { "name": "Premium", "price": 80 },
    { "name": "Standard", "price": 55 }
  ],
  "stage": {"kind": "arc", "label": "Stage"},
  "items": [
    { "type": "rows", "rowCount": 10, "seatsPerRow": 24, "blocks": 2, "category": "Premium", "section": "Stalls" },
    { "type": "curvedRows", "rowCount": 5, "seatsPerRow": 32, "spreadDegrees": 90, "aisles": "two", "category": "Standard", "section": "Rear Stalls" },
    { "type": "landmark", "role": "exit", "label": "Exit", "placement": "left" },
    { "type": "landmark", "role": "exit", "label": "Exit", "placement": "right" },
    { "type": "landmark", "role": "entrance", "label": "Main entrance", "placement": "rear" }
  ]
}
```

## Wedding banquet, 20 tables

A wedding for 200: 20 round tables of 10, a dance floor in front of the stage, a bar on the left, the entrance at the back.

Key: `wedding`

```json
{
  "$schema": "https://docs.seatlayer.io/schemas/venue-spec-v1.json",
  "seatlayerVenueSpec": 1,
  "name": "Rose Hall Wedding",
  "categories": [
    { "name": "Guest" }
  ],
  "stage": {"kind": "rounded", "label": "Head table", "widthM": 8, "depthM": 3},
  "items": [
    { "type": "area", "label": "Dance floor", "widthM": 10, "depthM": 8, "placement": "rear" },
    { "type": "tables", "tableRows": 4, "tableColumns": 5, "seatsPerTable": 10, "shape": "round" },
    { "type": "landmark", "role": "bar", "label": "Bar", "placement": "left" },
    { "type": "landmark", "role": "entrance", "label": "Entrance", "placement": "rear" },
    { "type": "landmark", "icon": "restrooms", "placement": "right" }
  ]
}
```

## Club night, standing and VIP tables

A club for 600: a 500-person dance floor, VIP tables along the side, a bar and two fire exits.

Key: `club`

```json
{
  "$schema": "https://docs.seatlayer.io/schemas/venue-spec-v1.json",
  "seatlayerVenueSpec": 1,
  "name": "Warehouse 9",
  "categories": [
    { "name": "VIP table", "price": 250 },
    { "name": "General admission", "price": 25 }
  ],
  "stage": {"kind": "thrust", "label": "DJ"},
  "items": [
    { "type": "standing", "capacity": 500, "label": "Dance floor", "category": "General admission" },
    { "type": "tables", "tableRows": 3, "tableColumns": 2, "seatsPerTable": 6, "shape": "rect", "category": "VIP table", "placement": "right" },
    { "type": "landmark", "role": "bar", "label": "Main bar", "placement": "left" },
    { "type": "landmark", "role": "exit", "label": "Fire exit", "placement": "rear" },
    { "type": "landmark", "icon": "emergency-exit", "placement": "left" }
  ]
}
```

## Arena, four named stands and a floor pit

An arena with North, East, South and West stands of 20 rows of 30, a 2,000-person floor pit, three price levels.

Key: `arena`

```json
{
  "$schema": "https://docs.seatlayer.io/schemas/venue-spec-v1.json",
  "seatlayerVenueSpec": 1,
  "name": "City Arena",
  "categories": [
    { "name": "Lower tier", "price": 120 },
    { "name": "Upper tier", "price": 70 },
    { "name": "Floor standing", "price": 90 }
  ],
  "base": {"layout": "bowl", "sectionCount": 4, "rowCount": 20, "seatsPerRow": 30, "standingCapacity": 2000, "stageKind": "rect", "sectionNames": ["North Stand", "East Stand", "South Stand", "West Stand"]},
  "items": [
    { "type": "text", "text": "Gate A", "size": "large", "showAt": "always", "placement": "rear" }
  ]
}
```

## Expo hall, 40 booths

A trade show: 4 rows of 10 booths, a registration desk at the entrance, a café in the corner.

Key: `expo`

```json
{
  "$schema": "https://docs.seatlayer.io/schemas/venue-spec-v1.json",
  "seatlayerVenueSpec": 1,
  "name": "Tech Expo Hall B",
  "categories": [
    { "name": "Booth", "price": 1500 }
  ],
  "stage": false,
  "items": [
    { "type": "booths", "boothRows": 4, "boothColumns": 10 },
    { "type": "area", "label": "Registration desk", "widthM": 6, "depthM": 2, "placement": "rear" },
    { "type": "landmark", "role": "entrance", "label": "Entrance", "placement": "rear" },
    { "type": "landmark", "role": "concession", "label": "Café", "placement": "right" }
  ]
}
```

## Comedy club, tables and a bar

A 120-seat comedy club: cabaret tables near the stage, rows behind, a bar at the back.

Key: `comedy`

```json
{
  "$schema": "https://docs.seatlayer.io/schemas/venue-spec-v1.json",
  "seatlayerVenueSpec": 1,
  "name": "The Laugh Cellar",
  "categories": [
    { "name": "Table", "price": 35 },
    { "name": "Row", "price": 22 }
  ],
  "stage": {"kind": "rounded", "label": "Stage", "widthM": 5, "depthM": 3},
  "items": [
    { "type": "tables", "tableRows": 2, "tableColumns": 5, "seatsPerTable": 4, "category": "Table" },
    { "type": "rows", "rowCount": 4, "seatsPerRow": 20, "category": "Row", "section": "Rows" },
    { "type": "landmark", "role": "bar", "label": "Bar", "placement": "rear" }
  ]
}
```
