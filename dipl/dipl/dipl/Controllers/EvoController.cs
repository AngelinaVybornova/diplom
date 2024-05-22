using evoSim.data;
using evoSim.logic;
using Microsoft.AspNetCore.Mvc;

namespace dipl.Controllers
{
    [ApiController]
    [Route("evoSim")]
    public class EvoController : ControllerBase
    {
        AnimalsService animalsService = new AnimalsService();
        SimService simService = new SimService();

        [HttpPost("checkUser")]
        public bool isRegistered(User user)
        {
            //smth
            return true;
        }

        [HttpPost("login")]
        public bool Login(User user)
        {
            return true;
        }

        [HttpPost("signUp")]
        public bool SignUp(User user)
        {
            return true;
        }

        [HttpGet("generateRandomly")]
        public CurrentState GenerateRandomly(UserFirstRandom userFirstRandom)
        {
            return animalsService.GenerateRandomly(userFirstRandom.mapSettings);
        }

        [HttpGet("generateFromSettings")]
        public CurrentState GenerateFromSettings(UserFirstSettings userFirstSettings)
        {
            return animalsService.GenerateFromSettings(userFirstSettings.mapSettings, userFirstSettings.startPopulaton);
        }

        [HttpGet("mainSimLoop")]
        public CurrentState MainSimLoop(UserData userData)
        {
            return simService.MainSimLoop(userData.CurrentState);
        }
    }
}