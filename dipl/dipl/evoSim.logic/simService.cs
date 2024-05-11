using evoSim.data;

namespace evoSim.logic
{
    internal class SimService
    {
        Dictionary<Animal, AnimalInfo> _infos;
        int _healAmount = 10;
        int _hungerTrshld = 30;
        int _healthPrcntTrshld = 40;
        int _viewRadius = 200;
        int _collisionRadius = 50;
        int _reprDelay = 3;
        int _speedMultiplier = 10;
        int _meatCost = 30;
        int _herbCost = 10;
        int _hungerLoopCost = 3;
        int _maxFoodInLoop = 10;
        AnimalsService _service = new AnimalsService();

        public CurrentState MainSimLoop (CurrentState state)
        {
            state = MainBehaviourLoop(state);
            state = GenerateFood(state);
            state = _service.DeleteDeadAnimals(state);
            return state;
        }
        
        public CurrentState MainBehaviourLoop(CurrentState state)
        {
            if (_infos == null)
            {
                FillInfos(state.animals);
            }
            foreach (var animal in state.animals)
            {
                animal.hunger -= _hungerLoopCost;
                if (_infos[animal].reprTimer > 0)
                {
                    _infos[animal].reprTimer--;
                }

                if (animal.health < animal.decipheredGenome.maxHealth)
                {
                    animal.health += _healAmount;
                    if (animal.health > animal.decipheredGenome.maxHealth)
                    {
                        animal.health = animal.decipheredGenome.maxHealth;
                    }
                }
                if (_infos[animal].isAttacked)
                {
                    animal.state = State.Panic;
                    _infos[animal].panicTimer = animal.decipheredGenome.panicTime;
                    _infos[animal].isAttacked = false;
                }

                if (animal.state == State.Panic) {
                    if (_infos[animal].panicTimer > 0)
                    {
                        var attacker = state.animals.Find(tanimal => tanimal.id == animal.target.id);
                        animal.target.coordinates = attacker.coordinates;
                        animal.target.id = attacker.id;
                        animal.target.enType = EnType.Animal;
                        RunFromAttacker(animal, state.map);
                        _infos[animal].panicTimer--;
                        continue;
                    } else
                    {
                        animal.target = null;
                    }
                }

                if (animal.hunger <= _hungerTrshld)
                {
                    animal.state = State.Hungry;
                    if (animal.target == null)
                    {
                        var food = FindClosestFood(animal, state);

                        animal.target = food;
                    }
                    if (animal.target != null)
                    {
                        if (IsInsideRadius(animal.coordinates[0], animal.coordinates[1], _collisionRadius, animal.target.coordinates[0], animal.target.coordinates[1]))
                        {
                            if (animal.target.enType == EnType.Food)
                            {
                                var food = state.food.Find(tfood => tfood.id == animal.target.id);
                                if (food.type) //мясо
                                {
                                    animal.hunger += _meatCost;
                                    animal.target = null;
                                }
                                else
                                {
                                    animal.health += _herbCost;
                                    animal.target = null;
                                }
                                state.food.Remove(food);
                            }
                            else if (!animal.decipheredGenome.diet)
                            {
                                var prey = state.animals.Find(tanimal => tanimal.id == animal.target.id);
                                prey.health -= animal.decipheredGenome.biteForce;
                                if (prey.health > 0)
                                {
                                    _infos[prey].isAttacked = true;
                                    prey.target.coordinates = animal.coordinates;
                                    prey.target.id = animal.id;
                                    prey.target.enType = EnType.Animal;

                                    animal.target.coordinates = prey.coordinates;
                                    animal.target.id = prey.id;
                                    animal.target.enType = EnType.Animal;
                                } else
                                {
                                    animal.target = null;
                                }
                            }
                        }
                        else
                        {
                            MoveToTarget(animal, state.map, animal.target.coordinates[0], animal.target.coordinates[1]);
                        }
                        continue;
                    }
                }

                if (animal.state != State.Hungry && ((animal.health * 100)/animal.decipheredGenome.maxHealth > _healthPrcntTrshld) && _infos[animal].reprTimer == 0)
                {
                    animal.state = State.Mate;
                    if (!animal.decipheredGenome.reprodType)
                    {
                        _infos[animal].reprTimer = _reprDelay;
                        var newGen = _service.SingleReprod(animal);
                        _service.AddNewAnimal(state.animals, newGen, animal.coordinates);
                        continue;
                    }

                    if (animal.target == null)
                    {
                        var mate = FindClosestMate(animal, state);

                        if (mate != null)
                        {
                            animal.target.coordinates = mate.coordinates;
                            animal.target.id = mate.id;
                            animal.target.enType = EnType.Animal;
                        } else
                        {
                            animal.target = null;
                        }
                    }

                    if (animal.target != null && IsInsideRadius(animal.coordinates[0], animal.coordinates[1], _collisionRadius, animal.target.coordinates[0], animal.target.coordinates[1]))
                    {
                        var mate = state.animals.Find(tanimal => tanimal.id == animal.target.id); 
                        _infos[animal].reprTimer = _reprDelay;
                        _infos[mate].reprTimer = _reprDelay;
                        var newGen = _service.CrossoverReprod(animal, mate);
                        _service.AddNewAnimal(state.animals, newGen, animal.coordinates);
                    } else
                    {
                        MoveToTarget(animal, state.map, animal.target.coordinates[0], animal.target.coordinates[1]);
                    }
                    continue;
                }

                animal.state = State.Wandering;
                SetRandomPosition(animal, state);
            }

            return state;
        }

