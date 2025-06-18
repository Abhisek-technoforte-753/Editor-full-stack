using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using editor_backend.Data;
using editor_backend.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;
using System.IO;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Newtonsoft.Json.Linq;  // ✅ Required for JObject, JToken, JArray

namespace editor_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExportWordTipTap : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public ExportWordTipTap(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

      

        // ✅ NEW: Dummy static JSON data
        [HttpGet("dummy")]
        public IActionResult GetDummyJson()
        {
            var dummy = new
            {
                type = "doc",
                content = new[]
                {
                    new { type = "paragraph", content = new[] { new { type = "text", text = "Hello from dummy!" } } },
                    new { type = "paragraph", content = new[] { new { type = "text", text = "Static JSON example here." } } }
                }
            };

            return Ok(dummy);
        }

        
    }
}
// The errors are due to missing using directives for Newtonsoft.Json.Linq types.
// Add the following using directive at the top of your file:

