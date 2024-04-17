using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace evoSim.data
{
    public class Entity
    {
        public int id;
        public int[] coordinates = new int[2];
        public EnType enType;
    }

    public enum EnType
    {
        Food,
        Animal
    }
}
