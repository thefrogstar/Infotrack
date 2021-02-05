import React, { Component } from 'react';
import './Home.css';

export class Home extends Component {
    static displayName = Home.name;

    constructor() {
        super()
        this.state = {
            resultsAvailable: false,
            isError: false,
            errorMessage: "",
            results: ""
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault()

        const json = {}
        Array.prototype.forEach.call(event.target.elements, (element) => {
            if (element.id == "keywordsbox") { json["keywordCSV"] = element.value }
            else if (element.id == "URLbox") { json["targetURL"] = element.value }
            else if (element.id == "hitLimitbox") { json["hitLimit"] = parseInt(element.value) }
        })

        const response = await fetch("https://localhost:44357/api/Search", {            
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(json),
            mode: "cors"
        })
            .catch(error => {
                console.log(error)
                this.setState({ isError: true, resultsAvailable: false, errorMessage: error });
            })
            .then(response => {
                return response.json();
            }).then(json => 
                this.setState({ resultsAvailable: true, isError: false, results:json }));

        
    }

    render() {
        var resultList = null;
        var hitCount = "";
        var error = "";
        if (this.state.resultsAvailable) {
            var parsedResultList = JSON.parse(this.state.results)
            resultList = parsedResultList.HitList.map((hit) => <li><span class="blueText">{hit.URL}</span> <span class="greenText">{hit.comment}</span></li>
            );
            if (parsedResultList.HitCount == 0) { hitCount = "Found no results, please check your search criteria" }
            else if (parsedResultList.HitCount == 1) {
                hitCount = "Found 1 Result";
            }
            else {
                hitCount = "Found " + parsedResultList.HitCount + " Results";
            }
        }
        else { resultList = "" }

        return (
            <div>
                <h1>Welcome to a simple utility to report the number of times a given address appears in Google search results</h1>
                <form onSubmit={this.handleSubmit}>
                    <ul>
                        <li>
                    <label htmlFor="keywordsbox">Search words (with spaces between as you would in Google search)</label>
                            <input type="text" id="keywordsbox" name="keywordsbox" multiple="multiple" defaultValue="land registry search" />
                        </li>
                        <li>
                    <label htmlFor="URLbox">Address to find in search </label>
                            <input type="text" id="URLbox" width="100" defaultValue="www.infotrack.co.uk" />
                        </li>
                        <li>
                    <label htmlFor="hitLimitbox">If you want to search futher you can change the number of hits to consider in the box below, however larger numbers are likely to take longer</label>
                            <input type="number" step="1" min="1" id="hitLimitbox" defaultValue="100"/>
                        </li>
                    </ul>
                    <label htmlFor="submitButton"></label>
                            <input id="submitButton" type="submit" value="GO!" />
                </form>
                <div id="Results" className={this.state.resultsAvailable ? "" : "hidden"}>
                    <h2>{hitCount}</h2>
                    <ul>
                        {resultList}                        
                    </ul>
                </div>

                <div id="Failure" className={this.state.isError ? "" : "hidden"}>
                    <h2>There was an error running the search: </h2>
                    <span>{this.state.errorMessage}</span>
                </div>
            </div>
        );
    }
}
