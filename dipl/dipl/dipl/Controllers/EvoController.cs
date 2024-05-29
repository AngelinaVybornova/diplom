using evoSim.data;
using evoSim.logic;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace dipl.Controllers
{
    [ApiController]
    //[EnableCors("AllowSpecificOrigin")]
    [Route("evoSim")]
    public class EvoController : ControllerBase
    {
        AnimalsService animalsService = new AnimalsService();
        SimService simService = new SimService();

        [HttpPost("checkUser")]
        public bool isRegistered([FromBody] User user)
        {
            //smth
            return true;
        }

        [HttpPost("login")]
        public bool Login([FromBody] User user)
        {
            return true;
        }

        [HttpPost("signUp")]
        public bool SignUp([FromBody] User user)
        {
            return true;
        }

        [HttpPost("generateRandomly")]
        public CurrentState GenerateRandomly([FromBody] UserFirstRandom userFirstRandom)
        {
            return animalsService.GenerateRandomly(userFirstRandom.mapSettings);
        }

        [HttpPost("generateFromSettings")]
        public CurrentState GenerateFromSettings([FromBody] UserFirstSettings userFirstSettings)
        {
            return animalsService.GenerateFromSettings(userFirstSettings.mapSettings, userFirstSettings.startPopulaton);
        }

        [HttpPost("mainSimLoop")]
        public CurrentState MainSimLoop([FromBody] UserData userData)
        {
            return simService.MainSimLoop(userData.CurrentState);
        }
    }
}