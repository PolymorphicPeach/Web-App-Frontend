import * as THREE from 'three';

export default class DungeonItemBase {
    constructor(name){
        this.name = name;
    }

    getMesh(){
        return null;
    }

    getPosition(){
        return null;
    }
}