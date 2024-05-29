using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace evoSim.data
{
    public class CurrentState
    {
        public MapSettings map { get; set; } = null;
        public List<Animal> animals { get; set; } = null;
        public  List<Food> food { get; set; } = null;
    }
}
