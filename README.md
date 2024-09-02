


# Endpoints

## Register
POST
localhost:3000/users/register
req.body = 
{
  "username":"antek",
  "email":"antek",
  "password":"hassan"
}
res = 
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNCwiaWF0IjoxNzI1MzA5MTQ2LCJleHAiOjE3MjUzMTI3NDZ9.wcwSKNQ9kvpaad_fkNOt_N9X8h0v4tXJ5vYw6vXCA-I"
}

## Login 
POST 
localhost:3000/users/login
req.body = 
{
  "email":"antek",
  "password":"hassan"
}
res = 
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNCwiaWF0IjoxNzI1MzA5MzE1LCJleHAiOjE3MjUzMTI5MTV9.fWwWmuj-wv3das5h_4J3n9iAOWSpLxDkabPIYf8KWqY"
}

## Username
GET
authenticated route
localhost:3000/users/stats

headers: {
        'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNCwiaWF0IjoxNzI1MzA5MzE1LCJleHAiOjE3MjUzMTI5MTV9.fWwWmuj-wv3das5h_4J3n9iAOWSpLxDkabPIYf8KWqY" ,
    }

res = 
{
  "username": "antek"
}

## Save Place
POST 
authenticated route
localhost:3000/users/save

headers: {
        'Authorization': "TOKEN" ,
    }

req.body =
{
  "place_id": 2
}

res = 
{
  "message": "Location saved successfully"
}

## Retrieve saved places
GET 
authenticated route
localhost:3000/users/retrieve

headers: {
        'Authorization': "TOKEN" ,
    }

res = 
{
  "savedLocations": [location1, location2]
}

## Get data for location by id
GET
localhost:3000/locations/data/2

res = 
{
    location
}


## Get images for location id (This one is using flicker API worse images and sometimes weird)

GET
localhost:3000/locations/images/2

res = 
[
    url,
    url
]

## Get images for location id (This one is using google api custom search better images still not perfect)

GET
localhost:3000/locations/image/2

res = 
[
    url,
    url
]


## Get location description by id its AI generated so sometimes can be weird

GET
localhost:3000/locations/description/2

res = description string

## Get weather a place location by place id very cool end points gives weather

GET 
localhost:3000/locations/weather/2

res = [
    todays next 3 hour checkpoint weather 3, 6, 9, 12, 15, 18 etc,
    tomorrows at 3 pm,
    tomorrows tomorrows at 3 pm,
    etc
]

## Gives locations filtered by distance from the user, and tags

POST
localhost:3000/locations/filter

req.body =
{
  "user_location": {
    "latitude": 51,
    "longitude": 0
  },
  "tags": {
    "Woodlands": false,
    "Hiking": false,
    "Park": false,
    "Garden": false,
    "Historic": false,
    "Beach": false,
    "Camping": false,
    "Wildlife": true,
    "Farm": false,
    "Rivers": false
  },
  "filter_distance": 200
}

res = 
[location1, location2]

## Gives reccomendations sorted by rating in 20 km radius

POST 
localhost:3000/locations/recomendations

req.body = 
{
  "user_location": {
    "latitude": 51,
    "longitude": 0
  }
}

res = 
{
  "recommendations": [location1, location2]
}