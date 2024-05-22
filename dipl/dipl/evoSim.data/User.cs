using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace evoSim.data
{
    public class User
    {
        public string login;
        public string password;
    }

    public class UserData
    {
        public User User;
        public CurrentState CurrentState;
    }

    public class UserFirstRandom
    {
        public User User;
        public MapSettings mapSettings;
    }

    public class UserFirstSettings
    {
        public User User;
        public StartPopulaton startPopulaton;
        public MapSettings mapSettings;
    }
}
