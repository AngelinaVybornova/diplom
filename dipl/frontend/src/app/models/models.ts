export class User
{
    public login: string;
    public password: string;
}

export class UserData
{
    public User: User;
    public CurrentState: CurrentState;
}

export class UserFirstRandom
{
    public User: User;
    public mapSettings: MapSettings;
}

export class UserFirstSettings
{
    public User: User;
    public startPopulaton: StartPopulaton;
    public mapSettings: MapSettings;
}

export class MapSettings
{
    public size: number[];
    public animalsCap: number;
    public foodAppearenceProb: number;
}

export class StartPopulaton
{
    public animalList: Animal[];
    public numOfSpecies: number;
    public numOfAnimalsInSpecies: Map<Animal, number>;
}

export class CurrentState
{
    public map: MapSettings;
    public animals: Animal[];
    public food: Food[];
}

export class Entity
{
    public id: number;
    public coordinates: number[];
    public enType: EnType;
}

export enum EnType
{
    Food,
    Animal
}

export class Animal extends Entity
{
    public genome: string;
    public hunger: number;
    public health: number;
    public target: Entity | null;
    public turnAngle: number;
    public state: State;
    public decipheredGenome: DecipheredGenome;
}

export enum State
{
    Wandering,
    Panic,
    Hungry,
    Mate
}

export class DecipheredGenome {
    public diet: boolean;
    public headColor: Color;
    public bodyColor: Color;
    public eyeColor: Color;
    public mouthType: number;
    public eyeType: number;
    public headType: number;
    public bodyType: number;
    public additionalType: number;
    public maxHealth: number;
    public speed: number;
    public biteForce: number;
    public panicTime: number;
    public reprodType: boolean;
}

export class Color
{
    public R: number;
    public G: number;
    public B: number;
}

export class AnimalInfo
{
    public panicTimer: number;
    public reprTimer: number;
    public isAttacked: boolean;
}

export class Food extends Entity
{
    public type: boolean;
}