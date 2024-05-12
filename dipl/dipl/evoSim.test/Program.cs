// See https://aka.ms/new-console-template for more information
using evoSim.data;
using evoSim.logic;

var service = new AnimalsService();
var service2 = new SimService();
MapSettings map = new MapSettings
{
    size = new int[] { 1000, 1000 },
    animalsCap = 100,
    foodAppearenceProb = 0.5F
};

var popul = service.GenerateRandomly(map);

var animals = new List<Animal>();
animals.Add(popul.animals[0]);
animals.Add(popul.animals[1]);
animals.Add(popul.animals[2]);

Dictionary<Animal, int> nums = new Dictionary<Animal, int>();

foreach (var animal in animals)
{
    nums.Add(animal, 10);
}

StartPopulaton startPopulaton = new StartPopulaton
{
    animalList = animals,
    numOfSpecies = 3,
    numOfAnimalsInSpecies = nums
};

var population = service.GenerateFromSettings(map, startPopulaton);
for (int i = 0; i < 2000;  i++)
{
    service2.MainSimLoop(population);
    if (population.animals.Count == 0)
    {
        Console.WriteLine("aaaa");
    }
}
Console.WriteLine("aaaa");

/*double centerX = 1; // координата x центра окружности
double centerY = 2; // координата y центра окружности
double radius = 5; // радиус окружности
double pointX = 100; // координата x данной точки
double pointY = 200; // координата y данной точки

double dx = pointX - centerX;
double dy = pointY - centerY;
double distance = Math.Sqrt(dx * dx + dy * dy);

double closestX = centerX + dx * radius / distance;
double closestY = centerY + dy * radius / distance;

Console.WriteLine("Координаты ближайшей точки на окружности: ({0}, {1})", closestX, closestY);*/
/*
// Координаты точки A
double pointAX = 301;
double pointAY = 302;

// Координаты точки B
double pointBX = 301;
double pointBY = 303;

double pointCX = 0, pointCY = 0;

if (pointAX == pointBX && pointAY == pointBY)
{
    Console.WriteLine("Точки совпадают, невозможно построить прямую.");
}
else if (pointAX == pointBX)
{
    // Две точки совпадают по координате X, прямая вертикальная
    pointCX = pointAX;
    pointCY = pointAY + 200 * (-Math.Sign(pointBY - pointAY));
}
else if (pointAY == pointBY)
{
    // Две точки совпадают по координате Y, прямая горизонтальная
    pointCX = pointAX + 200 * (-Math.Sign(pointBX - pointAX));
    pointCY = pointAY;
}
else
{
    double k = (pointBY - pointAY) / (pointBX - pointAX);

    double deltaX = 200 / Math.Sqrt(1 + k * k);
    double deltaY = k * deltaX;

    double directionX = pointAX - pointBX;
    double directionY = pointAY - pointBY;

    pointCX = pointAX + deltaX * Math.Sign(directionX);
    pointCY = pointAY + deltaY * Math.Sign(directionY);
}

Console.WriteLine("Координаты точки C: ({0}, {1})", pointCX, pointCY);*/