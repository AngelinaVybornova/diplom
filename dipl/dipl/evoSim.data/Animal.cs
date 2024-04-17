using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace evoSim.data
{
    public class Animal : Entity
    {
        public string genome;
        public int hunger;
        public int health;
        public Entity? target;
        public int turnAngle;
        public State state;
        public DecipheredGenome decipheredGenome;
    }

    public enum State
    {
        Wandering,
        Panic,
        Hungry,
        Mate
    }

    public class DecipheredGenome {
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

    public class Color
    {
        public int R;
        public int G;
        public int B;
    }

    public class AnimalInfo
    {
        public int panicTimer;
        public int reprTimer;
        public bool isAttacked;
    }
}