        private CurrentState GenerateFood(CurrentState state)
        {
            var rnd = new Random();
            var prob = rnd.Next(0, 101) / 100;
            if (prob > state.map.foodAppearenceProb)
            {
                var foodCount = rnd.Next(0, _maxFoodInLoop + 1);
                for (int i = 0; i < foodCount; i++)
                {
                    var piece = new Food
                    {
                        id = _service.GetFreeFoodId(state.food),
                        coordinates = _service.GenerateRandomCoords(state.map.size),
                        type = false
                    };

                    state.food.Add(piece);
                }
            }

            return state;
        }

        private void FillInfos(List<Animal> animals)
        {
            foreach (var animal in animals)
            {
                _infos.Add(animal, new AnimalInfo {
                    panicTimer = 0,
                    reprTimer = 0,
                    isAttacked = false
                });
            }
        }

        private void SetRandomPosition(Animal animal, CurrentState state)
        {
            var rnd = new Random();
            int minX = animal.coordinates[0] - _viewRadius; 
            int minY = animal.coordinates[1] - _viewRadius; 
            int maxX = animal.coordinates[0] + _viewRadius; 
            int maxY = animal.coordinates[1] + _viewRadius;
            int x = 0; int y = 0;
            if (animal.coordinates[0] - _viewRadius < 0)
            {
                minX = 0;
            }
            if (animal.coordinates[0] + _viewRadius > state.map.size[0])
            {
                maxX = state.map.size[0];
            }

            if (animal.coordinates[1] - _viewRadius < 0)
            {
                minY = 0;
            }
            if (animal.coordinates[1] + _viewRadius > state.map.size[1])
            {
                maxY = state.map.size[1];
            }

            do
            {
                x = rnd.Next(minX, maxX + 1);
                y = rnd.Next(minY, maxY + 1);
            }
            while (!IsInsideRadius(animal.coordinates[0], animal.coordinates[1], animal.decipheredGenome.speed * _speedMultiplier, x, y));
            animal.coordinates[0] = x;
            animal.coordinates[1] = y;
        }

        private Entity FindClosestFood(Animal animal, CurrentState state)
        {
            List<Entity> avalables = new List<Entity>();
            if (animal.decipheredGenome.diet) //травоядное
            {
                foreach (var food in state.food)
                {
                    if (IsInsideRadius(animal.coordinates[0], animal.coordinates[1], _viewRadius, food.coordinates[0], food.coordinates[1]) && food.type)
                    {
                        var tfood = new Entity
                        {
                            coordinates = food.coordinates,
                            id = food.id,
                            enType = EnType.Food
                        };
                        avalables.Add(tfood);
                    }
                }
            }
            else //хищник
            {
                foreach (var food in state.food)
                {
                    if (IsInsideRadius(animal.coordinates[0], animal.coordinates[1], _viewRadius, food.coordinates[0], food.coordinates[1]) && !food.type)
                    {
                        var tfood = new Entity
                        {
                            coordinates = food.coordinates,
                            id = food.id,
                            enType = EnType.Food
                        };
                        avalables.Add(tfood);
                    }
                }

                if (avalables.Count == 0)
                {
                    foreach (var targetAnimal in state.animals)
                    {
                        if (IsInsideRadius(animal.coordinates[0], animal.coordinates[1], _viewRadius, targetAnimal.coordinates[0], targetAnimal.coordinates[1]) && targetAnimal.id != animal.id)
                        {
                            var tanimal = new Entity
                            {
                                coordinates = targetAnimal.coordinates,
                                id = targetAnimal.id,
                                enType = EnType.Animal
                            };
                            avalables.Add(tanimal);
                        }
                    }
                }
            }

            Entity closest = null;
            double closestDistance = int.MaxValue;

            foreach (var avalable in avalables)
            {
                var dist = GetDistance(animal.coordinates[0], animal.coordinates[1], avalable.coordinates[0], avalable.coordinates[1]);
                if (dist < closestDistance) {
                    closest = avalable;
                    closestDistance = dist;
                }
            }

            return closest;
        }

