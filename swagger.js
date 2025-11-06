{
  "openapi": "3.0.3",
  "info": {
    "title": "Adventurers Guild API",
    "version": "1.0.0",
    "description": "Local API docs"
  },
  "servers": [
    { "url": "http://localhost:8080" }
  ],
  "components": {
    "securitySchemes": {
      "bearerAuth": { "type": "http", "scheme": "bearer", "bearerFormat": "JWT" }
    },
    "schemas": {
      "Character": {
        "type": "object",
        "required": ["name","race","class","level","hitPoints","strength","dexterity","constitution","intelligence","wisdom","charisma","owner"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string", "example": "Dai Jing" },
          "race": { "type": "string", "example": "Halfling" },
          "class": { "type": "string", "example": "Monk" },
          "level": { "type": "integer", "minimum": 1, "maximum": 20, "example": 5 },
          "alignment": { "type": "string", "example": "NG" },
          "background": { "type": "string", "example": "Country doctor" },
          "hitPoints": { "type": "integer", "minimum": 1, "example": 38 },
          "strength": { "type": "integer", "minimum": 1, "maximum": 30, "example": 10 },
          "dexterity": { "type": "integer", "minimum": 1, "maximum": 30, "example": 18 },
          "constitution": { "type": "integer", "minimum": 1, "maximum": 30, "example": 12 },
          "intelligence": { "type": "integer", "minimum": 1, "maximum": 30, "example": 14 },
          "wisdom": { "type": "integer", "minimum": 1, "maximum": 30, "example": 16 },
          "charisma": { "type": "integer", "minimum": 1, "maximum": 30, "example": 12 },
          "owner": { "type": "string", "description": "MongoId of user" },
          "campaign": { "type": "string", "nullable": true, "description": "MongoId of campaign" }
        }
      }
    }
  },
  "security": [{ "bearerAuth": [] }],
  "paths": {
    "/healthz": {
      "get": {
        "tags": ["Health"],
        "summary": "Liveness probe",
        "responses": { "200": { "description": "OK" } }
      }
    },
    "/characters": {
      "get": {
        "tags": ["Characters"],
        "summary": "List characters",
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": { "type": "array", "items": { "$ref": "#/components/schemas/Character" } }
              }
            }
          },
          "401": { "description": "Unauthorized" }
        }
      },
      "post": {
        "tags": ["Characters"],
        "summary": "Create character",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": { "schema": { "$ref": "#/components/schemas/Character" } }
          }
        },
        "responses": {
          "201": { "description": "Created" },
          "400": { "description": "Validation error" },
          "401": { "description": "Unauthorized" }
        }
      }
    },
    "/characters/{id}": {
      "parameters": [
        { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }
      ],
      "get": {
        "tags": ["Characters"],
        "summary": "Get character by id",
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": { "description": "OK", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Character" } } } },
          "401": { "description": "Unauthorized" },
          "404": { "description": "Not found" }
        }
      },
      "put": {
        "tags": ["Characters"],
        "summary": "Update character",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": { "schema": { "$ref": "#/components/schemas/Character" } }
          }
        },
        "responses": {
          "200": { "description": "Updated" },
          "400": { "description": "Validation error" },
          "401": { "description": "Unauthorized" },
          "404": { "description": "Not found" }
        }
      },
      "delete": {
        "tags": ["Characters"],
        "summary": "Delete character",
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "204": { "description": "Deleted" },
          "401": { "description": "Unauthorized" },
          "404": { "description": "Not found" }
        }
      }
    }
  }
}
