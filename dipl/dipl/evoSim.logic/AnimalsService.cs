using evoSim.data;

namespace evoSim.logic
{
    public class AnimalsService
    {
        private int _startNumPercent = 30;
        private int _mutationProb = 40;

        public CurrentState GenerateRandomly(MapSettings map)
        {
            var animalsNum = GenerateStartNumber(map.animalsCap);
            var animals = new List<Animal>();
            var foods = new List<Food>();

            for (int i = 0; i < animalsNum; i++)
            {
                var genome = GenerateGenome();
                var animal = new Animal();
                animal.genome = genome;
                animal.decipheredGenome = DecipherGenome(genome);
                animal.health = animal.decipheredGenome.maxHealth;
                animal.hunger = 50;
                animal.target = null;
                animal.turnAngle = 0;
                animal.state = State.Wandering;
                animal.id = i;
                animal.coordinates = GenerateRandomCoords(map.size);
                animals.Add(animal);
            }

            var foodNum = animalsNum/2;

            for (int i = 0; i < foodNum; i++)
            {
                var food = new Food()
                {
                    id = i,
                    coordinates = GenerateRandomCoords(map.size),
                    type = true
                };
                foods.Add(food);
            }

            return new CurrentState
            {
                map = map,
                animals = animals,
                food = foods
            };
        }

        public CurrentState GenerateFromSettings(MapSettings map, StartPopulaton populaton)
        {
            var animals = new List<Animal>();
            var foods = new List<Food>();
            int totalAnimals = 0;

            foreach (Animal animal in populaton.animalList)
            {
                for (int i = 0; i < populaton.numOfAnimalsInSpecies[animal]; i++)
                {
                    var newAnimal = new Animal();
                    newAnimal.genome = animal.genome;
                    newAnimal.decipheredGenome = DecipherGenome(animal.genome);
                    newAnimal.health = animal.decipheredGenome.maxHealth;
                    newAnimal.hunger = 50;
                    newAnimal.target = null;
                    newAnimal.turnAngle = 0;
                    newAnimal.state = State.Wandering;
                    newAnimal.id = i;
                    newAnimal.coordinates = GenerateRandomCoords(map.size);
                    animals.Add(newAnimal);
                    totalAnimals++;
                }
            }

            var foodNum = totalAnimals / 2;

            for (int i = 0; i < foodNum; i++)
            {
                var food = new Food()
                {
                    id = i,
                    coordinates = GenerateRandomCoords(map.size),
                    type = true
            };
                foods.Add(food);
            }

            return new CurrentState
            {
                map = map,
                animals = animals,
                food = foods
            };
        }

        private int GenerateStartNumber(int animalsCap)
        {
            return animalsCap / 100 * _startNumPercent;
        }

        public int[] GenerateRandomCoords(int[] mapSize)
        {
            var rnd = new Random();
            int[] coords = new int[2];
            coords[0] = rnd.Next(mapSize[0] + 1);
            coords[1] = rnd.Next(mapSize[1] + 1);
            return coords;
        }

        public string GenerateGenome() 
        {
            string genome = string.Empty;
            var rnd = new Random();
            for (int i = 0; i < 48; i++) //48 - количество разрядов геномной строки
            {
                genome += rnd.Next(10).ToString();
            }
            return genome;
        }

        public DecipheredGenome DecipherGenome(string genome)
        {
            var decGen = new DecipheredGenome();
            var diet = int.Parse(genome[0].ToString());
            if (diet <=4) { decGen.diet = false; } else { decGen.diet = true; }
            var headColor = genome.Substring(1, 9);
            decGen.headColor = DecipherColor(headColor);
            var bodyColor = genome.Substring(10, 9);
            decGen.bodyColor = DecipherColor(bodyColor);
            var eyeColor = genome.Substring(19, 9);
            decGen.eyeColor = DecipherColor(eyeColor);
            decGen.mouthType = Decipher4TypedType(genome, 28);
            decGen.eyeType = Decipher4TypedType(genome, 30);
            decGen.headType = Decipher4TypedType(genome, 32);
            decGen.bodyType = Decipher4TypedType(genome, 34);
            decGen.additionalType = Decipher4TypedType(genome, 36);
            decGen.maxHealth = int.Parse(genome.Substring(38, 3));
            decGen.speed = int.Parse(genome.Substring(41, 2));
            decGen.biteForce = int.Parse(genome.Substring(43, 3));
            decGen.panicTime = int.Parse(genome.Substring(46, 1));
            var repr = int.Parse(genome[47].ToString());
            if (repr <= 4) { decGen.reprodType = false; } else { decGen.reprodType = true; }

            return decGen;
        }

        public string SingleReprod(Animal parent)
        {
            string genome = parent.genome;
            genome = Mutate(genome);
            return genome;
        }

        public string CrossoverReprod(Animal parent1, Animal parent2)
        {
            string genome = parent1.genome.Substring(0, 23) + parent2.genome.Substring(24, 47);
            genome = Mutate(genome);
            return genome;
        }

        public List<Animal> AddNewAnimal (List<Animal> animals, string genome, int[] parentCoordinates)
        {
            var animal = new Animal();
            animal.genome = genome;
            animal.decipheredGenome = DecipherGenome(genome);
            animal.health = animal.decipheredGenome.maxHealth;
            animal.hunger = 50;
            animal.target = null;
            animal.turnAngle = 0;
            animal.state = State.Wandering;
            animal.id = GetFreeAnimalId(animals);
            animal.coordinates = parentCoordinates;
            animals.Add(animal);
            return animals;
        }

        public List<Animal> DeleteDeadAnimals(List<Animal> animals)
        {
            foreach (var animal in animals)
            {
                if (animal.health <= 0 || animal.hunger <= 0)
                {
                    animals.Remove(animal);
                }
            }

            return animals;
        }

        private Color DecipherColor(string color)
        {
            return new Color
            {
                R = (int.Parse(color.Substring(0, 3))) / 999 * 255,
                G = (int.Parse(color.Substring(3, 3))) / 999 * 255,
                B = (int.Parse(color.Substring(7, 3))) / 999 * 255
            };
        }

        private int GetFreeAnimalId(List<Animal> entities)
        {
            int id = 0;
            while (entities.Find(e => e.id == id) != null) { id++; }
            return id;
        }

        private string Mutate(string genome)
        {
            var rnd = new Random();
            if (rnd.Next(0, _mutationProb++) > _mutationProb) { return genome; }
            var numOfMutations = rnd.Next(0, 48);
            var charGenome = genome.ToCharArray();

            for (int i = 0; i < numOfMutations; i++)
            {
                var mutatedLetterId = rnd.Next(0, 48);
                charGenome[mutatedLetterId] = char.Parse(rnd.Next(10).ToString());
            }

            return charGenome.ToString();
        }

        private int GetFreeFoodId(List<Food> entities)
        {
            int id = 0;
            while (entities.Find(e => e.id == id) != null) { id++; }
            return id;
        }

        private int Decipher4TypedType(string genome, int index)
        {
            string num = string.Empty;
            var n1 = int.Parse(genome[index].ToString());
            if (n1 <= 4) { num += 0; } else { num += 1; }
            var n2 = int.Parse(genome[index++].ToString());
            if (n2 <= 4) { num += 0; } else { num += 1; }
            return int.Parse(num);
        }
    }
}