        private Animal FindClosestMate(Animal animal, CurrentState state)
        {
            List<Animal> avalables = new List<Animal>();

            foreach (var targetAnimal in state.animals)
            {
                if (IsInsideRadius(animal.coordinates[0], animal.coordinates[1], _viewRadius, targetAnimal.coordinates[0], targetAnimal.coordinates[1]) && targetAnimal.id != animal.id && !targetAnimal.decipheredGenome.reprodType && ((targetAnimal.health * 100) / targetAnimal.decipheredGenome.maxHealth > _healthPrcntTrshld) && _infos[targetAnimal].reprTimer == 0)
                {
                    avalables.Add(targetAnimal);
                }
            }

            Animal closest = new Animal();
            double closestDistance = int.MaxValue;

            foreach (var avalable in avalables)
            {
                var dist = GetDistance(animal.coordinates[0], animal.coordinates[1], avalable.coordinates[0], avalable.coordinates[1]);
                if (dist < closestDistance)
                {
                    closest = avalable;
                    closestDistance = dist;
                }
            }

            return closest;
        }

        private bool IsInsideRadius(int xc, int yc, int radius, int xt, int yt)
        {
            double length = Math.Sqrt(((xc - xt) * (xc - xt)) + ((yc - yt) * (yc - yt)));
            return length <= radius;
        }

        private double GetDistance(int xc, int yc, int xt, int yt)
        {
            return Math.Sqrt(((xc - xt) * (xc - xt)) + ((yc - yt) * (yc - yt)));
        }

        private void RunFromAttacker(Animal animal, MapSettings map)
        {
            int pointCX = 0, pointCY = 0;
            if (animal.coordinates[0] == animal.target.coordinates[0] && animal.coordinates[1] == animal.target.coordinates[1]) {
                animal.target.coordinates[0] += 1;
                animal.target.coordinates[1] += 1;
            }
            else if (animal.coordinates[0] == animal.target.coordinates[0])
            {
                // Две точки совпадают по координате X, прямая вертикальная
                pointCY = animal.coordinates[1] + _viewRadius * (-Math.Sign(animal.coordinates[1] - animal.target.coordinates[1]));
                pointCX = animal.coordinates[0];
                MoveToTarget(animal, map, pointCX, pointCY);
            }
            else if (animal.coordinates[1] == animal.target.coordinates[1])
            {
                // Две точки совпадают по координате Y, прямая горизонтальная
                pointCX = animal.coordinates[0] + _viewRadius * (-Math.Sign(animal.target.coordinates[0] - animal.coordinates[0]));
                pointCY = animal.coordinates[1];
                MoveToTarget(animal, map, pointCX, pointCY);
            }

            double k = (animal.target.coordinates[1] - animal.coordinates[1]) / (animal.target.coordinates[0] - animal.coordinates[0]);

            // Находим координаты точки, лежащей на прямой на расстоянии 200 от точки A
            double distance = _viewRadius;
            double deltaX = distance / Math.Sqrt(1 + k * k);
            double deltaY = k * deltaX;

            // Определяем направление от точки B к точке A
            double directionX = animal.coordinates[0] - animal.target.coordinates[0];
            double directionY = animal.coordinates[1] - animal.target.coordinates[1];

            // Находим координаты искомой точки
            pointCX = (int)(animal.coordinates[0] + deltaX * (directionX >= 0 ? 1 : -1));
            pointCY = (int)(animal.coordinates[1] + deltaY * (directionY >= 0 ? 1 : -1));

            MoveToTarget(animal, map, pointCX, pointCY);
        }

        private void MoveToTarget(Animal animal, MapSettings map, int xt, int yt)
        {
            if (xt < 0)
            {
                xt = 0;
            }
            if (xt > map.size[0])
            {
                xt = map.size[0];
            }

            if (yt < 0)
            {
                yt = 0;
            }
            if (yt > map.size[1])
            {
                yt = map.size[1];
            }
            if (IsInsideRadius(animal.coordinates[0], animal.coordinates[1], (animal.decipheredGenome.speed + 1) * _speedMultiplier, xt, yt))
            {
                animal.coordinates[0] = xt;
                animal.coordinates[1] = yt;
            } else
            {
                double dx = xt - animal.coordinates[0];
                double dy = yt - animal.coordinates[1];
                double distance = Math.Sqrt(dx * dx + dy * dy);

                double closestX = animal.coordinates[0] + dx * ((animal.decipheredGenome.speed + 1) * _speedMultiplier) / distance;
                double closestY = animal.coordinates[1] + dy * ((animal.decipheredGenome.speed + 1) * _speedMultiplier) / distance;

                animal.coordinates[0] = (int)closestX;
                animal.coordinates[1] = (int)closestY;
            }
        }
    }
}
