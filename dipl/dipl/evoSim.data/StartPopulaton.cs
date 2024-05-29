using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace evoSim.data
{
    public class StartPopulaton
    {
        public List<Animal> animalList { get; set; } = null;
        public int numOfSpecies { get; set; } = 0;
        public Dictionary<Animal, int> numOfAnimalsInSpecies { get; set; } = null;
    }
}
