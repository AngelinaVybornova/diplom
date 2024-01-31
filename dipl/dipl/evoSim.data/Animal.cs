using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace evoSim.data
{
    internal class Animal: Entity
    {
        string genome;
        int hunger;
        int health;
        Entity target;
        int turnAngle;
        int state;
    }
}
