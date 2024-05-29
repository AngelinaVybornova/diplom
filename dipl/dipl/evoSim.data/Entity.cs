using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace evoSim.data
{
    public class Entity
    {
        public int id { get; set; } = 0;
        public int[] coordinates { get; set; } = new int[2];
        public EnType enType { get; set; } = EnType.Food;
    }

    public enum EnType
    {
        Food,
        Animal
    }
}
