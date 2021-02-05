using GoogleSearch.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Cors;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GoogleSearch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        [EnableCors("CORSOrigins")]
        [HttpPost]
        public async Task<IActionResult> Post(SearchCriteria search)
        {
            string resultsPage;
            using (WebClient webClient = new WebClient())
            {
                webClient.QueryString.Add("num", search.hitLimit.ToString());
                webClient.QueryString.Add("q", string.Join('+', search.keywordCSV.Split(' ')));
                resultsPage = await webClient.DownloadStringTaskAsync(new Uri("https://www.google.co.uk/search"));
            }

            (IEnumerable<Finding>, int) findings = new SearchResult(resultsPage, search.targetURL).GetFindings();

            JObject jobj = new JObject();
            jobj.Add(new JProperty("HitCount", findings.Item2));
            jobj["HitList"] = JArray.Parse(JsonConvert.SerializeObject(findings.Item1));
            
            return Ok(jobj.ToString());
        }
    }
}
