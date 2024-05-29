using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace evoSim.data
{
    public class User
    {
        public string login { get; set; } = String.Empty;
        public string password { get; set; } = String.Empty;
    }

    public class UserData
    {
        public User User { get; set; } = null;
        public CurrentState CurrentState { get; set; } = null;
    }

    public class UserFirstRandom
    {
        public User User { get; set; } = null;
        public MapSettings mapSettings { get; set; } = null;
    }

    public class UserFirstSettings
    {
        public User User { get; set; } = null;
        public StartPopulaton startPopulaton { get; set; } = null;
        public MapSettings mapSettings { get; set; } = null;
    }
}
