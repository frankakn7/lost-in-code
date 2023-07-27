import * as Phaser from "phaser";
/**
 * Configuration for Tilemap data used to load tilemap etc
 */
export type TilemapConfig = {
    /**
     * The tileset image file used for the tilemap
     */
    tilesetImage;
    /**
     * Name of the tileset as specified in the tilemap data (e.g. name used inside Tiled)
     */
    tilesetName: string;
    /**
     * tilemap in json format (load the json using require before passing)
     */
    tilemapJson;
    /**
     * The layer array index value, or if a string is given, the layer name from Tiled that corresponds to the background or floor layer
     */
    floorLayer: string | number;
    /**
     * The layer array index value, or if a string is given, the layer name from Tiled that corresponds to the layer with player collidable tiles
     */
    collisionLayer?: string | number;
    /**
     * The layer array index value, or if a string is given, the layer name from Tiled that corresponds to the layer with interactableObjects
     */
    objectsLayer?: string | number;
}