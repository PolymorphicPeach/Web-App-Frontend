import * as THREE from 'three';
import HighlightSquare from "@/assets/dungeon/classes/HighlightSquare.js";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import {TTFLoader} from 'three/examples/jsm/loaders/TTFLoader.js';

export default class Grid{
    constructor(
        size = 20
    ){
        this.gridGroup = new THREE.Group();
        this.cubeGroup = new THREE.Group();
        this.markerGroup = new THREE.Group();
        this.startSet = false;
        this.goalSet = false;
        this.startCube = null;
        this.goalCube = null;
        this.sleepTime = 500;
        this.font = null;
        this.performingSearch = false;

        const fontLoader = new FontLoader();
        fontLoader.load("/fonts/droid_serif_regular.typeface.json",
            (font) => {
                // ... yeah, you really have to do this
                this.font = font;
        }, undefined, (error) => {
            console.error("Grid could not load font");
        });


        const gridMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(size, size),
            new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                visible: false
            })
        );
        gridMesh.name = "gridMesh";
        gridMesh.rotateX(-Math.PI / 2);
        this.gridGroup.add(gridMesh);
        this.size = 20;

        this.gridHelper = new THREE.GridHelper(size, size);
        this.gridHelper.name = "gridHelper";
        this.gridGroup.add(this.gridHelper);

        this.cells = new Map();

        for(let i = 0; i < size; ++i){
            for(let j = 0; j < size; ++j){
                this.cells.set(`${j},${i}`, 0); // Use a map with keys as coordinate strings
            }
        }
    }

    deleteCubes(){
        this.performingSearch = false;

        this.cubeGroup.children.forEach(child => {
            if(child.geometry){
                child.geometry.dispose();
            }
            if(child.material){
                if(Array.isArray(child.material)){
                    child.material.forEach(material => material.dispose());
                }
                else{
                    child.material.dispose();
                }
            }
            if(child.material && child.material.map){
                child.material.map.dispose();
            }
        });
        this.cubeGroup.clear();

        // clear cell map
        this.cells.forEach((value, key, map) =>{
            map.set(key, 0);
        });
    }

    deleteMarkers(){
        this.performingSearch = false;

        this.markerGroup.children.forEach(child => {
            if(child.geometry){
                child.geometry.dispose();
            }
            if(child.material){
                if(Array.isArray(child.material)){
                    child.material.forEach(material => material.dispose());
                }
                else{
                    child.material.dispose();
                }
            }
            if(child.material && child.material.map){
                child.material.map.dispose();
            }
        });
        this.markerGroup.clear();
    }

    highlight(x, z){
        const highlight = new HighlightSquare();
        highlight.mesh.position.set(x, 0, z);
        this.cubeGroup.add(highlight.mesh);
    }

    spaceOccupied(coordinates){
        return this.cells.get(coordinates) !== 0;
    }

    worldToCoordinateConversion(intersection){
        const cellCoordinates = new THREE.Vector3()
            .copy(intersection.point)
            .floor()
            .addScalar(0.5);

        cellCoordinates.x = Math.round(cellCoordinates.x + this.size / 2 - 1);
        cellCoordinates.z = Math.round(cellCoordinates.z + this.size / 2 - 1);

        return `${cellCoordinates.x},${cellCoordinates.z}`
    }

    intersectionToCubeCoordinateConversion(intersection){
        const cubeCoords = new THREE.Vector3()
            .copy(intersection.point)
            .floor()
            .addScalar(0.5);

        cubeCoords.y = 0.5;

        return cubeCoords;
    }

    addObject(type, intersection){
        const coordinates = this.worldToCoordinateConversion(intersection);

        if(this.spaceOccupied(coordinates)){
            return;
        }

        const separatedCoords = coordinates.split(',');
        const x = parseInt(separatedCoords[0], 10);
        const z = parseInt(separatedCoords[1], 10);
        let color;

        switch(type){
            case "Start":
                this.setStart(x, z, intersection);
                break;

            case "Goal":
                this.setGoal(x,z,intersection);
                color = "green";
                break;

            case "Obstacle":
                this.cells.set(coordinates, 3);
                const obstacleCube = new THREE.Mesh(
                    new THREE.BoxGeometry(1,1,1),
                    new THREE.MeshBasicMaterial({
                        color: "red",
                        side: THREE.DoubleSide
                    })
                )
                const worldCoords = this.intersectionToCubeCoordinateConversion(intersection);
                obstacleCube.position.set(worldCoords.x, worldCoords.y, worldCoords.z);
                this.cubeGroup.add(obstacleCube);
                this.cells.set(coordinates, -1);
                break;

            default:
        }
    }

    setStart(x, z, intersection){
        if(this.performingSearch){
            return;
        }

        const key = `${x},${z}`;

        if(this.startSet && this.startCube){
            this.cells.set(key, 0);
            this.cubeGroup.remove(this.startCube);

            if(this.startCube.geometry){
                this.startCube.geometry.dispose();
            }
            if(this.startCube.material){
                this.startCube.material.dispose();
            }
        }

        this.startCube = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({
                color: "blue",
                side: THREE.DoubleSide
            })
        );

        const worldCoords = this.intersectionToCubeCoordinateConversion(intersection);
        this.startCube.position.set(worldCoords.x, worldCoords.y, worldCoords.z);

        // force update
        this.startCube.needsUpdate = true;

        this.cubeGroup.add(this.startCube);
        this.cells.set(key, 1);
        this.startSet = true;
    }

    setGoal(x, z, intersection){
        if(this.performingSearch){
            return;
        }

        const key = `${x},${z}`;

        if(this.goalSet && this.goalCube){
            this.cells.set(key, 0);
            this.cubeGroup.remove(this.goalCube);

            if(this.goalCube.geometry){
                this.goalCube.geometry.dispose();
            }
            if(this.goalCube.material){
                this.goalCube.material.dispose();
            }
        }

        // StandardMaterial instead of BasicMaterial for emissiveness
        // * Can ignore IDE warning *
        this.goalCube = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshStandardMaterial({
                color: "green",
                side: THREE.DoubleSide,
                emissive: "green",
                emissiveIntensity: 0.5
            })
        );

        const worldCoords = this.intersectionToCubeCoordinateConversion(intersection);
        this.goalCube.position.set(worldCoords.x, worldCoords.y, worldCoords.z);

        // Force update
        this.goalCube.needsUpdate = true;

        this.cubeGroup.add(this.goalCube);
        this.cells.set(key, 2);
        this.goalSet = true;
    }

    depthFirstSearch(){
        if(this.performingSearch){
            this.deleteMarkers();
            return;
        }

        this.performingSearch = true;

        const visited = new Map();
        if(this.startCube){
            const startX = Math.round(this.startCube.position.x + this.size / 2 - 1);
            const startZ = Math.round(this.startCube.position.z + this.size / 2 - 1);

            this.depthFirstSearchRecursion(startX, startZ, visited, 0)
                .then(r => {
                    console.log("Search complete");
                });
        }
        else{
            this.depthFirstSearchRecursion(0, 0, visited, 0)
                .then(r  => {
                    console.log("Search complete");
                });
        }
    }

    async depthFirstSearchRecursion(x, z, visited, step){
        if(!this.performingSearch){
            return;
        }

        const key = `${x},${z}`;

        if(this.cells.get(key) == -1 || visited.get(key)){
            return;
        }
        if(this.cells.get(key) == 2){
            console.log("Found goal!");
            this.goalCubeFound();
            return;
        }

        visited.set(key, true);
        const visitedMarker = new THREE.Mesh(
            new THREE.BoxGeometry(1,0.25,1),
            new THREE.MeshBasicMaterial({
                color: 0x415257,
                side: THREE.DoubleSide
            })
        );
        visitedMarker.position.set(x + 0.5 - this.size / 2, 0, z + 0.5 - this.size / 2);
        this.markerGroup.add(visitedMarker);

        step += 1;

        this.labelCube(visitedMarker, step);

        await this.sleep();

        if(x < this.size - 1){
            await this.depthFirstSearchRecursion(x + 1, z, visited, step);
        }
        if(x > 0){
            await this.depthFirstSearchRecursion(x - 1, z, visited, step);
        }
        if(z < this.size - 1){
            await this.depthFirstSearchRecursion(x, z + 1, visited, step);
        }
        if(z > 0){
            await this.depthFirstSearchRecursion(x, z - 1, visited, step);
        }
    }

    goalCubeFound(){
        if(this.goalCube){
            this.performingSearch = false;
            this.goalCube.material.emissive = new THREE.Color(0x00ff00);
            this.goalCube.material.emissiveIntensity = 1;
            this.goalCube.material.needsUpdate = true;
        }
    }

    labelCube(cube, label){
        if(!this.font){
            console.error("Font was not loaded.");
            return;
        }

        const textGeometry = new TextGeometry(label.toString(), {
            font: this.font,
            size: 0.25,
            height: 0.25,
            depth: 0.1,
            curveSegments: 6,
        });

        const textMaterial = new THREE.MeshBasicMaterial({
            color: 0x57bcf5,
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(cube.position.x, 0.25, cube.position.z);
        this.markerGroup.add(textMesh);
    }

    sleep(){
        return new Promise(resolve => setTimeout(resolve, this.sleepTime));
    }
}