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
        public string genome { get; set; } = null;
        public int hunger { get; set; } = 0;
        public int health { get; set; } = 0;
        public Entity? target { get; set; } = null;
        public int turnAngle { get; set; } = 0;
        public State state { get; set; } = State.Wandering;
        public DecipheredGenome decipheredGenome { get; set; } = null;
    }

    public enum State
    {
        Wandering,
        Panic,
        Hungry,
        Mate
    }

    public class DecipheredGenome {
        public bool diet { get; set; } = false;
        public Color headColor { get; set; } = null;
        public Color bodyColor { get; set; } = null;
        public Color eyeColor { get; set; } = null;
        public int mouthType { get; set; } = 0;
        public int eyeType { get; set; } = 0;
        public int headType { get; set; } = 0;
        public int bodyType { get; set; } = 0;
        public int additionalType { get; set; } = 0;
        public int maxHealth { get; set; } = 0;
        public int speed { get; set; } = 0;
        public int biteForce { get; set; } = 0;
        public int panicTime { get; set; } = 0;
        public bool reprodType { get; set; } = false;
    }

    public class Color
    {
        public int R { get; set; } = 0;
        public int G { get; set; } = 0;
        public int B { get; set; } = 0;
    }

    public class AnimalInfo
    {
        public int panicTimer { get; set; } = 0;
        public int reprTimer { get; set; } = 0  ;
        public bool isAttacked { get; set; } = false;
    }
}
