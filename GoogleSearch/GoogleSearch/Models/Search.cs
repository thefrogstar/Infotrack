namespace GoogleSearch.Models
{
    public class SearchCriteria
    {
        public int hitLimit { get; set; }
        public string targetURL { get; set; }
        public string keywordCSV { get; set; }
    }
}
