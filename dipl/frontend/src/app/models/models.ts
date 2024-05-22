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
    public numOfAnimalsInSpecies: { [animal: Animal]: number};
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
    public string genome;
    public int hunger;
    public int health;
    public Entity? target;
    public int turnAngle;
    public State state;
    public DecipheredGenome decipheredGenome;
}

export enum State
{
    Wandering,
    Panic,
    Hungry,
    Mate
}

export class DecipheredGenome {
    public bool diet;
    public Color headColor;
    public Color bodyColor;
    public Color eyeColor;
    public int mouthType;
    public int eyeType;
    public int headType;
    public int bodyType;
    public int additionalType;
    public int maxHealth;
    public int speed;
    public int biteForce;
    public int panicTime;
    public bool reprodType;
}

export class Color
{
    public int R;
    public int G;
    public int B;
}

export class AnimalInfo
{
    public int panicTimer;
    public int reprTimer;
    public bool isAttacked;
}

export class Food extends Entity
{
    public bool type;
}