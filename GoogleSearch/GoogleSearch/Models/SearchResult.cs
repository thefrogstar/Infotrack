using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Collections.Generic;

namespace GoogleSearch.Models
{
    public class SearchResult
    {
        public string resultsPage { get; set; }
        public string targetURL { get; set; }

        private string hitRegex { get
            {
                //The "<div class=" tags look a little unreliable, otherwise I would use those instead of the lazy modifiers
                return @"<a href=""\/url\?q=(https:\/\/" + targetURL.Replace("/", "\\/") + @".*?)&amp;sa=U.*?"">.*?<h3.*?<div.*?>(.*?)<.*?<div.*?>.*?<\/div><\/a>";
            } 
        }

         public SearchResult(string resultsPage, string targetURL)
        {
            this.resultsPage = resultsPage;
            this.targetURL = targetURL;
        }

        //I am using a List<KVP> because I do not know whether Google might return the same URL in two different hits, I would hope not but dictionary key violation seems a weak reason to fall over.
        public (IEnumerable<Finding>, int) GetFindings()
        {
            MatchCollection matches = Regex.Matches(resultsPage, hitRegex);

            return (matches.Select(m => new Finding { URL = HttpUtility.HtmlDecode(m.Groups[1].Value), comment = m.Groups[2].Value }), matches.Count);
        }
    }
}
